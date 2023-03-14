	//ThreeJS.ImmersiveSoundPrototype
	//Author: Sze Man Chiu ,Wing Hei Cheryl Hui ,Wei Lee, Yuan Peng, Jaime To 
	//Reference from : https://github.com/mrdoob/three.js/blob/master/examples/webaudio_sandbox.html [Positional Audio Part]
	//Reference from : https://threejs.org/examples/?q=sphere#webgl_morphtargets_sphere [3D shape updates]
	//Reference from : https://jsfiddle.net/bentoBAUX/839b7q5p/12/ [audio analysis]
	//Reference from : https://www.youtube.com/watch?v=0pCpRvoOTBs&list=PLsIKyI8X98GLXIzQrtTJGfsCHgFFKmGxM [Orbit Control]
	//Reference from : https://www.youtube.com/watch?v=yPA2z7fl4J8 [GLTF loader]
	


import * as THREE from  'three';
			import { OrbitControls } from '/three/examples/jsm/controls/OrbitControls.js';
			import { GLTFLoader } from '/three/examples/jsm/loaders/GLTFLoader.js';
			import { RGBELoader } from '/three/examples/jsm/loaders/RGBELoader.js';

let camera, scene, renderer, clock; //define camera, scene, renderer and clock

var mesh; //define mesh for object
var mesh2;//define mesh for object
var mesh3;//define mesh for object


let sign = 1;
const speed = 0.5;

init();
animate();


function init() {

	//const container = document.getElementById( 'container' );
	const container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.2, 100 );
	camera.position.set( 0, 5, 5 );

	scene = new THREE.Scene();
	//scene.background = new THREE.Color(0xffffff);

	clock = new THREE.Clock();

	const light1 = new THREE.PointLight( 0xffffff, 0.7 );
	light1.position.set( 100, 100, 100 );
	scene.add( light1 );

	const light2 = new THREE.PointLight( 0x22ff00, 0.7 );
	light2.position.set( - 100, - 100, - 100 );
	scene.add( light2 );

	const light3 = new THREE.PointLight( 0xff2200, 0.7 );
	light1.position.set( 100, 150, 100 );
	scene.add( light1 );

	scene.add( new THREE.AmbientLight( 0x111111 ) );


//Reference from : https://www.youtube.com/watch?v=yPA2z7fl4J8 [GLTF loader]
//GLTF loader: Head
const loader = new GLTFLoader()
loader.load('assets/newheadv2.gltf', function(gltf){
    console.log(gltf)
    const root = gltf.scene;
    root.scale.set(0.1,0.1,0.1)
    scene.add(root);
},function(xhr){
    console.log((xhr.loader/xhr.total * 100) + "% loaded")
},function(error){
    console.log('An error occurred')
})


