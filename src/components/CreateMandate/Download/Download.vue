<template>
  <div class="donwload-mandate">
    <PImage
      pType="paupulse"
      pName="ok"
      pFit="fill"
      class="download-mandate__illustration margin-bottom--6"
    />
    <h4 class="download-mandate__title font-semibold margin-bottom--2">
      {{t('generated-mandate')}}
    </h4>
    <div class="download-mandate__body margin-bottom--6 font-normal">
      <p>
        {{t('download')}} <span class="font-semibold">
          {{t('manual-sign')}}
        </span>
      </p>
      <p>{{t('deposit')}}</p>
    </div>
    <PFileCard
      :pName="`unsigned-mandate-${mandateId}.pdf`"
      pFormat="PDF"
      pSize=""
      pHasIcon
      pHasButton
      class="download-mandate__file-card margin-x--6 margin-bottom--4"
    >
      <template #icon>
        <PIcon>
          <PIFiletypePdf />
        </PIcon>
      </template>
      <template #buttons>
        <PButton
          pType="white"
          pSize="default"
          data-testid="download-prefilled-mandate"
          @click="downloadMandate()"
        >
          <PIcon>
            <PIDownload />
          </PIcon>
        </PButton>
      </template>
    </PFileCard>
    <PAlert
      class="download-mandate__file-card margin-x--6 margin-bottom--4"
    >
      <p class="download-mandate__alert-title font-semibold">
        {{t('help')}}
      </p>
      <p class="download-mandate__alert-body font-normal">{{t('help-label-prefix')}}
        <a href="" class="download-mandate__alert-body--color">{{t('help-label-link')}}</a>
        {{t('help-label-suffix')}}
      </p>
    </PAlert>
  </div>
</template>

<i18n lang="yaml">
  en-US:
    generated-mandate: 'The mandate is generated !'
    manual-sign: 'manual sign.'
    download: 'Download the mandate for'
    deposit: 'Once signed, upload the mandate to KPMG Pulse to activate the collection.'
    help: 'Need help?'
    help-label-prefix: 'Consult the '
    help-label-link: 'practical guide'
    help-label-suffix: ' to ensure that the collection is active'
  fr-FR:
    generated-mandate: 'Le mandat est généré !'
    manual-sign: 'signature manuscrite.'
    download: 'Téléchargez dès maintenant le mandat pour'
    deposit: 'Une fois signé, déposez le mandat sur KPMG Pulse pour activer la collecte.'
    help: "Besoin d'aide ?"
    help-label-prefix: 'Consultez le '
    help-label-link: 'guide pratique'
    help-label-suffix: " pour garantir l'activation de la collecte"
</i18n>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n'
import {
  PFileCard,
  PIcon,
  PButton,
  PIFiletypePdf,
  PIDownload,
  PImage,
  PAlert
} from '@kpmg/styleguide'
import { downloadUnsignedMandate } from '@/services/mandate'
import { downloadFile } from '@/helpers/utils'
const props = defineProps({
  mandateId: {
    type: String,
    required: true
  }
})
declare let window: any
const downloadMandate = async () => {
  try {
    const { data } = await downloadUnsignedMandate(props.mandateId)
    if (window && 'showSaveFilePicker' in window) {
      const fileHandle = await window?.showSaveFilePicker({
        suggestedName: `unsigned-mandate-${props.mandateId}.pdf`,
        types: [{
          description: 'PDF Document',
          accept: { 'application/pdf': ['.pdf'] }
        }]
      })

      // Create a FileSystemWritableFileStream to write to
      const writableStream = await fileHandle.createWritable()

      // Write the contents of the file to the stream
      await writableStream.write(data)

      // Close the file and write the contents to disk
      await writableStream.close()
    } else {
      downloadFile(`unsigned-mandate-${props.mandateId}.pdf`, data, window)
    }
  } catch (error) {
    console.error('Error downloading file:', error)
  }
}

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

</script>
<style lang="scss">
.download-mandate {
  &__illustration {
    display: flex;
    justify-content: center;
    img {
      width: 316px;
      height: 300px;
    }
  }
  &__title {
    color: var(--el-color-neutral-gray-900);
    text-align: center;
    font-size: 2.1rem;
    font-style: normal;
    line-height: 120%;
  }
  &__body {
    text-align: center;
    color: var(--el-color-neutral-gray-900);
    font-style: normal;
    line-height: 140%;
  }
  &__button {
    display: flex;
    justify-content: center;
  }
  &__alert-title {
    font-style: normal;
    line-height: 140%;
  }
  &__alert-body {
    color: var(--pulse-color-neutral-gray-700);
    font-style: normal;
    line-height: 140%;
    &--color {
      color: var(--el-color-primary);
    }
  }
}
</style>
