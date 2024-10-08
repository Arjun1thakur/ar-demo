import React, { useEffect, useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Mesh } from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { Html } from "@react-three/drei";


function Hotspot({ position, closeBtn, onClick, isActive }) {
  const hotspotRef = useRef();

  useFrame((state, delta) => {
    hotspotRef.current.rotation.copy(state.camera.rotation);
  });

  return (
    <>
      <group>
        <Html>
          {isActive && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "auto",
                height: "100px",
                borderRadius:"5px",
                display:"grid",
                placeItems:"center",
                backgroundColor: "ghostwhite",
                zIndex: 9999999999999
              }}
            >
              <button
                style={{
                  position: "absolute",
                  top: "0px",
                  right: "0px",
                  padding: "0px",
                  cursor: "pointer",
                  backgroundColor: "transparent",
                  border: "none",
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "black",
                  margin:0
                }}
                onClick={closeBtn}
              >close</button>
              
              <div style={{display:"grid",placeItems:"center"}}>{JSON.stringify(position)}</div>
            </div>
          )}
        </Html>
        <mesh
          ref={hotspotRef}
          position={position}
          onClick={onClick}
        >
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshBasicMaterial color={isActive ? "red" : "grey"} />
        </mesh>
      </group>
    </>
  );
}

export function Car({color,enterCar,hotspot}) {
  const [hotspotPositions, setHotspotPositions] = useState([]);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const gltf = useLoader(
    GLTFLoader,
    "models/car/toyota.glb"
  );
  useEffect(() => {
    {enterCar ? gltf.scene.scale.set(5, 5, 5) : null}
    {enterCar ? gltf.scene.rotation.set(0, 3.15, 0) : gltf.scene.rotation.set(0, -1, 0)}
    console.log(color)
    gltf.scene.traverse((object) => {
      if (object instanceof Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
        object.material.envMapIntensity = 20;
        object.frustumCulled = false;
      }
      
      const positions = [];
      gltf.scene.traverse((object) => {
        if (object instanceof Mesh && object.material && object.name === 'Object_92') {
          const localPosition = object.position.clone();
          object.localToWorld(localPosition); // Convert to world coordinates
          positions.push(localPosition);
          console.log(localPosition)
        }
        if (object instanceof Mesh && object.material && object.name === 'Object_182') {
          const localPosition = object.position.clone();
          object.localToWorld(localPosition); // Convert to world coordinates
          positions.push(localPosition);
          console.log(localPosition)

        }
      });

      setHotspotPositions(positions);
    });
   
  }, [gltf,color]);

  useEffect(()=>{
    const scaleTween = new TWEEN.Tween(gltf.scene.scale)
    .to({ x: 1.2, y: 1.2, z: 1.2 }, 5000)
    .onComplete(() => {
      // Reset scale after the first animation
      new TWEEN.Tween(gltf.scene.scale)
        .to({ x: 1, y: 1, z: 1 }, 3000)
        .start();
    })
    .start();

  // Start the animation loop
  const animate = () => {
    requestAnimationFrame(animate);
    TWEEN.update();
  };

  animate();
  },[enterCar])


  useFrame((state, delta) => {
    let t = state.clock.getElapsedTime();

    gltf.scene.traverse((object) => {
      if (object instanceof Mesh && object.material && object.material.name === 'Paint') {
        object.material.color.set(color);
      }
    });
  },[color,enterCar]);

  const handleHotspotClick = (index) => {
    setActiveHotspot(index);
  };

  const closeHotspotClick = () => {
    setActiveHotspot(null);
  };

  return (
    <>
      { (hotspot && hotspotPositions) &&
        hotspotPositions.map((position, index) => {
          return (
            <Hotspot
              key={index}
              position={position}
              closeBtn={closeHotspotClick}
              onClick={() => handleHotspotClick(index)}
              isActive={activeHotspot === index}
            />
          );
        })}
      <primitive object={gltf.scene} />
      <pointLight position={[0, 1, 0]} intensity={1} color="white" distance={5} />
      <ambientLight intensity={0.3} />
    </>
  )
;
}

