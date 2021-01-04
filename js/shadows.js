
import * as THREE from 'three/build/three.module.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';


let renderer, scene, camera;

let spotLight, lightHelper, shadowCameraHelper;

let gui;

function init() {

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    renderer.shadowMap.enabled = true;

    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(0, 2, 13);

    const controls = new TrackballControls( camera, renderer.domElement );
    controls.rotateSpeed = -1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = -0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;

    const ambient = new THREE.AmbientLight( 0xffffff, 0.05 );
    scene.add( ambient );

    spotLight = new THREE.SpotLight( 0xffffff, 1 );
    spotLight.position.set( 0, 40, 35 );
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.1;
    spotLight.decay = 2;
    spotLight.distance = 200;

    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 512;
    spotLight.shadow.mapSize.height = 512;
    spotLight.shadow.camera.near = 10;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.focus = 1;
    scene.add( spotLight );

    lightHelper = new THREE.SpotLightHelper( spotLight );
    scene.add( lightHelper );

    shadowCameraHelper = new THREE.CameraHelper( spotLight.shadow.camera );
    scene.add( shadowCameraHelper );

    //

    let material = new THREE.MeshPhongMaterial( { color: 0x808080, dithering: true } );

    let geometry = new THREE.PlaneBufferGeometry( 2000, 2000 );

    let mesh = new THREE.Mesh( geometry, material );
    mesh.position.set( 0, - 1, 0 );
    mesh.rotation.x = - Math.PI * 0.5;
    mesh.receiveShadow = true;
    scene.add( mesh );

    //

    material = new THREE.MeshPhongMaterial( { color: 0x4080ff, dithering: true } );

    geometry = new THREE.CylinderBufferGeometry( 5, 5, 2, 32, 1, false );

    mesh = new THREE.Mesh( geometry, material );
    mesh.position.set( 0, 5, 0 );
    mesh.castShadow = true;
    scene.add( mesh );

    render();

    window.addEventListener( 'resize', onResize, false );

}

function onResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function render() {

    lightHelper.update();

    shadowCameraHelper.update();

    renderer.render( scene, camera );

}

function buildGui() {

    gui = new GUI();

    const params = {
        'light color': spotLight.color.getHex(),
        intensity: spotLight.intensity,
        distance: spotLight.distance,
        angle: spotLight.angle,
        penumbra: spotLight.penumbra,
        decay: spotLight.decay,
        focus: spotLight.shadow.focus
    };

    gui.addColor( params, 'light color' ).onChange( function ( val ) {

        spotLight.color.setHex( val );
        render();

    } );

    gui.add( params, 'intensity', 0, 2 ).onChange( function ( val ) {

        spotLight.intensity = val;
        render();

    } );


    gui.add( params, 'distance', 50, 200 ).onChange( function ( val ) {

        spotLight.distance = val;
        render();

    } );

    gui.add( params, 'angle', 0, Math.PI / 3 ).onChange( function ( val ) {

        spotLight.angle = val;
        render();

    } );

    gui.add( params, 'penumbra', 0, 1 ).onChange( function ( val ) {

        spotLight.penumbra = val;
        render();

    } );

    gui.add( params, 'decay', 1, 2 ).onChange( function ( val ) {

        spotLight.decay = val;
        render();

    } );

    gui.add( params, 'focus', 0, 1 ).onChange( function ( val ) {

        spotLight.shadow.focus = val;
        render();

    } );

    gui.open();

}

init();

buildGui();

render();
