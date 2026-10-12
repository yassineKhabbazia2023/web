<template>
  <div class="pdf-text-extraction">
    <h2 class="section-title">
      PDF Text Extraction POC
    </h2>
    <p class="intro">
      Démonstration de l'extraction de texte à partir d'un PDF avec PDF.js.
      Uploadez un PDF contenant du texte sélectionnable pour voir l'extraction en action.
    </p>

    <!-- Upload Section -->
    <div class="section-group">
      <h3 class="subsection-title">
        1. Upload du PDF
      </h3>
      <p class="subsection-description">
        Sélectionnez un fichier PDF. Note : seuls les PDF avec texte embarqué
        sont supportés (pas d'OCR sur les images/scans).
      </p>

      <PUpload
        v-model="selectedPdfFile"
        pAccept=".pdf"
        pPrefixLabelFileLine="Glissez-déposez ou "
        pSuffixLabelFileLine="parcourir"
        pAuthorizedFileFormat="PDF"
        pTextLimitSize="10Mo"
        @update:model-value="handleFileSelected"
      />
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-section">
      <PLoader pType="primary" pSize="32" />
      <span class="loading-text">Extraction du texte en cours...</span>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-section">
      <PIcon
        pName="exclamationTriangle"
        :color="AppColors.RED_500"
        size="24"
      />
      <span class="error-text">{{ error }}</span>
    </div>

    <!-- Warning: No RIB data found -->
    <div v-if="noRibDataFound && !isLoading" class="warning-section">
      <PIcon
        pName="exclamationTriangle"
        :color="AppColors.ORANGE_500"
        size="24"
      />
      <div class="warning-content">
        <span class="warning-title">Aucune donnée bancaire détectée</span>
        <span class="warning-text">
          Le PDF a été lu mais aucun IBAN, BIC ou coordonnées RIB n'ont été trouvés.
          Vérifiez que le document contient bien un RIB avec du texte sélectionnable (pas une image scannée).
        </span>
      </div>
    </div>

    <!-- Results Section -->
    <template v-if="extractionResult && !isLoading">
      <!-- Pre-filled Form Demo -->
      <div class="section-group">
        <h3 class="subsection-title">
          2. Données RIB extraites
        </h3>
        <p class="subsection-description">
          Extraction automatique des données bancaires (RIB) à partir du PDF.
          Les champs sont pré-remplis avec les valeurs détectées par pattern matching.
        </p>

        <div class="form-demo">
          <h4 class="form-section-title">
            Coordonnées bancaires (RIB)
          </h4>

          <div class="form-row">
            <div class="form-field form-field--full">
              <label class="field-label">IBAN</label>
              <PInput
                v-model="formData.iban"
                pPlaceholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-field form-field--full">
              <label class="field-label">BIC / SWIFT</label>
              <PInput
                v-model="formData.bic"
                pPlaceholder="BNPAFRPP"
              />
            </div>
          </div>

          <div class="form-row form-row--four">
            <div class="form-field">
              <label class="field-label">Code banque</label>
              <PInput
                v-model="formData.bankCode"
                pPlaceholder="XXXXX"
              />
            </div>
            <div class="form-field">
              <label class="field-label">Code guichet</label>
              <PInput
                v-model="formData.branchCode"
                pPlaceholder="XXXXX"
              />
            </div>
            <div class="form-field">
              <label class="field-label">N° de compte</label>
              <PInput
                v-model="formData.accountNumber"
                pPlaceholder="XXXXXXXXXXX"
              />
            </div>
            <div class="form-field">
              <label class="field-label">Clé RIB</label>
              <PInput
                v-model="formData.ribKey"
                pPlaceholder="XX"
              />
            </div>
          </div>

          <div class="form-actions">
            <PButton pType="secondary" @click="resetForm">
              Réinitialiser
            </PButton>
          </div>
        </div>
      </div>

      <!-- Extracted Text (Debug) -->
      <div class="section-group">
        <h3 class="subsection-title">
          3. Texte brut extrait
        </h3>
        <p class="subsection-description">
          {{ extractionResult.pageCount }} page(s) traitée(s) -
          {{ extractionResult.items.length }} éléments de texte extraits.
        </p>

        <div class="extracted-text-container">
          <div class="extracted-text-header">
            <span>Texte brut extrait</span>
            <button class="copy-btn" @click="copyText">
              Copier le texte
            </button>
          </div>
          <pre class="extracted-text">{{ extractionResult.fullText }}</pre>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import PUpload from '../../atoms/PUpload'
import PLoader from '../../atoms/PLoader'
import PIcon from '../../atoms/PIcon'
import PInput from '../../atoms/PInput'
import PButton from '../../atoms/PButton'
import { AppColors } from '../../utils/AppColorsEnum'
import { useCopyClipboard } from '../../utils/clipboard'
import { PdfTextExtractor, type ExtractedTextResult } from '@pulse/toolbox/utils/pdf-text-extractor'
import { RibExtractionService } from '@pulse/toolbox/utils/rib-extraction'

/** Initial form data structure for RIB fields */
const INITIAL_FORM_DATA = {
  iban: '',
  bic: '',
  bankCode: '',
  branchCode: '',
  accountNumber: '',
  ribKey: '',
}

const selectedPdfFile = ref<File | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)
const extractionResult = ref<ExtractedTextResult | null>(null)
const noRibDataFound = ref(false)