//=========Audio Object Part=============
//Reference from : https://github.com/mrdoob/three.js/blob/master/examples/webaudio_sandbox.html [Positional Audio Part]
// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add( listener );

	//////////first model///////////////
	// loading in 3D ear object
	loader.load( '/assets/ear_bluishgreen.gltf', function ( gltf ) {
		gltf.scene.traverse( function ( node ) {
						if ( node.isMesh ) mesh = node;
					} );
					mesh.material.morphTargets = true;
					mesh.rotation.z = Math.PI / 2; // rotate the object along z axis 
					mesh.position.set(5.2,0,0); //setting the object's position
					mesh.material.visible = true; //showing the material of the object
					
					scene.add( mesh ); //adding the object to the scene

		//Adding audio part
				const sound1 = new THREE.PositionalAudio( listener ); //adding positional audio listener
				const songElement = document.getElementById( 'drum' ); //locating the drum track 
				sound1.setMediaElementSource( songElement );  //set the audio as the drum track
				sound1.setRefDistance( 20 ); //set referenece distance
				songElement.play(); //play the audio part
				mesh.add( sound1 ); // add the audio part to the object, the ear
		
		var pointsMaterial = new THREE.PointsMaterial( {
			size: 10,
			sizeAttenuation: false,
			map: new THREE.TextureLoader().load( 'assets/disc.png' ),
			alphaTest: 0.5,
			//morphTargets: true
		} );

		var points = new THREE.Points( mesh.geometry, pointsMaterial );
		
		console.log(pointsMaterial);

		points.morphTargetInfluences = mesh.morphTargetInfluences;
		console.log(mesh.morphTargetInfluences)
		points.morphTargetDictionary = mesh.morphTargetDictionary;

		mesh.add( points );

	} );


	//////////second model///////////////
	// loading in 3D ear object
	loader.load( '/assets/ear_bluishgreen.gltf', function ( gltf ) {
		gltf.scene.traverse( function ( node ) {
						if ( node.isMesh ) mesh2 = node;
					} );
					mesh2.material.morphTargets = true;
					mesh2.rotation.z = Math.PI / 4; // rotate the object along z axis 
					mesh2.position.set(-5.2,0,0); //set the position of the object
					//mesh.material.visible = true;
					
					scene.add( mesh2 ); // add the object to the scene

	//Adding audio part
				const sound2 = new THREE.PositionalAudio( listener ); //adding positional audio listener
				const skullbeatzElement = document.getElementById( 'piano' ); //locating the piano track
				sound2.setMediaElementSource( skullbeatzElement ); //set the audio as the piano track
				sound2.setRefDistance( 20 ); //set referenece distance
				skullbeatzElement.play(); //play the audio part
				mesh2.add( sound2 ); // add the audio part to the object, the ear
					
		//
		var pointsMaterial = new THREE.PointsMaterial( {
			size: 10,
			sizeAttenuation: false,
			map: new THREE.TextureLoader().load( 'assets/disc.png' ),
			alphaTest: 0.5,
			
		} );

		var points = new THREE.Points( mesh2.geometry, pointsMaterial );

		points.morphTargetInfluences = mesh2.morphTargetInfluences;
		points.morphTargetDictionary = mesh2.morphTargetDictionary;

		mesh2.add( points );

	} );

	//////////third model///////////////
	// loading in 3D metal brain object (the small brain inside the scene)
	loader.load( '/assets/metalbrain.gltf', function ( gltf ) {
		gltf.scene.traverse( function ( node ) {
						if ( node.isMesh ) mesh3 = node;
					} );
					mesh3.material.morphTargets = true;
					mesh3.position.set(0,2,6); //setting the position of the object
					//mesh.material.visible = true;
					
					scene.add( mesh3 ); // add the object to the scene

	//sound part
				const sound3 = new THREE.PositionalAudio( listener ); //adding positional audio listener
				const synthElement = document.getElementById( 'synthesizer' );//locating the synthesizer track
				sound3.setMediaElementSource( synthElement );//set the audio as the synthesizer track
				sound3.setRefDistance( 20 );//set referenece distance
				synthElement.play();//play the audio part
				mesh3.add( sound3 );// add the audio part to the object, the brain
					
		//
		var pointsMaterial = new THREE.PointsMaterial( {
			size: 10,
			sizeAttenuation: false,
			map: new THREE.TextureLoader().load( 'assets/disc.png' ),
			alphaTest: 0.5,
		
		} );

		var points = new THREE.Points( mesh3.geometry, pointsMaterial );

		points.morphTargetInfluences = mesh3.morphTargetInfluences;
		points.morphTargetDictionary = mesh3.morphTargetDictionary;

		mesh3.add( points );

	} );


	///////////////////////RENDERER//////////////////////
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );


	//Reference from : https://www.youtube.com/watch?v=0pCpRvoOTBs&list=PLsIKyI8X98GLXIzQrtTJGfsCHgFFKmGxM [Orbit Control]
	////////////////////Orbit Control START//////////////////////////
	const controls = new OrbitControls( camera, renderer.domElement );
	
	//orbit control by mouse
	controls.mouseButtons = {
		LEFT: THREE.MOUSE.ROTATE,
		MIDDLE: THREE.MOUSE.DOLLY,
		RIGHT: THREE.MOUSE.PAN
	}
	controls.enableDamping = true
	controls.enablePan = true
	controls.minDistance = 1
	controls.maxDistance = 60
	controls.maxPolarAngle = Math.PI / 2 - 0.05 //prevent camera below ground
	controls.minPolarAngle = Math.PI / 4 //prevent top down view
	
	controls.update();
	//////////////////////Orbit Control END////////////////////////////////////

	window.addEventListener( 'resize', onWindowResize );
	document.addEventListener( 'visibilitychange', onVisibilityChange );

}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function onVisibilityChange() {
	if ( document.hidden === true ) {
		clock.stop();
	} else {
		clock.start();
	}
}

