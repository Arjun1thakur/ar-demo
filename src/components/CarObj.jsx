import React, { useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Mesh } from "three";

export function CarObj() {
  const gltf = useLoader(
    GLTFLoader,
    "models/car/toyota.glb"
  );
  useEffect(() => {
    
    gltf.scene.traverse((object) => {
      if (object instanceof Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
        object.material.envMapIntensity = 20;
      }
    });
  }, [gltf]);

  useFrame((state, delta) => {
    let t = state.clock.getElapsedTime();

    let group = gltf.scene.children[0].children[0].children[0];
    // group.children[0].rotation.x = t * 2;
    // group.children[2].rotation.x = t * 2;
    // group.children[4].rotation.x = t * 2;
    // group.children[6].rotation.x = t * 2;
  });

  return <primitive object={gltf.scene} />;
}
