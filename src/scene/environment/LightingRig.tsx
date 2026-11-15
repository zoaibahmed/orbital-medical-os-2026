import { useEffect, useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import { Light, Object3D, PMREMGenerator, SpotLight } from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { qualitySettings, type QualityTier } from '../quality/config'

export function LightingRig({ quality, study = false }: { quality: QualityTier; study?: boolean }) {
  const { gl, scene, invalidate } = useThree()
  const targets = useMemo(() => {
    const key = new Object3D()
    key.position.set(-.4, .95, -.25)
    const fill = new Object3D()
    fill.position.set(1, 1, -2)
    return { key, fill }
  }, [])
  useEffect(() => {
    scene.traverse(o=>{if(o instanceof Light)o.layers.enable(1);if(o instanceof SpotLight)o.shadow.camera.layers.enable(1)})
    const generator = new PMREMGenerator(gl)
    const room = new RoomEnvironment()
    const environment = generator.fromScene(room, .04, .1, 100, { size: qualitySettings[quality].environmentResolution })
    const previous = scene.environment
    scene.environment = environment.texture
    scene.environmentIntensity = study ? .40 : .28
    invalidate()
    return () => { scene.environment = previous; environment.dispose(); generator.dispose(); room.dispose() }
  }, [gl, scene, quality, invalidate, study])
  const settings = qualitySettings[quality]
  return <>
    <primitive object={targets.key} />
    <primitive object={targets.fill} />
    <hemisphereLight args={['#d5e7ee', '#4e3622', study ? .10 : .25]} />
    <spotLight position={[-2.25, 3.42, -.8]} target={targets.key} color="#fff0d6" intensity={study ? 105 : 140} angle={1.05} penumbra={.85} distance={12} decay={2} castShadow={settings.shadows} shadow-mapSize={[settings.shadowMap, settings.shadowMap]} shadow-bias={-.00008} shadow-normalBias={.0035} shadow-camera-near={.2} shadow-camera-far={12} />
    <spotLight position={[2.25, 3.42, -1.1]} target={targets.fill} color="#d9efff" intensity={study ? 40 : 50} angle={1.15} penumbra={1} distance={12} decay={2} />
    {study && quality === 'standard' && <><pointLight position={[-2.6,.30,-2]} color="#ffba65" intensity={4} distance={3} decay={2}/><pointLight position={[2.4,2.85,-3.15]} color="#ffc77f" intensity={7} distance={4} decay={2}/></>}
    <directionalLight position={[0, 2.8, 4]} color="#d4e1e8" intensity={study ? .12 : .28} />
  </>
}
