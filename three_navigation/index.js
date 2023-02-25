// import * as THREE from './three.js-master/build/three.module.js'
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import threejsOrbitControls from 'https://cdn.skypack.dev/threejs-orbit-controls';
// import{GLTFLoader} from './three.js-master/three.js-master/examples/jsm/loaders/GLTFLoader.js'

let material1, material2, material3;

let analyser1, analyser2, analyser3;

const startButton = document.getElementById( 'startButton' );
			startButton.addEventListener( 'click', init );

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




function init() {
 
    const overlay = document.getElementById( 'overlay' );
    overlay.remove();
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

// create an object for the sound to play from
// const sphere = new THREE.SphereGeometry( 20, 32, 16 );
// const material = new THREE.MeshPhongMaterial( { color: 0xff2200 } );
// const mesh = new THREE.Mesh( sphere, material );



        
// // ground

// const helper = new THREE.GridHelper( 1000, 10, 0x444444, 0x444444 );
// helper.position.y = 0.1;
// scene.add( helper );


//renderer
const renderer = new THREE.WebGL1Renderer({ alpha: true, antialias: true});

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
const sphere = new THREE.SphereGeometry( 5, 32, 16 );

				material1 = new THREE.MeshPhongMaterial( { color: 0xffaa00, flatShading: true, shininess: 0 } );
				material2 = new THREE.MeshPhongMaterial( { color: 0xff2200, flatShading: true, shininess: 0 } );
				material3 = new THREE.MeshPhongMaterial( { color: 0x6622aa, flatShading: true, shininess: 0 } );

				// sound spheres

				const mesh1 = new THREE.Mesh( sphere, material1 );
				mesh1.position.set( - 30, 5, 0 );
				scene.add( mesh1 );

				const sound1 = new THREE.PositionalAudio( listener );
				const songElement = document.getElementById( 'drum' );
				sound1.setMediaElementSource( songElement );
				sound1.setRefDistance( 20 );
				songElement.play();
				mesh1.add( sound1 );

				//

				const mesh2 = new THREE.Mesh( sphere, material2 );
				mesh2.position.set( 30, 5, 0 );
				scene.add( mesh2 );

				const sound2 = new THREE.PositionalAudio( listener );
				const skullbeatzElement = document.getElementById( 'piano' );
				sound2.setMediaElementSource( skullbeatzElement );
				sound2.setRefDistance( 20 );
				skullbeatzElement.play();
				mesh2.add( sound2 );

				//

				const mesh3 = new THREE.Mesh( sphere, material3 );
				mesh3.position.set( 0, 0, 20 );
				scene.add( mesh3 );

                const sound3 = new THREE.PositionalAudio( listener );
				const synthElement = document.getElementById( 'synthesizer' );
				sound3.setMediaElementSource( synthElement );
				sound3.setRefDistance( 20 );
				synthElement.play();
				mesh3.add( sound3 );




// analysers

analyser1 = new THREE.AudioAnalyser( sound1, 32 );
analyser2 = new THREE.AudioAnalyser( sound2, 32 );
analyser3 = new THREE.AudioAnalyser( sound3, 32 );

// global ambient audio

const sound4 = new THREE.Audio( listener );
const streetElement = document.getElementById( 'streetSound' );
sound4.setMediaElementSource( streetElement );
sound4.setVolume( 0.5 );
streetElement.play();

const clock = new THREE.Clock();
let gameLoop = () => {
    orbitControls.update()
    renderer.render(scene, camera);
    requestAnimationFrame(gameLoop);
};
gameLoop();
}
// function animate(){
//     requestAnimationFrame(animate)
//     renderer.render(scene,camera)
// }

// animate()
