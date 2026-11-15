/** Three's WebGLRenderer requires WebGL 2. Release the short-lived probe. */
let adapter = ''
export function isBandwidthLimitedAdapter() { return /Intel.*(?:UHD.*6[12]0|HD.*[56][123]0)/i.test(adapter) }
export function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl2')
    if (!context) return false
    const debug = context.getExtension('WEBGL_debug_renderer_info')
    adapter = debug ? String(context.getParameter(debug.UNMASKED_RENDERER_WEBGL)) : ''
    context.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch {
    return false
  }
}
