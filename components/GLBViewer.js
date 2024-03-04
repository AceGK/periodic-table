import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';

const Model = ({ path }) => {
  const group = useRef();
  const { scene, animations } = useGLTF(path);
  const { actions } = useAnimations(animations, group);
  
  useEffect(() => {
    // Automatically play all animations
    for (const action of Object.values(actions)) {
      action.play();
    }
    // Optional: specify cleanup function to stop animations when component unmounts
    return () => {
      for (const action of Object.values(actions)) {
        action.stop();
      }
    };
  }, [actions]);

  return <primitive ref={group} object={scene} dispose={null} />;
};

const GLBViewer = ({ path }) => {
  return (
    <div style={{ height: 250, width: 350 }}>
      <Canvas camera={{ position: [0.2, 0.3, 0.4], fov: 60 }}>
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