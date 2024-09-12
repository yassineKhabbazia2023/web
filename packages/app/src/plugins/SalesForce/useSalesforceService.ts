import { ref } from 'vue'
import {
  VITE_SFCHAT_URL_SANDBOX,
  VITE_SFCHAT_BUTTON_ID,
  VITE_SFCHAT_URL_LIVEAGENT,
  VITE_SFCHAT_QUEUE_ID,
  VITE_SFCHAT_QUEUE_NAME,
  VITE_SFCHAT_BASE_LIVE_AGENT_CONTENT_URL,
  VITE_SFCHAT_DEPLOYMENT_ID,
  VITE_SFCHAT_BASE_LIVE_AGENT_URL,
  VITE_SFCHAT_SET_ATTRIBUTE_PATH,
} from 'env-vars'

const envstrDomain = window.location.hostname
const envurlSandbox = VITE_SFCHAT_URL_SANDBOX
const envurlLiveagent = VITE_SFCHAT_URL_LIVEAGENT
const envqueueId = VITE_SFCHAT_QUEUE_ID
const envqueueName = VITE_SFCHAT_QUEUE_NAME
const envbaseLiveAgentContentURL = VITE_SFCHAT_BASE_LIVE_AGENT_CONTENT_URL
const envdeploymentId = VITE_SFCHAT_DEPLOYMENT_ID
const envbuttonId = VITE_SFCHAT_BUTTON_ID
const envbaseLiveAgentURL = VITE_SFCHAT_BASE_LIVE_AGENT_URL
const envsetAttributePath = VITE_SFCHAT_SET_ATTRIBUTE_PATH

export const useSalesforceService = () => {
  const isChatDisplayed = ref(false)

  const salesforceChat = (
    firstname: string,
    lastname: string,
    email: string,
    companyName: string,
    accountNumber: string,
    targetElement: Element,
    urlSandbox = envurlSandbox,
    urlLiveagent = envurlLiveagent,
    queueId = envqueueId,
    queueName = envqueueName,
    baseLiveAgentContentURLSales = envbaseLiveAgentContentURL,
    deploymentIdSales = envdeploymentId,
    buttonIdSales = envbuttonId,
    strDomain = envstrDomain,
    setAttributePath = envsetAttributePath,
    baseLiveAgentURLSales = envbaseLiveAgentURL,
    // eslint-disable-next-line max-len
    avatarImgPath = 'https://kpmg--c.eu12.content.force.com/sfc/dist/version/renditionDownload?rendition=ORIGINAL_Png&versionId=0681r00000Btoj0&operationContext=DELIVERY&contentId=05T1r00000egP6D&page=0&d=/a/1r0000002FLj/z8oM_.GNiZCtQNpABTL0dHoLVUdI5ij_kJ.j56U4_hk&oid=00D1r000002eSVR&dpt=null&viewId=', // =''//Production : Avatar image
  ) => {
    const initESW = (gslbBaseURL: string | null) => {
      window.embedded_svc.settings.targetElement = targetElement
      window.embedded_svc.settings.displayHelpButton = true
      window.embedded_svc.settings.language = 'fr'
      window.embedded_svc.settings.onlineLoadingText = 'Chargement'
      window.embedded_svc.settings.loadingText = 'Chargement'
      window.embedded_svc.settings.avatarImgURL = avatarImgPath
      window.embedded_svc.settings.defaultMinimizedText = "Besoin d'aide ?"
      window.embedded_svc.settings.disabledMinimizedText =
        'Conseillers hors ligne'
      window.embedded_svc.settings.offlineSupportMinimizedText = "Besoin d'aide ?"
      window.embedded_svc.settings.storageDomain = strDomain
      window.embedded_svc.settings.extraPrechatFormDetails = [
        { label: 'FirstName', value: firstname, displayToAgent: true },
        { label: 'LastName', value: lastname, displayToAgent: true },
        { label: 'Email', value: email, displayToAgent: true },
        { label: 'Name', value: companyName, displayToAgent: true },
        { label: 'IBS', value: accountNumber, displayToAgent: true },
      ]
      window.embedded_svc.settings.extraPrechatInfo = [
        {
          entityFieldMaps: [
            {
              doCreate: false,
              doFind: true,
              fieldName: 'Email',
              isExactMatch: true,
              label: 'Email',
            },
          ],
          entityName: 'Contact',
          showOnCreate: true,
          linkToEntityField: 'ContactId',
          saveToTranscript: 'ContactId',
        },
        {
          entityFieldMaps: [
            {
              doCreate: false,
              doFind: true,
              fieldName: 'IBS_Number__c',
              isExactMatch: true,
              label: 'IBS',
            },
          ],
          entityName: 'Account',
          showOnCreate: true,
          linkToEntityField: 'AccountId',
          saveToTranscript: 'AccountId',
        },
      ]
      window.embedded_svc.settings.enabledFeatures = ['LiveAgent']
      window.embedded_svc.settings.entryFeature = 'LiveAgent'

      window.embedded_svc.addEventHandler('afterDestroy', () => {
        window.productFruits.api.inAppCenter.show()
        window.productFruits.api.inAppCenter.close()
        isChatDisplayed.value = false
      })

      window.embedded_svc.addEventHandler('afterMinimize', () => {
        window.embedded_svc.liveAgentAPI.endChat()
      })

      window.embedded_svc.init(
        urlSandbox,
        urlLiveagent,
        gslbBaseURL,
        queueId,
        queueName,
        {
          baseLiveAgentContentURL: baseLiveAgentContentURLSales,
          deploymentId: deploymentIdSales,
          buttonId: buttonIdSales,
          baseLiveAgentURL: baseLiveAgentURLSales,
          eswLiveAgentDevName: queueName,
          isOfflineSupportEnabled: true,
        },
      )
    }
    if (!window.embedded_svc) {
      const s = document.createElement('script')
      s.setAttribute('src', setAttributePath)
      s.onload = () => {
        initESW(null)
      }
      document.body.appendChild(s)
    } else {
      initESW('https://service.force.com')
    }
  }

  return { isChatDisplayed, salesforceChat }
}