const formData = reactive({ ...INITIAL_FORM_DATA })

const handleFileSelected = async (file: File | null) => {
  if (file === null) {
    return
  }

  if (!file.type.includes('pdf')) {
    error.value = 'Veuillez sélectionner un fichier PDF valide.'
    return
  }

  isLoading.value = true
  error.value = null
  extractionResult.value = null
  noRibDataFound.value = false

  try {
    const arrayBuffer = await file.arrayBuffer()
    const result = await PdfTextExtractor.extractAllText(arrayBuffer)
    extractionResult.value = result

    // Extract RIB data using the generic service and pre-fill form
    const ribData = RibExtractionService.extract(result.fullText)

    // Check if any RIB data was found
    noRibDataFound.value = ribData.confidence === 0

    formData.iban = ribData.iban || ''
    formData.bic = ribData.bic || ''
    formData.bankCode = ribData.bankCode || ''
    formData.branchCode = ribData.branchCode || ''
    formData.accountNumber = ribData.accountNumber || ''
    formData.ribKey = ribData.ribKey || ''
  } catch (err) {
    error.value = `Erreur lors de l'extraction : ${err instanceof Error ? err.message : 'Erreur inconnue'}`
  } finally {
    isLoading.value = false
  }
}

const copyText = async () => {
  if (extractionResult.value) {
    await useCopyClipboard(extractionResult.value.fullText)
  }
}

const resetForm = () => {
  Object.assign(formData, INITIAL_FORM_DATA)
}
</script>

<style scoped>
.pdf-text-extraction {
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--p-surface-basic-primary, #FFFFFF);
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--p-text-basic-heading, #0E0F30);
  margin-bottom: 16px;
}

.intro {
  margin-bottom: 32px;
  color: var(--p-text-basic-body, #15171A);
  line-height: 1.6;
  font-size: 16px;
}

.section-group {
  margin-bottom: 48px;
}

.subsection-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--p-text-basic-heading, #0E0F30);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--p-stroke-neutral-neutral, #CDD1D4);
}

.subsection-description {
  color: var(--p-text-basic-body, #15171A);
  margin-bottom: 24px;
  line-height: 1.5;
}

/* Loading State */
.loading-section {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: var(--p-surface-information-lighter, #E3F2FD);
  border-radius: 8px;
  margin-bottom: 32px;
}

.loading-text {
  color: var(--p-text-basic-information-primary, #126778);
  font-weight: 500;
}

/* Error State */
.error-section {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: var(--p-surface-error-lighter, #FFEBEE);
  border-radius: 8px;
  margin-bottom: 32px;
}

.error-text {
  color: var(--p-text-error-primary, #C62828);
  font-weight: 500;
}

/* Warning State */
.warning-section {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 24px;
  background: var(--p-surface-warning-lighter, #FFF3E0);
  border-radius: 8px;
  margin-bottom: 32px;
}

.warning-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.warning-title {
  color: var(--p-text-warning-primary, #E65100);
  font-weight: 600;
}

.warning-text {
  color: var(--p-text-warning-secondary, #F57C00);
  font-weight: 400;
  line-height: 1.5;
}

/* Extracted Text Container */
.extracted-text-container {
  border: 1px solid var(--p-stroke-neutral-neutral, #CDD1D4);
  border-radius: 8px;
  overflow: hidden;
}

.extracted-text-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--p-surface-neutral-lighter, #F5F7FA);
  border-bottom: 1px solid var(--p-stroke-neutral-neutral, #CDD1D4);
  font-weight: 600;
  color: var(--p-text-basic-heading, #0E0F30);
}

.copy-btn {
  padding: 8px 12px;
  font-size: 12px;
  border: 1px solid var(--p-stroke-neutral-default-primary, #ADB5BD);
  background: var(--p-surface-basic-primary, #FFFFFF);
  color: var(--p-text-basic-body, #15171A);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.copy-btn:hover {
  background: var(--p-surface-state-hover, #E7FFFF);
  border-color: var(--p-stroke-basic-hover, #0C4F41);
}

.extracted-text {
  padding: 16px;
  margin: 0;
  max-height: 400px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.5;
  color: var(--p-text-basic-body, #15171A);
  background: var(--p-surface-basic-primary, #FFFFFF);
}

/* Form Demo */
.form-demo {
  border: 1px solid var(--p-stroke-neutral-neutral, #CDD1D4);
  border-radius: 8px;
  padding: 24px;
  background: var(--p-surface-basic-primary, #FFFFFF);
}

.form-section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--p-text-basic-heading, #0E0F30);
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--p-stroke-neutral-lighter, #E0E6ED);
}

.form-section-title:not(:first-child) {
  margin-top: 32px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 24px;
}

.form-row--four {
  grid-template-columns: repeat(4, 1fr);
}

.form-row:last-child {
  margin-bottom: 0;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-field--full {
  grid-column: span 2;
}

.form-row--four .form-field--full {
  grid-column: span 4;
}

.field-label {
  font-weight: 500;
  color: var(--p-text-basic-body, #15171A);
  font-size: 14px;
}

.form-actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .form-row,
  .form-row--four {
    grid-template-columns: 1fr;
  }

  .form-field--full,
  .form-row--four .form-field--full {
    grid-column: span 1;
  }

  .pdf-text-extraction {
    padding: 16px;
  }
}
</style>
