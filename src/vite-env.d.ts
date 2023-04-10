/// <reference types="vite/client" />

declare module 'uTools' {
  import Utools from 'utools-api-types'
  export = Utools
}

declare const __INTRODUCTION__: string

declare interface Window {
  preload: {}
}

