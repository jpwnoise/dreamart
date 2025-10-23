"use client";

import { div } from "framer-motion/client";
import { useEffect, useState } from "react";

export default function Model3DViewer() {
  useEffect(() => {
    import("@google/model-viewer");
  }, []);

  const [exposure, setExposure] = useState(.3)
  const [shadowIntensity, setShadowIntensity] = useState(.3)

  return (

    <div className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 ">
      <div className="grid grid-cols-2 gap-4 p-4">
        <div>

          <label htmlFor="shadow" className="text-gray-300 text-sm">Shadow:</label>
          <input
            type="number"
            step={0.1}
            min={0}
            max={1}
            name="shadow"
            id="shadow"
            value={shadowIntensity}
            onChange={(e) => setShadowIntensity(Number(e.target.value))}
            className="bg-gray-800 text-gray-200 border border-gray-600 rounded-lg px-3 py-2
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400
          placeholder-gray-500 shadow-inner w-24"
          />
        </div>
        <div>

          <label htmlFor="light" className="text-gray-300 text-sm">Light:</label>
          <input
            type="number"
            step={0.1}
            min={0}
            max={1}
            name="light"
            id="light"
            value={exposure}
            onChange={(e) => setExposure(Number(e.target.value))}
            className="bg-gray-800 text-gray-200 border border-gray-600 rounded-lg px-3 py-2
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400
          placeholder-gray-500 shadow-inner w-24"
          />
        </div>

      </div>
      <model-viewer
        src="/models/4 Hongos.glb"
        alt="Modelo 3D"
        auto-rotate
        shadow-intensity={shadowIntensity}
        exposure={exposure}
        camera-controls
        style={{ width: "100%", height: "500px" }}
      >
        <hemisphere-light intensity="0.8" color="#ffe6cc" ground-color="#222222"></hemisphere-light>
        <directional-light intensity="1.5" color="#ffdd99" position="2 3 1"></directional-light>
      </model-viewer>
    </div>
  );
}
