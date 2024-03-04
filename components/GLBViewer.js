import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

const Model = ({ path }) => {
  const { scene } = useGLTF(path);
  return <primitive object={scene} dispose={null} />;
};

const GLBViewer = ({ path }) => {
  return (
    <div style={{ height: 300, width: 200 }}>
      <Canvas camera={{ position: [0.3, 0.2, 0.4], fov: 60 }}>
        <ambientLight intensity={1} />
        <spotLight position={[10, 10, 10]} angle={0.10} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Suspense fallback={null}>
          <Model path={path} />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default GLBViewer;