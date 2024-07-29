import React, { useRef, useEffect, useMemo, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";

// ----------------------------------------------
interface GeometryProps {
  points: Array<any>;
  color: string;
  offset: [number, number];
}

const CustomGeometry: React.FC<GeometryProps> = ({ points, color, offset }) => {
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
      <mesh position={[...offset, 0]}>
        <bufferGeometry attach="geometry" {...geometry} />
        <meshPhongMaterial color={color} />
      </mesh>
    </>
  );
}

// ----------------------------------------------

const Camera = () => {
  const cameraRef = useRef<THREE.OrthographicCamera>();
  const { size } = useThree();

  useEffect(() => {
    if (cameraRef.current) {
      const aspect = size.width / size.height;
      const frustumSize = 5;
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

interface MaterialProps {
  direction: number
}

const MaterialGeometry: React.FC<MaterialProps> = ({direction}) => {
  return (
    <mesh position={[2.5, direction*(-2.5), 0]}>
      <boxGeometry args={[5,5,0]}/>
      <meshPhongMaterial color={"#666"} />
    </mesh>
  )
}

// ----------------------------------------------

interface Props {
  color: string;
  wireframe?: boolean;
}

const ChamferRender: React.FC<Props> = ({  }) => {
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

  // states for the chamfer block definiton
  // index 0: [wall offset, floor offset], index 1: direction (1: Forward, -1: Backward)
  const [material, setMaterial] = useState<[[number, number], number]>([[0, 0], 1]);

  const globalScale = 2

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

      const toolType = (
        document.getElementsByName("tool_type[name]")[0] as HTMLInputElement
      ).value; // just take the first element to stop error messages as getElementsByName can return a list, however we make sure to only use each name once"

      // Regulär | Rückwärts
      const dir = (
        document.getElementsByName("chamfer_type[name]")[0] as HTMLInputElement
      ).value;

      const wallOffset = parseFloat(
        (document.getElementById("offset-wall") as HTMLElement).innerHTML,
      );
      const floorOffset = parseFloat(
        (document.getElementById("offset-floor") as HTMLElement).innerHTML,
      );

      console.debug(toolType);
      if (toolType == "Fasenfräser") {
        console.debug("toolType Fasenfräser");

        let newPoints = [
          [0, 0],
          [r2, 0],
          [r1, l1],
        ];

        let newShank = [
          [0, l1],
          [r1, l1],
          [r1, 100],
        ];

        // we need to add the last point on the center axis if there is a sharp tip
        if (r2 == 0) {
          newPoints.push([0, l1]);
        }

        // scale points to fit to radius 5
        let scale = globalScale / (r1 * 2);
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
          [0, l1],
          [r3, l1],
          [r3, 100],
        ];

        // scale points to fit to radius 5
        let scale = globalScale / (r1 * 2);
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
          [0, l1],
          [r3, l1],
          [r3, 100],
        ];

        // scale points to fit to radius 5
        let scale = globalScale / (r1 * 2);
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

      // material visualization
      const scale = globalScale / (r1 * 2);
      if (dir == "Regulär") {
        setMaterial([[(-wallOffset-r1)*scale, floorOffset*scale], 1])
      } else if (dir == "Rückwärts") {
        setMaterial([[(-wallOffset-r1)*scale, floorOffset*scale], -1])
      } else {
        console.warn("Chamfer Direction (dir) undefined");
      }
    }, 0);
  };

  useEffect(() => {
    // Add event listener for number_input_changed
    window.addEventListener("number_input_changed", handleEvent);
    window.addEventListener("offset_output_changed", handleEvent);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("number_input_changed", handleEvent);
      window.removeEventListener("offset_output_changed", handleEvent);
    };
  }, []);

  return (
    <div className="h-full">
      <Canvas>
        <Camera />
        <ambientLight intensity={2} />
        <pointLight position={[0, 0, 0]} />
        <directionalLight position={[5, 0, 5]} color="white" intensity={3} />
        <MaterialGeometry direction={material[1]}/> 
        <CustomGeometry points={points} color="#33b1ff" offset={material[0]}/>
        <CustomGeometry points={shank} color="#636363" offset={material[0]}/>
      </Canvas>
    </div>
  );
};

export default ChamferRender;
