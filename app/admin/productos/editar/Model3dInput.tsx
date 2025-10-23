'use client';

import React from 'react';

export default function Model3DInput({
  currentModelName,
  model3dFile,
  onModelChange
}: {
  currentModelName: string;
  model3dFile: File | null;
  onModelChange: (file: File) => void;
}) {
  return (
    <div>
      <p className="text-gray-400 text-sm mb-1">
        Actual: {currentModelName || 'Sin modelo'}
      </p>
      <label className="block mb-1 font-semibold">Modelo 3D</label>
      <input
        name="model3d"
        type="file"
        accept=".glb,.obj,.fbx,.stl"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            onModelChange(e.target.files[0]);
          }
        }}
        className="w-full p-2 border rounded text-gray-900 bg-white"
      />
      {model3dFile && (
        <p className="text-sm text-green-400 mt-2">
          ✅ Modelo seleccionado: {model3dFile.name}
        </p>
      )}
    </div>
  );
}
