"use client";

import { useTheme } from "fumadocs-ui/provider/base";
import { useEffect, useState } from "react";
import {
  Dither,
  FlowingGradient,
  Shader,
  SolidColor,
  Tritone,
} from "shaders/react";

export function ShaderBackground({ opacity = 1 }: { opacity?: number }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [gpuAvailable, setGpuAvailable] = useState(true);

  useEffect(() => {
    setMounted(true);
    setGpuAvailable(!!navigator.gpu);
  }, []);

  if (!mounted) return null;

  const dark = resolvedTheme !== "light";

  if (!gpuAvailable) {
    return (
      <div
        className="absolute inset-0 w-full h-full -z-10"
        style={{
          opacity,
          pointerEvents: "none",
          background: dark
            ? "linear-gradient(145deg, #1a1a1a 0%, #303030 100%)"
            : "linear-gradient(145deg, #e8e8e8 0%, #c4c4c4 100%)",
        }}
      />
    );
  }

  return (
    <Shader
      className="absolute inset-0 w-full h-full -z-10"
      style={{ opacity, pointerEvents: "none" }}
    >
      <SolidColor
        color={dark ? "#000000" : "#ffffff"}
        opacity={dark ? 0.61 : 0.45}
        transform={{ edges: "wrap" }}
        visible={true}
      />
      <FlowingGradient
        colorB="#9c9c9c"
        colorC="#a1a1a1"
        colorD="#d4d4d4"
        colorSpace="linear"
        distortion={0.3}
        maskSource="idmnayde0qhf56tj00g"
        seed={22}
        visible={true}
      />
      <Tritone
        colorA={dark ? "#1a1c38" : "#f4faf4"}
        colorB={dark ? "#156e1d" : "#9ad4a0"}
        colorC={dark ? "#6a9191" : "#d8efd4"}
        visible={true}
      />
      <Dither
        colorMode="source"
        pattern="blueNoise"
        pixelSize={2}
        threshold={0.62}
        visible={true}
      />
    </Shader>
  );
}
