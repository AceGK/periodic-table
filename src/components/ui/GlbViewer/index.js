import { Suspense, useEffect, useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import { clone as skeletonClone } from 'three/examples/jsm/utils/SkeletonUtils.js';

const Model = ({ path }) => {
  const group = useRef();
  const { scene, animations } = useGLTF(path);
  const clonedScene = useMemo(() => skeletonClone(scene), [scene]);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    for (const action of Object.values(actions)) {
      action?.play();
    }
    return () => {
      for (const action of Object.values(actions)) {
        action?.stop();
      }
    };
  }, [actions]);

  return <primitive ref={group} object={clonedScene} dispose={null} />;
};

const GLBViewer = ({ path }) => {
  return (
    <div style={{ height:"100%", width: "100%" }}>
      <Canvas camera={{ position: [0.2, 0.3, 0.6], fov: 50 }}>
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
