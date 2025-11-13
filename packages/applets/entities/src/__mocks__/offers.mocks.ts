export const getActiveOffersMocked = () => {
  const offers = [
    {
      status: 'Validée',
      offer: {
        offerName: 'Gestion Smart',
        offerCode: 'MEG Smart',
        logoName: 'meg',
        provider: 'RCA - MEG Premium',
        plans: [],
      },
    },
    {
      status: 'Rejetée',
      offer: {
        offerName: 'Mes modules de Compta',
        logoName: 'loop-color',
        offerCode: 'Loop compta',
        provider: 'CEGID (LOOP)',
      },
    },
  ]

  return offers
}
