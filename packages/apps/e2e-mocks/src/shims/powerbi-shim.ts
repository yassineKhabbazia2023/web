// Shim for powerbi-client
// Displays a placeholder instead of real PowerBI reports

const createPlaceholder = (container: HTMLElement) => {
  container.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-height: 400px;
      background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
      border: 2px dashed #ccc;
      border-radius: 8px;
      color: #666;
      font-family: system-ui, sans-serif;
    ">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" style="margin-bottom: 16px; opacity: 0.5;">
        <path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h4v10H7V7zm5 4h4v6h-4v-6z" fill="currentColor"/>
      </svg>
      <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">PowerBI Report</div>
      <div style="font-size: 14px; opacity: 0.7;">Preview Placeholder</div>
    </div>
  `
}

globalThis.powerbi = {
  embed: (container: HTMLElement) => {
    createPlaceholder(container)
    return {}
  },
  reset: () => {},
}

// Export models to satisfy imports like `import { models } from 'powerbi-client'`
export const models = {
  TokenType: {
    Embed: 1,
    Aad: 0,
  },
}

export default {}
