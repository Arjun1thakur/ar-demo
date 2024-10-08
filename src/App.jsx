
import './App.css'

import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import stabilization from './assets/stabilization.gif'
import { useFrame } from "@react-three/fiber";
import { OrbitControls as OrbitDrai} from 'three/examples/jsm/controls/OrbitControls';
import {
  CubeCamera,
  Environment,
  useHelper,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import "./style.css";
import { Car } from "./Car";
import {FloatingGrid} from './FloatingGrid'
import CameraComponent from './components/camera';
import { useLoader, useThree } from '@react-three/fiber';
// import { Rings } from "./Rings";
import { CameraHelper } from 'three';
import BottomPannel from './components/bottomPannel';
import Header from './components/header';
import exitCar from "./assets/exitCar.png";
import * as TWEEN from "@tweenjs/tween.js";

function CarShow({entry,colorData,enterCar,feature}) {
  const camera = useRef()
  useHelper(camera, CameraHelper)
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    const fetchData = async () => {
      await delay(3000);
      setLoading(false);
    };

    fetchData();
  }, []);
  return (
    <>
      {/* <OrbitControls target={[0, 0.35, 0]} maxPolarAngle={1.45} /> */}
      {enterCar ? <CameraControls/> :
      <OrbitControls
        target={[0, .7, 0]}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
       
        enableRotate={true}
        // enableDamping={false}
        enableRotateUp={false}
        enableRotateDown={false}
        enableRotateRight={false}
        minDistance={5}
        maxDistance={10}
      />}
      
      {enterCar ? null : <PerspectiveCamera ref={camera} makeDefault fov={50} position={[0, 0, 5]} />}

      <CubeCamera resolution={256} frames={Infinity}>
        {(texture) => (
          <>
            <Environment map={texture} />
            <ambientLight args={['#ffffff',1]}/>
            {!loading && <Car ar={entry} hotspot={feature} color={colorData} enterCar={enterCar} />}
          </>
        )}
      </CubeCamera>
      
      <ambientLight args={['#000000',1]}/>
      
      <spotLight
        color={[0.14, 0.5, 1]}
        intensity={20}
        angle={0.6}
        penumbra={0.5}
        position={[-5, 5, 0]}
        castShadow
        shadow-bias={-0.0001}
      />
      {/* <Ground /> */}
      {enterCar ? null : <FloatingGrid />}
      
    </>
  );
}

const CameraControls = () => {
  const { camera, gl } = useThree();
  const controls = useRef();
  const [deviceOrientation, setDeviceOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [prevAlpha, setPrevAlpha] = useState(0);
  const [prevBeta, setPrevBeta] = useState(0);

  useEffect(() => {
    camera.position.set(0, 1, 0);
    controls.current = new OrbitDrai(camera, gl.domElement);
    controls.current.target.set(0, 1, 0);
    controls.current.enableZoom = false;

    return () => {
      controls.current.dispose();
    };
  }, [camera, gl]);

  useEffect(() => {
    const handleOrientationChange = (event) => {
      setDeviceOrientation({
        alpha: event.alpha * 0.2,
        beta: event.beta * 0.2,
        gamma: event.gamma * 0.2,
      });
    };

    window.addEventListener('deviceorientation', handleOrientationChange, true);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientationChange, true);
    };
  }, []);

  useFrame(() => {
    const { alpha, beta, gamma } = deviceOrientation;


    const deltaAlpha = alpha - prevAlpha;
    const deltaBeta = beta - prevBeta;

    const alphaThreshold = 2;

    if (Math.abs(deltaAlpha) > alphaThreshold || Math.abs(deltaBeta) > alphaThreshold ) {
     
      new TWEEN.Tween(camera.rotation)
        .to(
          {
            x: (beta + 45) * 0.1,
            y: (alpha + 40) * 0.1,
            z: 0,
          },
          500 
        )
        .start();


      setPrevBeta(beta)
      setPrevAlpha(alpha);
    }

    TWEEN.update();
  });

  return null;
};



function App() {
  let [EnterAR,setEnterAR]=useState(false)
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [color, setColor] = useState("white");
  const [layer, setLayer] = useState(false);
  const [feature, setfeature] = useState(false);

  let updateLayer=(e)=>{
    setLayer(!layer)
  }
  useEffect(() => {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    // const fetchData = async () => {
    //   await delay(6000);
    //   setLoading(false);

    //   setShowPopup(true);
    //   await delay(6000);
    //   setShowPopup(false);

    //   setShowMessage(true);
    //   await delay(6000);
    //   setShowMessage(false);
    // };

    // fetchData();
  }, []);
  let sendData=()=>{
    setEnterAR(!EnterAR)
  }
  // useEffect(()=>{

  // },[EnterAR])
  let updateColor=(value)=>{
    setColor(value)
  }
  let showFeature=()=>{
    setfeature(!feature)
  }
  return (
   
    <>
   {EnterAR ? <button className='exitCar' onClick={()=>setEnterAR(!EnterAR)}><img src={exitCar} alt="" /></button>  : <Header/>}
      <CameraComponent/>
      <div className='model'>
        {layer && <div className="layer"></div> }
        
        <Suspense fallback={null}>
          {/* {loading && <div style={{width:"100vw",height:"100vh",display:"grid",placeItems:"center"}}><div c="custom-loader">Alpha</div></div>}
          {showPopup && <div><img src={stabilization} alt="svg" /></div>} */}
          <Canvas>
            {/* {!loading && !showPopup && <CarShow entry={EnterAR}/> } */}
            <CarShow entry={EnterAR} feature={feature} colorData={color} enterCar={EnterAR}/>

          </Canvas>
        </Suspense>
      </div>
      {EnterAR ? null : <BottomPannel feature={showFeature} colorData={updateColor} updateLayer={updateLayer} enterCar={sendData} />}
    </>
  );
}

export default App;
