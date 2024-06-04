export const ReloadOneTrust = () => {
  const OneTrust = (window as any).OneTrust
  const otConsentSdk = document.getElementById('onetrust-consent-sdk')
  if (otConsentSdk) {
    otConsentSdk.remove()
  }
  if (OneTrust != null) {
    OneTrust.LoadBanner()
    const otBannerSdk = document.getElementById('onetrust-banner-sdk') as HTMLElement
    const otConsentSdk = document.getElementById('onetrust-consent-sdk') as HTMLElement
    otBannerSdk.style.display = 'none'
    otConsentSdk.style.display = 'none'
    setTimeout(function() {
      const toggleDisplay = document.getElementsByClassName(
        'ot-sdk-show-settings',
      ) as HTMLCollection

      for (let i = 0; i < toggleDisplay.length; i++) {
        (toggleDisplay[i] as HTMLElement).onclick = function(event: any) {
          otConsentSdk.style.display = 'block'
          event.stopImmediatePropagation()
          OneTrust.ToggleInfoDisplay()
        }
      }
    }, 1000)
  }
}
