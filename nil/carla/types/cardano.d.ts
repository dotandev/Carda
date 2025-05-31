declare global {
  interface Window {
    cardano: {
      nami?: {
        enable(): Promise<any>
        isEnabled(): Promise<boolean>
      }
      eternl?: {
        enable(): Promise<any>
        isEnabled(): Promise<boolean>
      }
      flint?: {
        enable(): Promise<any>
        isEnabled(): Promise<boolean>
      }
    }
  }
}

export {}
