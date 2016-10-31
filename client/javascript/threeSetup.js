function threeSetup()
{
    "use strict";
    globals.wh.push( window.innerWidth, window.innerHeight, window.innerWidth / window.innerHeight );

    var width = globals.wh[ 0 ], height = globals.wh[ 1 ], aspectRatio = globals.wh[ 2 ], fov = 45;
    //renderer
    var rndr = globals.renderer = new THREE.WebGLRenderer( { antialias: true });
    rndr.setSize( width, height );
    rndr.shadowMap.enabled = true;
    rndr.shadowMap.type = THREE.PCFSoftShadowMap;
    rndr.gammaInput = true;
    rndr.gammaOutput = true;
    $( document.body ).append( rndr.domElement );

    //scene
    var scene = globals.scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x151515 );

    //camera
    var cam = globals.camera = new THREE.PerspectiveCamera( fov, aspectRatio, 1, 1000 );
    cam.position.set( 0, 100, 10 );
    cam.up = new THREE.Vector3( 0, 1, 0 );
    cam.lookAt( new THREE.Vector3( 0, 0, 0 ) );

    //light
    var ambLight = new THREE.AmbientLight( 0xFFFFFF, 0.3 );
    var spotLight = new THREE.SpotLight( 0xFFFFFF, 1 );
    spotLight.position.set( 0, 30, 0 );
    spotLight.distance = 50;
    spotLight.castShadow = true;
    spotLight.shadow.camera.visible = true;
    spotLight.shadow.mapSize.width = spotLight.shadow.mapSize.height = 512;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 200;

    //loaders
    globals.loadingManager = new THREE.LoadingManager();
    globals.imageLoader = new THREE.ImageLoader( globals.loadingManager );
    globals.objectLoader = new THREE.OBJLoader( globals.loadingManager );

    //init objects
    Die.Init( function ()
    {
        socketSetup();
    });
    Background.Init( function ()
    {
        scene.add( Background( new THREE.Vector3( 1, 0, 0 ) ) );
    });

    //left wall
    var wallgeom = new THREE.BoxGeometry( 1, 40, 40 );
    var wallmat = new THREE.MeshBasicMaterial( { color: 0x0, wireframe: true });
    var wall = new THREE.Mesh( wallgeom, wallmat );
    wall.position.set( -20, 20, 0 );

    scene.add( wall );

    //right wall
    var wallgeom = new THREE.BoxGeometry( 1, 40, 40 );
    var wallmat = new THREE.MeshBasicMaterial( { color: 0x0, wireframe: true });
    var wall = new THREE.Mesh( wallgeom, wallmat );
    wall.position.set( 20, 20, 0 );

    scene.add( wall );

    //top wall
    var wallgeom = new THREE.BoxGeometry( 40, 40, 1 );
    var wallmat = new THREE.MeshBasicMaterial( { color: 0x0, wireframe: true });
    var wall = new THREE.Mesh( wallgeom, wallmat );
    wall.position.set( 0, 20, -20 );

    scene.add( wall );

    //bottom wall
    var wallgeom = new THREE.BoxGeometry( 40, 40, 1 );
    var wallmat = new THREE.MeshBasicMaterial( { color: 0x0, wireframe: true });
    var wall = new THREE.Mesh( wallgeom, wallmat );
    wall.position.set( 0, 20, 20 );

    scene.add( wall );

    //add
    scene.add( ambLight, spotLight );

    //controls
    var ctrls = globals.controls = new THREE.CustomControls( cam, rndr.domElement );

    window.addEventListener('resize', function(_e)
    {
        globals.wh[0] = window.innerWidth;
        globals.wh[1] = window.innerHeight;
        globals.wh[2] = window.innerWidth/window.innerHeight;
        cam.aspect = globals.wh[2];
        cam.updateProjectionMatrix();
        rndr.setSize(globals.wh[0],globals.wh[1]);
    }, false);

    ( function Update()
    {
        requestAnimationFrame( Update );

        if ( ctrls ) ctrls.update();
        rndr.render( scene, cam );
    } () );
}