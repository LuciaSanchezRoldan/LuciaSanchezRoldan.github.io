import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';

THREE.Cache.enabled = true;
let container;
let camera, cameraTarget, scene, renderer;
let controls;
let textMesh, textGeo, materials;

let text = "LUCIA SANCHEZ ROLDAN";
let font = undefined;

const   height = 0.5,
        size = 1,
        curveSegments = 4;

let targetRotation = 0;
let targetRotationOnPointerDown = 0;

let pointerX = 0;
let pointerXOnPointerDown = 0;

let windowHalfX = window.innerWidth / 2;

let fontIndex = 1;

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    // CAMERA

    camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 1500 );
    camera.position.set(0, 2, 13);
    // camera.position.set( 0, 400, 700 );
    cameraTarget = new THREE.Vector3( 0, 150, 0 );

    // SCENE

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x000000 );
    scene.fog = new THREE.Fog( 0x000000, 250, 1400 );

    // LIGHTS

    const spotLight = new THREE.SpotLight( 0xffffff, 1 );
    spotLight.position.set( 0, 0, 10 );
    spotLight.angle = Math.PI / 8;
    spotLight.penumbra = 0;
    spotLight.decay = 1;
    spotLight.distance = 200;

    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 512;
    spotLight.shadow.mapSize.height = 512;
    spotLight.shadow.camera.near = 0;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.focus = 1;

    scene.add( spotLight );
    scene.add( spotLight.target );

    const ambient = new THREE.AmbientLight( 0xffffff, 0.05 );
    scene.add( ambient );

    //MATERIALS

    materials = [
        new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
        new THREE.MeshPhongMaterial( { color: 0xffffff } ) // side
    ];

    var bgGeo = new THREE.PlaneBufferGeometry( 100 , 100 );
    var bgMaterial = new THREE.MeshPhongMaterial( { color: 0x1e1e1e, dithering: true } );
    var backgroundObj = new THREE.Mesh( bgGeo, bgMaterial );
    scene.add( backgroundObj );

    loadFont();

    // RENDERER

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    //CONTROLS

    controls = new TrackballControls( camera, renderer.domElement );
    controls.rotateSpeed = -1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = -0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

}


function loadFont() {

    const loader = new THREE.FontLoader();
    loader.load( 'node_modules/three/examples/fonts/helvetiker_regular.typeface.json',  function ( response ) {
        font = response;
        createText()
    } );

}

function createText() {

    textGeo = new THREE.TextGeometry( text, {

        font: font,
        size: size,
        height: height,
        curveSegments: curveSegments

    } );

    textGeo.computeBoundingBox();
    textGeo.computeVertexNormals();

    const triangle = new THREE.Triangle();

    // "fix" side normals by removing z-component of normals for side faces
    // (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)

    const triangleAreaHeuristics = 0.1 * ( height * size );

    for ( let i = 0; i < textGeo.faces.length; i ++ ) {

        const face = textGeo.faces[ i ];

        if ( face.materialIndex == 1 ) {

            for ( let j = 0; j < face.vertexNormals.length; j ++ ) {

                face.vertexNormals[ j ].z = 0;
                face.vertexNormals[ j ].normalize();

            }

            const va = textGeo.vertices[ face.a ];
            const vb = textGeo.vertices[ face.b ];
            const vc = textGeo.vertices[ face.c ];

            const s = triangle.set( va, vb, vc ).getArea();

            if ( s > triangleAreaHeuristics ) {

                for ( let j = 0; j < face.vertexNormals.length; j ++ ) {

                    face.vertexNormals[ j ].copy( face.normal );

                }

            }

        }

    }

    const centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

    textGeo = new THREE.BufferGeometry().fromGeometry( textGeo );

    textMesh = new THREE.Mesh( textGeo, materials );

    textMesh.position.y = 1;

    scene.add( textMesh );

}

function animate() {

    requestAnimationFrame( animate );

    render();

}

function render() {

    camera.lookAt( cameraTarget );
    renderer.clear();
    controls.update();
    renderer.render( scene, camera );

}