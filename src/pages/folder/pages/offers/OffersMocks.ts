export const getActiveOffersMocked = () => {
  const offers = [
    {
      status: 'Validée',
      offer: {
        offerName: 'Gestion Smart',
        logoName: 'meg',
        provider: 'RCA - MEG Premium',
      },
    },
    {
      status: 'Rejetée',
      offer: {
        offerName: 'Mes modules de Compta',
        logoName: 'loop-color',
        provider: 'CEGID (LOOP)',
      },
    },
  ]

  return offers
}
