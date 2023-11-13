import type { PButtonProps } from "@/atoms/PButton/PButtonTypes";

export interface PButtonActionBarProps {
  pButton: PButtonProps
  pButtonName: string,
  pButtonIcon: string,
  pButtonActionName: string
}

export interface PActionBarProps {
  pRightSideButtons: PButtonActionBarProps[],
  pLeftSideButtons: PButtonActionBarProps[]
}