function animate() {
	requestAnimationFrame( animate );
	render();
}

//Reference from : https://jsfiddle.net/bentoBAUX/839b7q5p/12/ [audio analysis]
///////////music analysis///////////
//We are only analysing the music of the ambient to trigger the transformation of the 3D objects
var audio = new Audio("/assets/street sound.mp3");   //Letting audio as the street sound
	audio.play(); // playing the street sound audio


	//audio analyser setup
	//////Analysing the street sound audio//////
	var context = new AudioContext();
	var src = context.createMediaElementSource(audio); //creating the source as audio(the street sound)
	var analyser = context.createAnalyser(); //create an analyser 
	src.connect(analyser); 
	analyser.connect(context.destination);
	analyser.fftSize = 512;
	var bufferLength = analyser.frequencyBinCount;
	var dataArray = new Uint8Array(bufferLength);

//////render////////////////
function render() {
	renderer.render( scene, camera );
}


function render2() {
	analyser.getByteFrequencyData(dataArray);
	
	requestAnimationFrame(render2);

	//extract different part of the sound analysized data 
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

	var bassFr = modulate(Math.pow(lowerMaxFr, 0.8), 0, 1, 0, 8);
	var lowFr = modulate(Math.pow(lowerAvgFr, 0.8), 0, 1, 0, 8);
	var treFr = modulate(upperMaxFr, 0, 1, 0, 4);

	const delta = clock.getDelta();

	//how the three 3D models are transformed based on sound 
	/////////////FIRST MODEL/////////////
	if ( mesh !== undefined ) {
	
		mesh.scale.x = 5*bassFr;
		mesh.scale.y = 5*bassFr;
		mesh.scale.z = 5*bassFr;
		


		var step = delta * speed;

					mesh.rotation.x += step;

		

		
	}

	/////////////SECOND MODEL/////////////
	if ( mesh2 !== undefined ) {
	
		mesh2.scale.x = 12*lowFr;
		mesh2.scale.y = 12*lowFr;
		mesh2.scale.z = 12*lowFr;
		// console.log(bassFr);

		var step = delta * speed;

					mesh2.rotation.z += step;

					
	}

	//Reference from : https://threejs.org/examples/?q=sphere#webgl_morphtargets_sphere [3D shape updates]
	/////////////THIRD MODEL/////////////
	if ( mesh3 !== undefined ) {
		
		mesh3.scale.x = 100*treFr;
		mesh3.scale.y = 100*treFr;
		mesh3.scale.z = 100*treFr;
	

		var step = delta * speed;

				

					mesh3.morphTargetInfluences[ 1 ] = mesh3.morphTargetInfluences[ 1 ] + step * sign;

					if ( mesh3.morphTargetInfluences[ 1 ] <= 0 || mesh3.morphTargetInfluences[ 1 ] >= 1 ) {

						sign *= - 1;
					}
	}

	renderer.render( scene, camera );
};
render2();

		//Reference from : https://jsfiddle.net/bentoBAUX/839b7q5p/12/ [audio analysis]
		////////////////////////
        //helper functions for audio
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
