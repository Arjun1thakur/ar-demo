import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let poses = [];
let modelReadyBool = false;

const video = document.createElement('video');
video.setAttribute('width', 255);
video.setAttribute('height', 255);

navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  .then(function (stream) {
    video.srcObject = stream;
    video.play();
  })
  .catch(function (err) {
    console.log("An error occurred! " + err);
  });

const poseNet = ml5.poseNet(video, modelReady);
poseNet.on('pose', gotPoses);

function gotPoses(results) {
  poses = results;

  if (modelReadyBool == true) {
    render();
    console.log("is rendering");
    modelReadyBool = false;
  }
}

function modelReady() {
  console.log("model ready")
  modelReadyBool = true;
  poseNet.multiPose(video);
}

var placeHolder = new THREE.Vector3();

function drawKeypoints() {
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[0];
      placeHolder.position = new THREE.Vector3(pose.keypoints[0].position.x, pose.keypoints[0].position.y, 0);
    }
  }
}

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 1;
camera.position.y = 1;
camera.rotation.x = 0;

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor("#A2A2A2");
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var light = new THREE.DirectionalLight(0x404040);
light.castShadow = false;
scene.add(light);

var amlight = new THREE.AmbientLight(0x404040);
scene.add(amlight);

let car;
const loader = new GLTFLoader();
loader.load(
  "toyota.glb",
  function (gltf) {
    car = gltf.scene;
    car.scale.set(0.5, 0.5, 0.5);
    car.rotation.set(0, Math.PI, 0);
    console.log(car);

    gltf.scene.traverse(function (child) { });

    scene.add(car);
  },
);

var direction = new THREE.Vector3();
direction.z = 0.5;
direction.normalize();

var roadGeometry = new THREE.BoxGeometry(4, 0.25, 150);
var roadMaterial = new THREE.MeshStandardMaterial({ color: "#8cb3d9" }, { emissive: "#000000" }, { specular: "#000000" });
var road = new THREE.Mesh(roadGeometry, roadMaterial);

road.position.x = 0;
road.position.y = -0.25;
road.position.z = -2;

scene.add(road);

var grassGeometry = new THREE.BoxGeometry(6, 0.25, 150);
var grassMaterial = new THREE.MeshStandardMaterial({ color: "#009933" }, { emissive: "#000000" }, { specular: "#000000" });
var grass = new THREE.Mesh(grassGeometry, grassMaterial);

grass.position.x = road.position.x;
grass.position.y = road.position.y - 0.001;
grass.position.z = road.position.z;

scene.add(grass);

var treeGeometry = new THREE.CylinderGeometry(0.25, 0.25, 2, 32);
var treeMaterial = new THREE.MeshStandardMaterial({ color: "#802b00" }, { emissive: "#000000" }, { specular: "#000000" });
var tree = new THREE.Mesh(treeGeometry, treeMaterial);

var treesAmount = 15;
var treesGap = 4;
var treeGroupLeft = new THREE.Group();
var treeGroupRight = new THREE.Group();

for (let i = 0; i < treesAmount; i++) {
  var trees = tree.clone();
  trees.position.x = -2;
  trees.position.y = 1;
  trees.position.z = -2 - i * treesGap;
  treeGroupLeft.add(trees);
}

for (let i = 0; i < treesAmount; i++) {
  var trees = tree.clone();
  trees.position.x = 2;
  trees.position.y = 1;
  trees.position.z = -2 - i * treesGap;
  treeGroupRight.add(trees);
}

scene.add(treeGroupLeft);
scene.add(treeGroupRight);

var dashLineGeometry = new THREE.BoxGeometry(0.25, 0.25, 2);
var dashLineMaterial = new THREE.MeshStandardMaterial({ color: "#009933" }, { emissive: "#000000" }, { specular: "#000000" });
var dashLine = new THREE.Mesh(dashLineGeometry, dashLineMaterial);

var dashAmount = 15;
var dashGap = 4;
var dashGroup = new THREE.Group();

for (let i = 0; i < dashAmount; i++) {
  var dashLines = dashLine.clone();
  dashLines.position.x = 0;
  dashLines.position.y = road.position.y + 0.0001;
  dashLines.position.z = -2 - i * dashGap;
  dashGroup.add(dashLines);
}

scene.add(dashGroup);

var otherCarGeometry = new THREE.BoxGeometry(0.5, 0.5, 1);
var otherCarMaterial = new THREE.MeshStandardMaterial({ color: "#009933" }, { emissive: "#000000" }, { specular: "#000000" });
var otherCar = new THREE.Mesh(otherCarGeometry, otherCarMaterial);

var otherCarAmount = 5;
var otherCarGap = 4;
var otherCarGroup = new THREE.Group();
var initialPos = 80;

for (let i = 0; i < otherCarAmount; i++) {
  var otherCars = otherCar.clone();
  var carOffset = Math.random(-1, 1);
  otherCars.position.x = -0.75 + carOffset;
  otherCars.position.y = 0;
  otherCars.position.z = -initialPos - i * otherCarGap;
  otherCarGroup.add(otherCars);
}

scene.add(otherCarGroup);

let gameOver = new THREE.TextSprite({
  text: 'Game Over!',
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontSize: 1,
  fillColor: '#f23d55',
  fillStyle: '#f23d55',
});

gameOver.position.x = 0;
gameOver.position.y = 4;
gameOver.position.z = -10;

let instruction = new THREE.TextSprite({
  text: 'Use your face to control the car, and try not to bump!',
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontSize: 0.5,
  fillColor: '#f23d55',
  fillStyle: '#299658',
});

instruction.position.x = 0;
instruction.position.y = 7;
instruction.position.z = -10;

scene.add(instruction);

  function render () {
  drawKeypoints();

  if (placeHolder.position.x - placeHolder.position.x <= 100) {
    car.position.x = (-placeHolder.position.x / 100 + 2.25 / 2);
    car.position.y = 0;
    car.position.z = -2;
  }

  const speed = 0.5;

  treeGroupLeft.position.z += speed;
  treeGroupRight.position.z += speed;

  for (let i = 0; i < treesAmount; i++) {
    if (treeGroupLeft.position.z > 2 && treeGroupRight.position.z > 2) {
      treeGroupLeft.remove(trees);
      treeGroupRight.remove(trees);
      trees = trees.clone();
      treeGroupLeft.position.z = -2;
      treeGroupRight.position.z = -2;
    }
  }

  dashGroup.position.z += speed;

  for (let i = 0; i < dashAmount; i++) {
    if (dashGroup.position.z > 2) {
      dashGroup.remove(dashLines);
      dashLines = dashLines.clone();
      dashGroup.position.z = -2;
    }
  }

  otherCarGroup.position.z += speed;

  for (let i = 0; i < otherCarAmount; i++) {
    if (otherCarGroup.position.z > otherCarGap * otherCarAmount + initialPos) {
      otherCarGroup.remove(otherCars);
      otherCars = otherCars.clone();
      otherCarGroup.position.z = -2;
    }
  }

  const raycaster = new THREE.Raycaster();
  raycaster.set(car.position, direction);

  const intersections = raycaster.intersectObjects(otherCarGroup.children);

  // if (intersections.length > 0) {
  //   const intersection = intersections[0];
  //   if (intersection.distance < 1.5) {
  //     otherCarGroup.remove(intersection.object);
  //     scene.remove(car);
  //     scene.remove(instruction);
  //     scene.remove(otherCarGroup);
  //     scene.add(gameOver);
  //   }
  // }

  renderer.render(scene, camera);
  requestAnimationFrame(render);
};

requestAnimationFrame(render);
