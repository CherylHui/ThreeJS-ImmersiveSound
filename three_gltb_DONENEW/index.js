
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import threejsOrbitControls from 'https://cdn.skypack.dev/threejs-orbit-controls';



const scene = new THREE.Scene()


const loader = new GLTFLoader()
loader.load('assets/art_gallery.glb', function(glb){
    console.log(glb)
    const root = glb.scene;
    root.scale.set(1,1,1)
    scene.add(root);
},function(xhr){
    console.log((xhr.loader/xhr.total * 100) + "% loaded")
},function(error){
    console.log('An error occurred')
})


var audio = new Audio("/assets/audio.mp3"); 
audio.play();

    //audio anayser setup
    var context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();
    src.connect(analyser);
    analyser.connect(context.destination);
    analyser.fftSize = 512;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);

    function render() {
        analyser.getByteFrequencyData(dataArray);
        console.log(dataArray)
        requestAnimationFrame(render);
    };
    render();



    //camera
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)
// camera.position.set(0,1,2)
camera.position.x = 10;
camera.position.y = 10;
camera.position.z = 10;
// scene.add(camera)

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



function animate(){
    requestAnimationFrame(animate)
    renderer.render(scene,camera)
}

animate()



/////////////////////////////
var group = new THREE.Group();

var geometry = new THREE.IcosahedronGeometry(20, 0);

var material = new THREE.MeshLambertMaterial({ color: 0x383838, wireframe: true });
var noise = new SimplexNoise();

var ball = new THREE.Mesh(geometry, material);
ball.position.set(0, 0, 0);

group.add(ball);
scene.add(group);


function visualise() {
    analyser.getByteFrequencyData(dataArray);
    console.log(dataArray)
    var lowerHalfArray = dataArray.slice(0, (dataArray.length / 2) - 1);
    var upperHalfArray = dataArray.slice((dataArray.length / 2) - 1, dataArray.length - 1);

    var overallAvg = avg(dataArray);
    var lowerMax = max(lowerHalfArray);
    var lowerAvg = avg(lowerHalfArray);
    var upperMax = max(upperHalfArray);
    var upperAvg = avg(upperHalfArray);

    var lowerMaxFr = lowerMax / lowerHalfArray.length;
    var lowerAvgFr = lowerAvg / lowerHalfArray.length;
    var upperMaxFr = upperMax / upperHalfArray.length;
    var upperAvgFr = upperAvg / upperHalfArray.length;

    WarpBall(ball, modulate(Math.pow(lowerMaxFr, 0.8), 0, 1, 0, 8), modulate(upperAvgFr, 0, 1, 0, 4));

    requestAnimationFrame(render);
    renderer.render(scene, camera);
};

function WarpBall(mesh, bassFr, treFr) {
    mesh.geometry.vertices.forEach(function(vertex) {
        var offset = mesh.geometry.parameters.radius;
        var amp = 5;
        var time = window.performance.now();
        vertex.normalize();
        var rf = 0.00001;
        var distance = (offset + bassFr) + noise.noise3D(vertex.x + time * rf * 6, vertex.y + time * rf * 7, vertex.z + time * rf * 8) * amp * treFr;
        vertex.multiplyScalar(distance);
    });

    mesh.geometry.verticesNeedUpdate = true;
    mesh.geometry.normalsNeedUpdate = true;
    mesh.geometry.computeVertexNormals();
    mesh.geometry.computeFaceNormals();
}

visualise();


////////////////////////

//helper functions
function fractionate(val, minVal, maxVal) {
    return (val - minVal) / (maxVal - minVal);
}

function modulate(val, minVal, maxVal, outMin, outMax) {
    var fr = fractionate(val, minVal, maxVal);
    var delta = outMax - outMin;
    return outMin + (fr * delta);
}

function avg(arr) {
    var total = arr.reduce(function (sum, b) { return sum + b; });
    return (total / arr.length);
}

function max(arr) {
    return arr.reduce(function (a, b) { return Math.max(a, b); })
}