export const ReloadOneTrust = () => {
  const OneTrust = (window as any).OneTrust
  const otConsentSdk = document.getElementById('onetrust-consent-sdk')
  if (otConsentSdk) {
    otConsentSdk.remove()
  }
  if (OneTrust != null) {
    OneTrust.LoadBanner()
    const otBannerSdk = document.getElementById('onetrust-banner-sdk') as HTMLElement
    if (otBannerSdk) {
      otBannerSdk.style.display = 'none'
    }
    setTimeout(function() {
      const toggleDisplay = document.getElementsByClassName(
        'ot-sdk-show-settings',
      ) as HTMLCollection

      for (let i = 0; i < toggleDisplay.length; i++) {
        (toggleDisplay[i] as HTMLElement).onclick = function(event: any) {
          event.stopImmediatePropagation()
          OneTrust.ToggleInfoDisplay()
        }
      }
    }, 1000)
  }
}
