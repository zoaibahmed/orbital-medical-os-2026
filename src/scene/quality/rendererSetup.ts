import type { WebGLRenderer } from 'three'
/** Three recommends avoiding synchronous program/log diagnostics in production.
 * Development keeps full shader diagnostics. Asset/context/error boundaries remain active.
 */
export function configureProductionRenderer(renderer: WebGLRenderer) {
 renderer.debug.checkShaderErrors=import.meta.env.DEV
 renderer.domElement.dataset.shaderDiagnostics=import.meta.env.DEV?'enabled':'production-off'
}
