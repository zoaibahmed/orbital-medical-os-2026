import { useEffect, useMemo } from 'react'
import { DataTexture, LinearFilter, PlaneGeometry, RGBAFormat, UnsignedByteType } from 'three'

/** Art-directed static contact patches, not a claim of ray-traced/baked AO.
 * Authored equipment positions are fixed in this slice; update these if equipment moves.
 */
export function ContactGrounding() {
  const resources = useMemo(() => {
    const size = 128
    const pixels = new Uint8Array(size * size * 4)
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      const dx = Math.max(Math.abs((x / (size - 1)) * 2 - 1) - .58, 0)
      const dy = Math.max(Math.abs((y / (size - 1)) * 2 - 1) - .63, 0)
      const alpha = Math.exp(-(dx * dx + dy * dy) * 45) * .58
      const offset = (y * size + x) * 4
      pixels[offset] = pixels[offset + 1] = pixels[offset + 2] = 255
      pixels[offset + 3] = Math.round(alpha * 255)
    }
    const map = new DataTexture(pixels, size, size, RGBAFormat, UnsignedByteType)
    map.magFilter = map.minFilter = LinearFilter
    map.needsUpdate = true
    return { map, geometry: new PlaneGeometry(1, 1) }
  }, [])
  useEffect(() => () => { resources.map.dispose(); resources.geometry.dispose() }, [resources])
  return <group name="static-contact-grounding">
    <mesh layers-mask={2} geometry={resources.geometry} rotation={[-Math.PI / 2, 0, 0]} position={[-.4, .072, -.18]} scale={[1.9, 3.4, 1]} renderOrder={1} raycast={() => {}}>
      <meshBasicMaterial map={resources.map} color="#07111a" transparent opacity={.78} depthWrite={false} toneMapped={false} />
    </mesh>
    <mesh layers-mask={2} geometry={resources.geometry} rotation={[-Math.PI / 2, 0, 0]} position={[2.2, .074, -2.25]} scale={[1.35, 1.25, 1]} renderOrder={1} raycast={() => {}}>
      <meshBasicMaterial map={resources.map} color="#07111a" transparent opacity={.70} depthWrite={false} toneMapped={false} />
    </mesh>
  </group>
}
