import React, { useRef, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";

// ----------------------------------------------

function CustomGeometry({ points, color }) {
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
        <meshPhongMaterial color={color} />
      </mesh>
    </>
  );
}

// ----------------------------------------------

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

// ----------------------------------------------

const Camera = () => {
  const cameraRef = useRef<THREE.OrthographicCamera>();
  const { size } = useThree();

  useEffect(() => {
    if (cameraRef.current) {
      const aspect = size.width / size.height;
      const frustumSize = 10; // Span from -5 to 5 on the horizontal axis
      cameraRef.current.left = -frustumSize / 2;
      cameraRef.current.right = frustumSize / 2;
      cameraRef.current.top = frustumSize / 2 / aspect;
      cameraRef.current.bottom = -(frustumSize / 2) / aspect;
      cameraRef.current.updateProjectionMatrix();
    }
  }, [size]);

  return (
    <OrthographicCamera ref={cameraRef} makeDefault position={[0, 0, 100]} />
  );
};

// ----------------------------------------------

interface Props {
  color: string;
  wireframe?: boolean;
}

const ToolRender: React.FC<Props> = ({ color, wireframe = true }) => {
  // generate shape
  const [points, setPoints] = useState([
    [0, 0],
    [1, 1],
    [0, 2],
  ]);

  const [shank, setShank] = useState([
    [0, 0],
    [1, 0],
    [1, 100],
  ]);

  const handleEvent = () => {
    setTimeout(() => {
      console.debug(
        'detected input field change via event "number_input_changed"',
      );

      // recalculate the points
      const r1 =
        parseFloat((document.getElementById("d1") as HTMLInputElement).value) /
        2;
      const r2 =
        parseFloat((document.getElementById("d2") as HTMLInputElement).value) /
        2;
      const r3 =
        parseFloat((document.getElementById("d3") as HTMLInputElement).value) /
        2;

      const l1 = parseFloat(
        (document.getElementById("l1") as HTMLInputElement).value,
      );
      const l2 = parseFloat(
        (document.getElementById("l2") as HTMLInputElement).value,
      );
      const l3 = parseFloat(
        (document.getElementById("l3") as HTMLInputElement).value,
      );

      const toolType = (
        document.getElementsByName("tool_type[name]")[0] as HTMLInputElement
      ).value; // just take the first element to stop error messages as getElementsByName can return a list, however we make sure to only use each name once"

      console.debug(toolType);
      if (toolType == "Fasenfräser") {
        console.debug("toolType Fasenfräser");

        let newPoints = [
          [0, 0],
          [r2, 0],
          [r1, l1],
        ];

        let newShank = [
          [0, l1 / 2],
          [r1, l1 / 2],
          [r1, 100],
        ];

        // we need to add the last point on the center axis if there is a sharp tip
        if (r2 == 0) {
          newPoints.push([0, l1]);
        }

        // transform points downwards to center the shape
        newPoints.map((value) => {
          value[1] -= l1 / 2;
        });

        // scale points to fit to radius 5
        let scale = 5 / (r1 * 2);
        newPoints.map((value) => {
          value[0] *= scale;
          value[1] *= scale;
        });

        newShank.map((value) => {
          value[0] *= scale;
          value[1] *= scale;
        });

        setShank(newShank);
        setPoints(newPoints);
      } else if (toolType == "Kombientgrater") {
        console.debug("toolType Kombientgrater");

        let newPoints = [
          [r2, 0],
          [r1, l2],
          [r3, l1],
        ];

        let newShank = [
          [0, l1 / 2],
          [r3, l1 / 2],
          [r3, 100],
        ]

        // transform points downwards to center the shape
        newPoints.map((value) => {
          value[1] -= l1 / 2;
        });
        
        // scale points to fit to radius 5
        let scale = 5 / (r1 * 2);
        newPoints.map((value) => {
          value[0] *= scale;
          value[1] *= scale;
        });

        newShank.map((value) => {
          value[0] *= scale;
          value[1] *= scale;
        });

        setShank(newShank);
        setPoints(newPoints);
      } else if (toolType == "Schwalbenschwanz") {
        console.debug("toolType Schwalbenschwanz");

        let newPoints = [
          [0, 0],
          [r1, 0],
          [r3, l1],
        ];

        let newShank = [
          [0, l1 / 2],
          [r3, l1 / 2],
          [r3, 100],
        ]

        // transform points downwards to center the shape
        newPoints.map((value) => {
          value[1] -= l1 / 2;
        });
        
        // scale points to fit to radius 5
        let scale = 5 / (r1 * 2);
        newPoints.map((value) => {
          value[0] *= scale;
          value[1] *= scale;
        });

        newShank.map((value) => {
          value[0] *= scale;
          value[1] *= scale;
        });

        setShank(newShank);
        setPoints(newPoints);
      } else {
        console.error("unknown toolType");
      }
    }, 0);
  };

  useEffect(() => {
    // Add event listener for number_input_changed
    window.addEventListener("number_input_changed", handleEvent);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("number_input_changed", handleEvent);
    };
  }, []);

  return (
    <div className="h-full">
      <Canvas>
        <Camera />
        <color attach="background" args={["#ffffff"]} />
        <ambientLight intensity={2} />
        <pointLight position={[0, 0, 0]} />
        <directionalLight position={[5, 0, 5]} color="white" intensity={3} />
        <CustomGeometry points={points} color="#33b1ff" />
        <CustomGeometry points={shank} color="#636363" />
      </Canvas>
    </div>
  );
};

export default ToolRender;
