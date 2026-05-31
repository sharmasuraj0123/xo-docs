'use client'

import { useTheme } from 'fumadocs-ui/provider/base'
import { useEffect, useState } from 'react'
import { Dither, Shader, SineWave } from 'shaders/react'

export function ShaderBackground({ opacity = 1 }: { opacity?: number }) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [gpuAvailable, setGpuAvailable] = useState(true)

  useEffect(() => {
    setMounted(true)
    setGpuAvailable(!!navigator.gpu)
  }, [])

  if (!mounted) return null

  const dark = resolvedTheme !== 'light'

  if (!gpuAvailable) {
    return (
      <div
        className="absolute inset-0 w-full h-full -z-10"
        style={{
          opacity,
          pointerEvents: 'none',
          background: dark
            ? 'linear-gradient(145deg, #1a1a1a 0%, #303030 100%)'
            : 'linear-gradient(145deg, #e8e8e8 0%, #c4c4c4 100%)',
        }}
      />
    )
  }

  return (
    <Shader
      className="absolute inset-0 w-full h-full -z-10"
      style={{ opacity, pointerEvents: 'none' }}
    >
      <Dither
        colorMode="custom"
        colorA={dark ? '#1a1a1a' : '#e8e8e8'}
        colorB={dark ? '#303030' : '#c4c4c4'}
        pattern="bayer8"
        pixelSize={5}
        threshold={0.28}
      >
        <SineWave
          amplitude={0.5}
          angle={145}
          frequency={0.5}
          speed={-0.4}
          softness={0.8}
          thickness={1.1}
        />
      </Dither>
    </Shader>
  )
}
