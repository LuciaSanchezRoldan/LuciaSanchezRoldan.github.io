
import * as THREE from 'three';

import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';

var container
var camera
var controls
var scene
var renderer
var pickingTexture
var pickingScene
var highlightShape
var mouse
var mousePosX
var mousePosY
var offset
var pickingData
var cursorType 
var canClick 
var link 
var duplicated 

init()
startup()

function init(){
    mouse = new THREE.Vector2();
    mousePosX = "0px";
    mousePosY = "0px";
    offset = new THREE.Vector3( 1, 1, 1 );
    duplicated = false;
    pickingData = [];
    cursorType = 'grab';
    canClick = false;
    link = ""
}

function startup() {

    container = document.getElementById("container")

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x424242 );

    pickingScene = new THREE.Scene();
    pickingTexture = new THREE.WebGLRenderTarget( 1, 1 );

    scene.add( new THREE.AmbientLight( 0x555555 ) );

    const light = new THREE.SpotLight( 0xffffff, 1.5 );
    light.position.set( 0, 500, 20000 );
    scene.add( light );

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    controls = new TrackballControls( camera, renderer.domElement );
    controls.rotateSpeed = -1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = -0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    renderer.domElement.addEventListener( 'mousemove', onMouseMove.bind(this) );

  }

  function onMouseMove( e ) {

    mouse.x = e.clientX;
    mouse.y = e.clientY;

    mousePosX = mouse.x + 15 + 'px';
    mousePosY = mouse.y + 15 + 'px';

  }

  function animate() {

    window.requestAnimationFrame( () => animate() );

    threeRender();

  }

  function threeRender() {

    controls.update();

    pick();

    renderer.setRenderTarget( null );
    renderer.render( scene, camera );

  }

  function pick() {

    //render the picking scene off-screen

    // set the view offset to represent just a single pixel under the mouse

    camera.setViewOffset( renderer.domElement.width, renderer.domElement.height, mouse.x * window.devicePixelRatio | 0, mouse.y * window.devicePixelRatio | 0, 1, 1 );

    // render the scene

    renderer.setRenderTarget( pickingTexture );
    renderer.render( pickingScene, camera );

    // clear the view offset so rendering returns to normal

    camera.clearViewOffset();

    //create buffer for reading single pixel

    const pixelBuffer = new Uint8Array( 4 );

    //read the pixel

    renderer.readRenderTargetPixels( pickingTexture, 0, 0, 1, 1, pixelBuffer );

    //interpret the pixel as an ID

    const id = ( pixelBuffer[ 0 ] << 16 ) | ( pixelBuffer[ 1 ] << 8 ) | ( pixelBuffer[ 2 ] );
    const data = pickingData[ id ];

    // var debugWindow = document.getElementById("debug")
    // debugWindow.innerHTML = 'id: ' + id + '<br>' + pixelBuffer;

    if( id>0 ){
      cursorType = "pointer";
      link = "src/what.html";
      canClick = true;
    }

    if ( data  && id > 0 ) {

      //move our highlightShape so that it surrounds the picked object

      if ( data.position && data.rotation && data.scale ) {

        highlightShape.position.copy( data.position );
        highlightShape.rotation.copy( data.rotation );
        highlightShape.scale.copy( data.scale ).add( offset );
        highlightShape.visible = true;

      }

    } 
    else {

      highlightShape.visible = false;
      cursorType = "grab";
      canClick = false;

    }

  }

  function applyVertexColors( geometry, color ) {

    const position = geometry.attributes.position;
    const colors = [];

    for ( let i = 0; i < position.count; i ++ ) {

      colors.push( color.r, color.g, color.b );

    }

    geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

  }