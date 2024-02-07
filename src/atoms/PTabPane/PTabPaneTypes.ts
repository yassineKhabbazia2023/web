import type { Component } from 'vue'
export interface PTabPaneProps {
  pLabel?: string,
  pDisabled?: boolean,
  pName?: string | number,
  pClosable?: boolean,
  pLazy?: boolean,
  pTabIcon?: Component | string
}
