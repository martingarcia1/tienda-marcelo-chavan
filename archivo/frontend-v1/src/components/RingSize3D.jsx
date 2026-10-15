import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Billboard, Text } from '@react-three/drei'

const ROD_HEIGHT = 6
const ROD_MARGIN = 0.5
const RADIUS_TOP = 0.14
const RADIUS_BOTTOM = 0.55
const Y_TOP = ROD_HEIGHT / 2 - ROD_MARGIN
const Y_BOTTOM = -ROD_HEIGHT / 2 + ROD_MARGIN
const MIN_TALLE = 1
const MAX_TALLE = 36

function radiusAtY(y) {
  // y va de +ROD_HEIGHT/2 (punta fina) a -ROD_HEIGHT/2 (base gruesa)
  const t = (ROD_HEIGHT / 2 - y) / ROD_HEIGHT
  return RADIUS_TOP + (RADIUS_BOTTOM - RADIUS_TOP) * t
}

function yParaTalle(talleNum) {
  const progreso = (talleNum - MIN_TALLE) / (MAX_TALLE - MIN_TALLE)
  return Y_TOP - progreso * (Y_TOP - Y_BOTTOM)
}

// Marcas "No." (talle) y "C U" (circunferencia en mm) — igual que la varilla física.
function Varilla() {
  const marcas = useMemo(() => {
    return Array.from({ length: MAX_TALLE - MIN_TALLE + 1 }).map((_, i) => {
      const talleNum = MIN_TALLE + i
      const y = yParaTalle(talleNum)
      return { talleNum, y, r: radiusAtY(y) }
    })
  }, [])

  return (
    <group>
      <mesh>
        <cylinderGeometry args={[RADIUS_TOP, RADIUS_BOTTOM, ROD_HEIGHT, 48]} />
        <meshStandardMaterial color="#c9ccd1" metalness={0.8} roughness={0.28} />
      </mesh>

      {marcas.map(({ talleNum, y, r }) => (
        <group key={talleNum}>
          {/* Línea grabada */}
          <mesh position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[r + 0.002, 0.005, 6, 32]} />
            <meshStandardMaterial color="#083A4F" metalness={0.2} roughness={0.6} />
          </mesh>

          {/* "No." — talle, a la izquierda */}
          <Billboard position={[-(r + 0.22), y, 0]}>
            <Text fontSize={0.1} color="#083A4F" anchorX="right" anchorY="middle">
              {talleNum}
            </Text>
          </Billboard>

          {/* "C U" — circunferencia en mm, a la derecha */}
          <Billboard position={[r + 0.22, y, 0]}>
            <Text fontSize={0.1} color="#A5443A" anchorX="left" anchorY="middle">
              {talleNum + 40}
            </Text>
          </Billboard>
        </group>
      ))}
    </group>
  )
}

function Anillo({ progreso }) {
  const ref = useRef()
  const targetY = useRef(Y_TOP)
  const targetScale = useRef(0.55)

  targetY.current = Y_TOP - progreso * (Y_TOP - Y_BOTTOM)
  targetScale.current = 0.55 + progreso * 0.55

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.position.y += (targetY.current - ref.current.position.y) * Math.min(1, delta * 4)
    const s = ref.current.scale.x + (targetScale.current - ref.current.scale.x) * Math.min(1, delta * 4)
    ref.current.scale.set(s, s, s)
  })

  return (
    <mesh ref={ref} position={[0, Y_TOP, 0]} rotation={[Math.PI / 2, 0.1, 0]} scale={0.55}>
      <torusGeometry args={[0.62, 0.1, 24, 64]} />
      <meshStandardMaterial color="#C9A84C" metalness={0.95} roughness={0.18} />
    </mesh>
  )
}

export default function RingSize3D({ talle, minTalle, maxTalle }) {
  const progreso = talle ? (talle - minTalle) / (maxTalle - minTalle) : 0

  return (
    <div style={{ width: '100%', height: '340px' }}>
      <Canvas camera={{ position: [4.2, 0.6, 4.2], fov: 38 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 5, 4]} intensity={1.2} />
        <directionalLight position={[-4, -2, -3]} intensity={0.3} />
        <Varilla />
        <Anillo progreso={progreso} />
        <Environment preset="city" />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2.5}
          maxDistance={7}
          autoRotate
          autoRotateSpeed={1.6}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>
    </div>
  )
}
