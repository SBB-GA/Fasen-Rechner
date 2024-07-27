import React, { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";

interface Props {
  points: Array<Array<number>>;
  color: string;
  wireframe?: boolean;
}

function CustomGeometry({ points }) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();

    // Create the shape from points
    points.forEach((point: Array<number>, index: number) => {
      if (index === 0) {
        shape.moveTo(point[0], point[1]);
      } else {
        shape.lineTo(point[0], point[1]);
      }
    });

    // Create the geometry by rotating the shape
    const geometry = new THREE.LatheGeometry(shape.getPoints(), 50);
    return geometry;
  }, [points]);

  return (
    <>
      <mesh>
        <bufferGeometry attach="geometry" {...geometry} />
        <meshPhongMaterial color="#6877b0" />
      </mesh>
    </>
  );
}

interface CircleProps {
  radius?: number;
  segments?: number;
  rotation?: [number, number, number];
  position?: [number, number, number];
}

const CircleLine: React.FC<CircleProps> = ({
  radius = 5,
  segments = 64,
  rotation = [0, 0, 0],
  position = [0, 0, 0],
}) => {
  // Generate circle points
  const points = useMemo(() => {
    const circle = new THREE.Shape();
    circle.absarc(0, 0, radius, 0, Math.PI * 2, false);

    const points = circle.getPoints(segments);
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [radius, segments]);

  return (
    <group position={position} rotation={rotation}>
      <line>
        <bufferGeometry attach="geometry" {...points} />
        <lineBasicMaterial attach="material" color="black" />
      </line>
    </group>
  );
};

const Camera = () => {
  const cameraRef = useRef<THREE.OrthographicCamera>();
  const { size } = useThree();

  useEffect(() => {
    if (cameraRef.current) {
      const aspect = size.width / size.height;
      const frustumSize = 10; // Span from -5 to 5 on the horizontal axis
      cameraRef.current.left = -frustumSize / 2;
      cameraRef.current.right = frustumSize / 2;
      cameraRef.current.top = (frustumSize / 2) / aspect;
      cameraRef.current.bottom = -(frustumSize / 2) / aspect;
      cameraRef.current.updateProjectionMatrix();
    }
  }, [size]);

  return (
    <OrthographicCamera ref={cameraRef} makeDefault position={[0, 0, 100]} />
  );
};

const ToolRender: React.FC<Props> = ({ points, color, wireframe = true }) => {
  // generate shape
  points = [
    [0, -1.5],
    [1, -0.5],
    [1, 0.5],
    [0, 1.5],
  ];

  return (
    <div className="h-full">
      <Canvas>
        <Camera />
        <color attach="background" args={["#ffffff"]} />
        <ambientLight intensity={2} />
        <pointLight position={[0, 0, 0]} />
        <directionalLight position={[5, 0, 5]} color="white" intensity={3} />
        <CustomGeometry points={points} />
        <CircleLine
          radius={1}
          segments={64}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 0.5, 0]}
        />
        <CircleLine
          radius={1}
          segments={64}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, -0.5, 0]}
        />
      </Canvas>
    </div>
  );
};

export default ToolRender;
