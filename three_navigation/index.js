// import * as THREE from './three.js-master/build/three.module.js'
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import threejsOrbitControls from 'https://cdn.skypack.dev/threejs-orbit-controls';
// import{GLTFLoader} from './three.js-master/three.js-master/examples/jsm/loaders/GLTFLoader.js'

//const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa8def0);


//GLTF loader
const loader = new GLTFLoader()
loader.load('assets/art_gallery.glb', function(glb){
    console.log(glb)
    const root = glb.scene;
    root.scale.set(5,5,5)
    scene.add(root);
},function(xhr){
    console.log((xhr.loader/xhr.total * 100) + "% loaded")
},function(error){
    console.log('An error occurred')
})






//camera
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)
// camera.position.set(0,1,2)
camera.position.x = 10;
camera.position.y = 10;
camera.position.z = 10;
// scene.add(camera)


//=========Audio Source part=============
// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add( listener );

// create the PositionalAudio object (passing in the listener)
const sound = new THREE.PositionalAudio( listener );

// load a sound and set it as the PositionalAudio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load( 'assets/Project_Utopia.ogg', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setRefDistance( 20 );
	sound.play();
});
// create an object for the sound to play from
const sphere = new THREE.SphereGeometry( 20, 32, 16 );
const material = new THREE.MeshPhongMaterial( { color: 0xff2200 } );
const mesh = new THREE.Mesh( sphere, material );
scene.add( mesh );

// finally add the sound to the mesh
mesh.add( sound );

//renderer
const renderer = new THREE.WebGL1Renderer({ antialias: true});

renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio));
renderer.shadowMap.enable = true
// renderer.gammaOutput = true
// renderer.render(scene,camera)


//orbit camera controls
const orbitControls = new threejsOrbitControls(camera, renderer.domElement);
orbitControls.mouseButtons = {
    // MIDDLE: THREE.MOUSE.ROTATE,
    // RIGHT: THREE.MOUSE.PAN
    LEFT: THREE.MOUSE.ROTATE,
	MIDDLE: THREE.MOUSE.DOLLY,
	RIGHT: THREE.MOUSE.PAN
}

orbitControls.enableDamping = true
orbitControls.enablePan = true
orbitControls.minDistance = 5
orbitControls.maxDistance = 60
orbitControls.maxPolarAngle = Math.PI / 2 - 0.05 //prevent camera below ground
orbitControls.minPolarAngle = Math.PI / 4 //prevent top down view
orbitControls.update();

//light
const light = new THREE.DirectionalLight(0xffffff,1)
light.position.x = 20;
light.position.y = 30;
light.castShadow = true;
light.shadow.mapSize.width = 4096;
light.shadow.mapSize.height = 4096;
const d = 35;
light.shadow.camera.left = -d;
light.shadow.camera.right = d;
light.shadow.camera.top = d;
light.shadow.camera.bottom = -d;
scene.add(light)

const aLight = new THREE.AmbientLight('white',0.5);
scene.add(aLight);

//attach renderer
document.body.appendChild(renderer.domElement);

//resize handler
function onWindowResize(){
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
}
window.addEventListener('resize', onWindowResize);

// //Agent
// const agentHeight = 1.0;
// const agentRadius = 1.0;
// const agent = new THREE.Mesh(new THREE.CylinderGeometry(agentRadius,agentRadius,agentHeight),
//             new THREE.MeshPhongMaterial({color:'green'}));

// agent.position.y = agentHeight/2;
// const agentGroup = new THREE.Group();
// agentGroup.add(agent);
// agentGroup.position.z = 0;
// agentGroup.position.x = 0;
// agentGroup.position.y = 1;
// scene.add(agentGroup);

// GAMELOOP
const clock = new THREE.Clock();
let gameLoop = () => {
    orbitControls.update()
    renderer.render(scene, camera);
    requestAnimationFrame(gameLoop);
};
gameLoop();
function mousePressed() {
    if (sound.isPlaying()) {
      // .isPlaying() returns a boolean
      sound.stop();
    } else {
      sound.play();
    }
  }
// function animate(){
//     requestAnimationFrame(animate)
//     renderer.render(scene,camera)
// }

// animate()
