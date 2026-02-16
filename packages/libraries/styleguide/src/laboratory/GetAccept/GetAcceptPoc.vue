<template>
  <div class="getaccept-poc">
    <h2 class="section-title">
      POC GetAccept — Signature electronique
    </h2>
    <p class="intro">
      Test d'integration de GetAccept pour la signature electronique dans une iframe.
      Ce POC appelle directement l'API GetAccept (pas via l'API Gateway Pulse).
    </p>

    <!-- Section 1: Authentication -->
    <div class="section-group">
      <h3 class="subsection-title">
        1. Authentication
      </h3>
      <p class="subsection-description">
        Saisissez vos credentials GetAccept pour obtenir un bearer token.
      </p>

      <div class="form-grid">
        <label class="form-field">
          <span class="form-label">Email</span>
          <input
            v-model="email"
            type="email"
            class="form-input"
            placeholder="user@example.com"
          >
        </label>
        <label class="form-field">
          <span class="form-label">Password</span>
          <input
            v-model="password"
            type="password"
            class="form-input"
            placeholder="********"
          >
        </label>
      </div>

      <div class="form-actions">
        <button
          class="btn btn-primary"
          :disabled="isAuthenticating || isAuthenticated"
          @click="authenticateToGetAccept"
        >
          {{ isAuthenticating ? 'Authenticating...' : isAuthenticated ? 'Authenticated' : 'Authenticate' }}
        </button>
        <button
          v-if="isAuthenticated"
          class="btn btn-secondary"
          @click="resetAuth"
        >
          Reset
        </button>
      </div>

      <div
        v-if="authError"
        class="status-badge status-error"
      >
        {{ authError }}
      </div>
      <div
        v-if="isAuthenticated"
        class="status-badge status-success"
      >
        Authenticated — Token: {{ bearerToken.slice(0, 20) }}...
      </div>
    </div>

    <!-- Section 2: Create & Send Document -->
    <div class="section-group">
      <h3 class="subsection-title">
        2. Create & Send Document
      </h3>
      <p class="subsection-description">
        Creez un document de test et envoyez-le a un destinataire pour signature.
      </p>

      <div class="form-grid">
        <label class="form-field">
          <span class="form-label">Document name</span>
          <input
            v-model="documentName"
            type="text"
            class="form-input"
            placeholder="Test Document"
          >
        </label>
        <label class="form-field">
          <span class="form-label">Document type</span>
          <select
            v-model="documentType"
            class="form-input"
          >
            <option value="sales">
              sales
            </option>
            <option value="hr">
              hr
            </option>
            <option value="introduction">
              introduction
            </option>
            <option value="other">
              other
            </option>
          </select>
        </label>
        <label class="form-field">
          <span class="form-label">Recipient email</span>
          <input
            v-model="recipientEmail"
            type="email"
            class="form-input"
            placeholder="signer@example.com"
          >
        </label>
        <label class="form-field">
          <span class="form-label">Recipient first name</span>
          <input
            v-model="recipientFirstName"
            type="text"
            class="form-input"
            placeholder="John"
          >
        </label>
        <label class="form-field">
          <span class="form-label">Recipient last name</span>
          <input
            v-model="recipientLastName"
            type="text"
            class="form-input"
            placeholder="Doe"
          >
        </label>
        <label class="form-field">
          <span class="form-label">Recipient mobile</span>
          <input
            v-model="recipientMobile"
            type="tel"
            class="form-input"
            placeholder="+33612345678"
          >
        </label>
        <div class="form-field form-field--full">
          <span class="form-label">Document source</span>
          <div class="source-toggle">
            <label class="radio-label">
              <input
                v-model="sourceType"
                type="radio"
                value="url"
              >
              URL publique
            </label>
            <label class="radio-label">
              <input
                v-model="sourceType"
                type="radio"
                value="file"
              >
              Upload PDF
            </label>
          </div>
        </div>
        <label
          v-if="sourceType === 'url'"
          class="form-field form-field--full"
        >
          <span class="form-label">PDF URL (public)</span>
          <input
            v-model="pdfUrl"
            type="url"
            class="form-input"
            placeholder="https://example.com/document.pdf"
          >
        </label>
        <label
          v-if="sourceType === 'file'"
          class="form-field form-field--full"
        >
          <span class="form-label">PDF file (max 10 MB)</span>
          <input
            type="file"
            accept=".pdf"
            class="form-input"
            @change="onFileSelected"
          >
          <span
            v-if="fileName"
            class="file-info"
          >{{ fileName }} ({{ fileSize }})</span>
        </label>
      </div>

      <div class="form-actions">
        <button
          class="btn btn-primary"
          :disabled="isCreatingDocument || isAuthenticated === false"
          @click="createAndSendDocument"
        >
          {{ isCreatingDocument ? 'Creating...' : 'Create & Send Document' }}
        </button>
      </div>

      <div
        v-if="documentError"
        class="status-badge status-error"
      >
        {{ documentError }}
      </div>
      <div
        v-if="documentId"
        class="status-badge status-success"
      >
        Document created — ID: {{ documentId }}
      </div>
    </div>

    <!-- Section 3: Iframe / Signature -->
    <div class="section-group">
      <h3 class="subsection-title">
        3. Signature (iframe)
      </h3>
      <p class="subsection-description">
        Le document est affiche dans une iframe pour signature.
        Si GetAccept bloque l'iframe (X-Frame-Options / CSP), un lien de fallback est propose.
      </p>

      <div class="inline-field">
        <label class="form-field">
          <span class="form-label">Document ID</span>
          <input
            v-model="documentId"
            type="text"
            class="form-input"
            placeholder="e.g. 85rezamz5ze9"
          >
        </label>
        <button
          class="btn btn-primary inline-field-btn"
          :disabled="isFetchingUrl || documentId === '' || isAuthenticated === false"
          @click="fetchSigningUrl"
        >
          {{ isFetchingUrl ? 'Fetching...' : 'GET /recipients' }}
        </button>
      </div>

      <label
        v-if="recipientDocumentUrl"
        class="form-field form-field--full"
      >
        <span class="form-label">Signing URL</span>
        <input
          v-model="recipientDocumentUrl"
          type="url"
          class="form-input"
          placeholder="https://..."
        >
      </label>

      <template v-if="recipientDocumentUrl">
        <div
          v-if="iframeBlocked === false"
          class="iframe-container"
        >
          <iframe
            :src="recipientDocumentUrl"
            class="signing-iframe"
            allow="camera; microphone"
            @error="onIframeError"
          />
        </div>

        <div
          v-if="iframeBlocked"
          class="status-badge status-warning"
        >
          L'iframe semble bloquee par GetAccept (X-Frame-Options ou CSP).
          <a
            :href="recipientDocumentUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="fallback-link"
          >
            Ouvrir dans un nouvel onglet
          </a>
        </div>

        <div
          v-if="iframeBlocked === false"
          class="iframe-actions"
        >
          <a
            :href="recipientDocumentUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-secondary"
          >
            Ouvrir dans un nouvel onglet
          </a>
        </div>
      </template>
      <div
        v-else
        class="empty-state"
      >
        Aucun document a afficher. Creez et envoyez un document dans la section precedente.
      </div>
    </div>

    <!-- Section 4: Document Status -->
    <div class="section-group">
      <h3 class="subsection-title">
        4. Document Status
      </h3>
      <p class="subsection-description">
        Verifiez le statut du document et les evenements associes.
      </p>

      <div class="form-actions">
        <button
          class="btn btn-primary"
          :disabled="isCheckingStatus || documentId === ''"
          @click="checkDocumentStatus"
        >
          {{ isCheckingStatus ? 'Checking...' : 'Check Status' }}
        </button>
      </div>

      <div
        v-if="statusError"
        class="status-badge status-error"
      >
        {{ statusError }}
      </div>

      <div
        v-if="documentStatus"
        class="status-details"
      >
        <div class="status-row">
          <span class="status-label">Status:</span>
          <span
            class="status-value"
            :class="'status-value--' + documentStatus"
          >
            {{ documentStatus }}
          </span>
        </div>
        <div
          v-if="documentStatusDetails"
          class="status-row"
        >
          <span class="status-label">Details:</span>
          <pre class="status-json">{{ JSON.stringify(documentStatusDetails, null, 2) }}</pre>
        </div>
      </div>

      <div
        v-if="documentEvents.length > 0"
        class="events-section"
      >
        <h4 class="events-title">
          Events
        </h4>
        <div class="events-list">
          <div
            v-for="(event, index) in documentEvents"
            :key="index"
            class="event-item"
          >
            <span class="event-type">{{ event.type }}</span>
            <span class="event-date">{{ event.created_at }}</span>
            <span
              v-if="event.description"
              class="event-description"
            >{{ event.description }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- API Log -->
    <div
      v-if="apiLogs.length > 0"
      class="section-group"
    >
      <h3 class="subsection-title">
        API Log
      </h3>
      <div class="api-log">
        <div
          v-for="(log, index) in apiLogs"
          :key="index"
          class="log-entry"
          :class="'log-entry--' + log.level"
        >
          <span class="log-time">{{ log.time }}</span>
          <span class="log-method">{{ log.method }}</span>
          <span class="log-url">{{ log.url }}</span>
          <span class="log-status">{{ log.status }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable no-console */
import { ref } from 'vue'

const BASE_URL = 'https://api.getaccept.com/v1'

// Auth state
const email = ref('')
const password = ref('')
const bearerToken = ref('')
const isAuthenticated = ref(false)
const isAuthenticating = ref(false)
const authError = ref('')

// Document state
const documentType = ref<'sales' | 'hr' | 'introduction' | 'other'>('sales')
const documentName = ref('Test Signature Document')
const recipientEmail = ref('')
const recipientFirstName = ref('')
const recipientLastName = ref('')
const recipientMobile = ref('')
const sourceType = ref<'url' | 'file'>('url')
const pdfUrl = ref('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf')
const fileBase64 = ref('')
const fileName = ref('')
const fileSize = ref('')
const documentId = ref('')
const recipientDocumentUrl = ref('')
const isCreatingDocument = ref(false)
const documentError = ref('')

// Iframe state
const iframeBlocked = ref(false)
const isFetchingUrl = ref(false)

// Status state
const documentStatus = ref('')
const documentStatusDetails = ref<Record<string, unknown> | null>(null)
const documentEvents = ref<Array<{ type: string, created_at: string, description?: string }>>([])
const isCheckingStatus = ref(false)
const statusError = ref('')

// API log
interface ApiLog {
  time: string
  method: string
  url: string
  status: number | string
  level: 'info' | 'error'
}
const apiLogs = ref<ApiLog[]>([])

function logApi(method: string, url: string, status: number | string, level: 'info' | 'error' = 'info') {
  const time = new Date().toLocaleTimeString()
  apiLogs.value.unshift({ time, method, url, status, level })
}

async function authenticateToGetAccept() {
  isAuthenticating.value = true
  authError.value = ''

  try {
    const response = await fetch(`${BASE_URL}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    })

    logApi('POST', '/v1/auth', response.status, response.ok ? 'info' : 'error')

    if (response.ok === false) {
      const errorData = await response.json().catch(() => ({}))
      authError.value = `Authentication failed (${response.status}): ${errorData.message || response.statusText}`
      return
    }

    const data = await response.json()
    bearerToken.value = data.access_token || data.token || ''

    if (bearerToken.value === '') {
      authError.value = 'No token in response. Check the response structure in the console.'
      console.log('GetAccept auth response:', data)
      return
    }

    isAuthenticated.value = true
  } catch (error) {
    authError.value = `Network error: ${(error as Error).message}`
    logApi('POST', '/v1/auth', 'ERR', 'error')
  } finally {
    isAuthenticating.value = false
  }
}

function resetAuth() {
  bearerToken.value = ''
  isAuthenticated.value = false
  authError.value = ''
  documentId.value = ''
  recipientDocumentUrl.value = ''
  documentStatus.value = ''
  documentStatusDetails.value = null
  documentEvents.value = []
}

function onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file === undefined) {
    return
  }

  fileName.value = file.name
  const sizeMB = (file.size / 1024 / 1024).toFixed(2)
  fileSize.value = `${sizeMB} MB`

  const reader = new FileReader()
  reader.onload = () => {
    const result = reader.result as string
    // Remove the data:application/pdf;base64, prefix
    fileBase64.value = result.split(',')[1] || ''
  }
  reader.readAsDataURL(file)
}

async function createAndSendDocument() {
  isCreatingDocument.value = true
  documentError.value = ''

  try {
    const fileFields = sourceType.value === 'file'
      ? { file_content: fileBase64.value, file_name: fileName.value }
      : { file_url: pdfUrl.value }

    const payload = {
      name: documentName.value,
      type: documentType.value,
      ...fileFields,
      is_signing: true,
      is_automatic_sending: true,
      recipients: [
        {
          email: recipientEmail.value,
          first_name: recipientFirstName.value,
          last_name: recipientLastName.value,
          mobile: recipientMobile.value || undefined,
          role: 'signer',
          verify_sms_sign: true,
        },
      ],
    }

    const response = await fetch(`${BASE_URL}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken.value}`,
      },
      body: JSON.stringify(payload),
    })

    logApi('POST', '/v1/documents', response.status, response.ok ? 'info' : 'error')

    if (response.ok === false) {
      const errorData = await response.json().catch(() => ({}))
      documentError.value = `Document creation failed (${response.status}): ${errorData.message || response.statusText}`
      console.log('GetAccept create document error:', errorData)
      return
    }

    const data = await response.json()
    console.log('GetAccept create document response:', data)
    documentId.value = data.id || ''

    // Try to extract signing URL from response
    extractSigningUrl(data)

    // If no URL found, automatically try fetching recipients
    if (recipientDocumentUrl.value === '' && documentId.value !== '') {
      await fetchSigningUrl()
    }
  } catch (error) {
    documentError.value = `Network error: ${(error as Error).message}`
    logApi('POST', '/v1/documents', 'ERR', 'error')
  } finally {
    isCreatingDocument.value = false
  }
}

function onIframeError() {
  iframeBlocked.value = true
}

function extractSigningUrl(data: Record<string, unknown>) {
  // Try all known URL fields from the API response
  const recipient = (data.recipients as Array<Record<string, unknown>>)?.[0]
  const urlCandidates = [
    recipient?.document_url,
    recipient?.signing_url,
    recipient?.view_url,
    recipient?.url,
    data.document_url,
    data.signing_url,
    data.external_url,
    data.url,
  ]
  for (const url of urlCandidates) {
    if (typeof url === 'string' && url !== '') {
      recipientDocumentUrl.value = url
      return
    }
  }
}

async function fetchSigningUrl() {
  isFetchingUrl.value = true
  try {
    // Try GET /documents/{id}/recipients
    const recipientsResponse = await fetch(`${BASE_URL}/documents/${documentId.value}/recipients`, {
      headers: { Authorization: `Bearer ${bearerToken.value}` },
    })
    logApi('GET', `/v1/documents/${documentId.value}/recipients`, recipientsResponse.status, recipientsResponse.ok ? 'info' : 'error')

    if (recipientsResponse.ok) {
      const recipientsData = await recipientsResponse.json()
      console.log('GetAccept recipients response:', recipientsData)
      const recipients = Array.isArray(recipientsData) ? recipientsData : recipientsData.recipients || []
      for (const r of recipients) {
        const url = r.document_url || r.signing_url || r.view_url || r.url || ''
        if (url !== '') {
          recipientDocumentUrl.value = url
          return
        }
      }
    }

    // Try GET /documents/{id}/download for a preview URL
    const downloadResponse = await fetch(`${BASE_URL}/documents/${documentId.value}/download`, {
      headers: { Authorization: `Bearer ${bearerToken.value}` },
    })
    logApi('GET', `/v1/documents/${documentId.value}/download`, downloadResponse.status, downloadResponse.ok ? 'info' : 'error')

    if (downloadResponse.ok) {
      const downloadData = await downloadResponse.json()
      console.log('GetAccept download response:', downloadData)
      const url = downloadData.document_url || downloadData.url || ''
      if (url !== '') {
        recipientDocumentUrl.value = url
        return
      }
    }

    // Try GET /documents/{id} for full document details
    const docResponse = await fetch(`${BASE_URL}/documents/${documentId.value}`, {
      headers: { Authorization: `Bearer ${bearerToken.value}` },
    })
    logApi('GET', `/v1/documents/${documentId.value}`, docResponse.status, docResponse.ok ? 'info' : 'error')

    if (docResponse.ok) {
      const docData = await docResponse.json()
      console.log('GetAccept document details:', docData)
      extractSigningUrl(docData)
    }

    if (recipientDocumentUrl.value === '') {
      documentError.value = 'No signing URL found in any endpoint. Check console logs for raw API responses.'
    }
  } catch (error) {
    documentError.value = `Failed to fetch signing URL: ${(error as Error).message}`
  } finally {
    isFetchingUrl.value = false
  }
}

async function checkDocumentStatus() {
  isCheckingStatus.value = true
  statusError.value = ''

  try {
    const [statusResponse, eventsResponse] = await Promise.all([
      fetch(`${BASE_URL}/documents/${documentId.value}`, {
        headers: { Authorization: `Bearer ${bearerToken.value}` },
      }),
      fetch(`${BASE_URL}/documents/${documentId.value}/events`, {
        headers: { Authorization: `Bearer ${bearerToken.value}` },
      }),
    ])

    logApi('GET', `/v1/documents/${documentId.value}`, statusResponse.status, statusResponse.ok ? 'info' : 'error')
    logApi('GET', `/v1/documents/${documentId.value}/events`, eventsResponse.status, eventsResponse.ok ? 'info' : 'error')

    if (statusResponse.ok) {
      const statusData = await statusResponse.json()
      documentStatus.value = statusData.status || 'unknown'
      documentStatusDetails.value = statusData
      console.log('GetAccept document status:', statusData)
    } else {
      statusError.value = `Status check failed (${statusResponse.status})`
    }

    if (eventsResponse.ok) {
      const eventsData = await eventsResponse.json()
      documentEvents.value = eventsData.events || eventsData || []
      console.log('GetAccept document events:', eventsData)
    }
  } catch (error) {
    statusError.value = `Network error: ${(error as Error).message}`
    logApi('GET', `/v1/documents/${documentId.value}`, 'ERR', 'error')
  } finally {
    isCheckingStatus.value = false
  }
}
</script>

<style scoped>
.getaccept-poc {
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--p-surface-primary, #ffffff);
  max-width: 960px;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--p-text-heading, #0e0f30);
  margin-bottom: 16px;
}

.intro {
  margin-bottom: 32px;
  color: var(--p-text-body, #15171a);
  line-height: 1.6;
  font-size: 16px;
}

.section-group {
  margin-bottom: 48px;
}

.subsection-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--p-text-heading, #0e0f30);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--p-stroke-neutral, #cdd1d4);
}

.subsection-description {
  color: var(--p-text-body, #15171a);
  margin-bottom: 24px;
  line-height: 1.5;
}

/* Form */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-field--full {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--p-text-heading, #0e0f30);
}

.form-input {
  padding: 8px 12px;
  border: 1px solid var(--p-stroke-neutral, #cdd1d4);
  border-radius: 6px;
  font-size: 14px;
  color: var(--p-text-body, #15171a);
  background: var(--p-surface-primary, #ffffff);
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--p-stroke-hover, #0c4f41);
  box-shadow: 0 0 0 2px rgba(12, 79, 65, 0.1);
}

.source-toggle {
  display: flex;
  gap: 16px;
  margin-top: 4px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--p-text-body, #15171a);
  cursor: pointer;
}

.file-info {
  font-size: 12px;
  color: var(--p-text-body, #15171a);
  opacity: 0.7;
  margin-top: 4px;
}

.inline-field {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin-bottom: 16px;
}

.inline-field .form-field {
  flex: 1;
}

.inline-field-btn {
  white-space: nowrap;
  height: 36px;
}

.form-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

/* Buttons */
.btn {
  padding: 8px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background 0.2s ease, opacity 0.2s ease;
  text-decoration: none;
  display: inline-block;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--p-surface-highlight, #0c4f41);
  color: #ffffff;
}

.btn-primary:hover:not(:disabled) {
  background: var(--p-surface-highlight-hover, #093c32);
}

.btn-secondary {
  background: var(--p-surface-neutral-lighter, #f5f5f5);
  color: var(--p-text-body, #15171a);
  border: 1px solid var(--p-stroke-neutral, #cdd1d4);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--p-surface-neutral-light, #ebebeb);
}

/* Status badges */
.status-badge {
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 12px;
}

.status-success {
  background: rgba(0, 184, 0, 0.08);
  border: 1px solid var(--p-stroke-success, #00b800);
  color: var(--p-text-success, #0a710b);
}

.status-error {
  background: rgba(220, 38, 38, 0.08);
  border: 1px solid var(--p-stroke-error, #dc2626);
  color: var(--p-text-error, #b91c1c);
}

.status-warning {
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid var(--p-stroke-warning, #f59e0b);
  color: var(--p-text-warning, #92400e);
}

/* Iframe */
.iframe-container {
  border: 1px solid var(--p-stroke-neutral, #cdd1d4);
  border-radius: 8px;
  overflow: hidden;
  margin-top: 16px;
  margin-bottom: 12px;
}

.signing-iframe {
  width: 100%;
  height: 600px;
  border: none;
}

.iframe-actions {
  margin-bottom: 12px;
}

.fallback-link {
  font-weight: 600;
  color: inherit;
  margin-left: 8px;
}

.empty-state {
  padding: 32px;
  text-align: center;
  color: var(--p-text-body, #15171a);
  background: var(--p-surface-neutral-lighter, #f5f5f5);
  border: 1px dashed var(--p-stroke-neutral, #cdd1d4);
  border-radius: 8px;
}

/* Status details */
.status-details {
  background: var(--p-surface-neutral-lighter, #f5f5f5);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.status-row {
  margin-bottom: 12px;
}

.status-row:last-child {
  margin-bottom: 0;
}

.status-label {
  font-weight: 600;
  font-size: 13px;
  color: var(--p-text-heading, #0e0f30);
  margin-right: 8px;
}

.status-value {
  font-weight: 600;
  font-size: 14px;
  padding: 2px 8px;
  border-radius: 4px;
}

.status-value--draft {
  background: rgba(107, 114, 128, 0.15);
  color: #4b5563;
}

.status-value--sent {
  background: rgba(59, 130, 246, 0.15);
  color: #2563eb;
}

.status-value--viewed {
  background: rgba(245, 158, 11, 0.15);
  color: #92400e;
}

.status-value--signed {
  background: rgba(0, 184, 0, 0.15);
  color: #0a710b;
}

.status-json {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  background: var(--p-surface-primary, #ffffff);
  border: 1px solid var(--p-stroke-neutral-lighter, #e0e6ed);
  border-radius: 6px;
  padding: 12px;
  overflow-x: auto;
  max-height: 300px;
  margin-top: 4px;
}

/* Events */
.events-section {
  margin-top: 16px;
}

.events-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--p-text-heading, #0e0f30);
  margin-bottom: 12px;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.event-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: var(--p-surface-neutral-lighter, #f5f5f5);
  border-radius: 6px;
  font-size: 13px;
}

.event-type {
  font-weight: 600;
  color: var(--p-text-heading, #0e0f30);
  min-width: 100px;
}

.event-date {
  color: var(--p-text-body, #15171a);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
}

.event-description {
  color: var(--p-text-body, #15171a);
  flex: 1;
}

/* API Log */
.api-log {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
}

.log-entry {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px;
  border-radius: 4px;
}

.log-entry--info {
  background: var(--p-surface-neutral-lighter, #f5f5f5);
}

.log-entry--error {
  background: rgba(220, 38, 38, 0.06);
}

.log-time {
  color: var(--p-text-body, #15171a);
  opacity: 0.6;
  min-width: 80px;
}

.log-method {
  font-weight: 700;
  color: var(--p-text-heading, #0e0f30);
  min-width: 50px;
}

.log-url {
  color: var(--p-text-body, #15171a);
  flex: 1;
}

.log-status {
  font-weight: 600;
  min-width: 40px;
  text-align: right;
}
</style>
