<template>
    <div class="donwload-mandate">
        <PImage
        type="paupulse"
        name="ok"
        fit="fill"
        class="download-mandate__illustration"
        />
        <h4 class="download-mandate__title">
            {{t('generated-mandate')}}
        </h4>
        <div class="download-mandate__body">
            <p>
                {{t('download')}} <span class="download-mandate__body--weight">
                    {{t('manual-sign')}}
                </span>
            </p>
            <p>{{t('deposit')}}</p>
        </div>
        <PFileCard
            name="mandat-1000308253-12248236612-signature.pdf"
            format="PDF"
            size=""
            hasIcon
            hasButton
            class="download-mandate__file-card"
        >
            <template #icon>
                <PIcon>
                    <PIFiletypePdf />
                </PIcon>
            </template>
            <template #buttons>
                <PButton
                    type="white"
                    size="default"
                    :plain="false"
                    data-testid="download-prefilled-mandate"
                    @click="downloadMandate()"
                >
                    <PIcon>
                    <PIDownload />
                    </PIcon>
                </PButton>
            </template>
        </PFileCard>
        <div class="download-mandate__button">
            <PButton
            type="primary"
            size="default"
            plain
            @click="$emit('close-create-mandate-drawer')"
            >
                {{t('close-button')}}
            </PButton>
        </div>
    </div>
</template>

<i18n lang="yaml">
    en-US:
        generated-mandate: 'The mandate is generated !'
        manual-sign: 'manual sign.'
        download: 'Download the mandate for'
        deposit: 'Once signed, upload the mandate to KPMG Pulse to activate the collection.'
        close-button: 'Close page'
    fr-FR:
        generated-mandate: 'Le mandat est généré !'
        manual-sign: 'signature manuscrite.'
        download: 'Téléchargez dès maintenant le mandat pour'
        deposit: 'Une fois signé, déposez le mandat sur KPMG Pulse pour activer la collecte.'
        close-button: 'Fermer la page'
</i18n>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n'
// import { inject } from 'vue'
import {
  PFileCard,
  // PILoader,
  PIcon,
  PButton,
  PIFiletypePdf,
  PIDownload,
  PImage
} from '@kpmg/styleguide'
import { downloadDocumentById } from '@/services/mandate'
// const toastPlugin:any = inject('toast')

defineEmits(['close-create-mandate-drawer'])
const downloadMandate = async () => {
  // const { data, headers } = await downloadDocumentById(
  await downloadDocumentById(
    (progressEvent: any) => {
      /* const downloadProgress = Math.round(
        (progressEvent.loaded / progressEvent.total) * 100
      ) */
      // eslint-disable-next-line no-console
      console.log('Progress object ', progressEvent)
      // openLoading()
      /* context.commit('setDownloadFile', {
          isDownloading: true,
          downloadPercentage: downloadProgress
        }) */
    }
  )
}

/* const openLoading = () => {
  toastPlugin({
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    icon: PILoader,
    showClose: false,
    customClass: 'loading',
    position: 'bottom-right',
    duration: 2000
  })
} */

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
        margin-bottom: 24px;
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
        font-weight: 600;
        line-height: 120%;
        margin-bottom: 8px;
    }
    &__body {
        text-align: center;
        color: var(--el-color-neutral-gray-900);
        font-size: 1.4rem;
        font-style: normal;
        font-weight: 400;
        line-height: 140%;
        margin-bottom: 24px;
        &--weight {
            font-weight: 600;
        }
    }
    &__file-card {
        margin: 0 76px 49.5px;
    }
    &__button {
        display: flex;
        justify-content: center;
    }
}
</style>
