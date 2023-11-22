export interface ITag {
  number: number
  content: string
  icon: any
  color: string
  apiKey: string
}

export interface IState {
  userTags: ITag[]
  entityTags: ITag[]
  isLoading: boolean | undefined
}
