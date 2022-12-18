/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference types="react-scripts" />

declare module '*.svg' {
  import React = require('react')
  export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}

declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.json' {
  const content: string
  export default content
}

declare module '*.ogg' {
  const content: string
  export default content
}
