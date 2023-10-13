import type { AvatarProps } from 'element-plus'

export interface PAvatarProps extends AvatarProps {
  type?: '' | 'default' | 'small' | 'large' | 'xsmall' | 'xlarge',
  color: ''
    |'persian-gradient'
    | 'orange'
    | 'persian'
    | 'teal'
    | 'green'
    | 'fuschia'
    | 'gray'
    | 'white'
}
