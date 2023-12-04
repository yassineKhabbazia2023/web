import type { CSSProperties } from "vue";

export interface PScrollbarProps {
  pHeight: number | string,
  pMaxHeight: number | string,
  pNative: boolean,
  pWrapStyle: string | CSSProperties | CSSProperties[] | string[],
  pViewStyle: string | CSSProperties | CSSProperties[] | string[],
  pWrapClass: string,
  pViewClass: string,
  pNoresize: boolean,
  pTag: string,
  pAlways: boolean,
  pMinSize: number,
  pId: string,
  pRole: string,
  pAriaLabel: string,
  pAriaOrientation: string
}
