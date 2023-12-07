export interface PColProps {
  pSpan?: number,
  pOffset?: number,
  pPush?: number,
  pPull?: number,
  pXs?: number | {span?: number, offset?: number, pull?: number, push?: number},
  pSm?: number | {span?: number, offset?: number, pull?: number, push?: number},
  pMd?: number | {span?: number, offset?: number, pull?: number, push?: number},
  pLg?: number | {span?: number, offset?: number, pull?: number, push?: number},
  pXl?: number | {span?: number, offset?: number, pull?: number, push?: number},
  pTag?: string
}
