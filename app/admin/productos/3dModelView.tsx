"use client";

import { useEffect } from "react";

export default function Model3DViewer() {
  useEffect(() => {
    import("@google/model-viewer");
  }, []);

  return (
    <model-viewer
      src="/models/casa_hongo.glb"
      alt="Modelo 3D"
      auto-rotate
      camera-controls
      style={{ width: "100%", height: "500px" }}
    />
  );
}
