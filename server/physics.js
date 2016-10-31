var CANNON = require( 'cannon' ), io = require( './io' ), Die = require( './die' );


var LOG = true;
if (process.argv[2] === 'nolog') LOG = false;

var world, gravity = -2e1, timeStep = 1 / 6e1, maxIterations = 4, ground;
var delta, then, now, processTime = 1000 / 45;
var lwall, rwall, twall, bwall;

( function Init()
{
    world = new CANNON.World();
    world.gravity.set( 0, gravity, 0 );
    world.broadphase = new CANNON.NaiveBroadphase();
    world.defaultContactMaterial.contactEquationStiffness = 1e7;
    world.defaultContactMaterial.contactEquationRelaxation = 5;
    world.allowSleep = true;

    var gmat = new CANNON.Material( { friction: 0.02, restitution: 0.0 });
    var pbody = new CANNON.Body( { mass: 0, material: gmat });
    var pshape = new CANNON.Plane();
    pbody.addShape( pshape );

    pbody.quaternion.setFromAxisAngle( new CANNON.Vec3( 1, 0, 0 ), -Math.PI / 2 );

    world.addBody( pbody );

    ground = pbody;

    //left wall
    var lwmat = new CANNON.Material( { friction: 0.5, restitution: 5.0 });
    var lwbody = new CANNON.Body( { mass: 0, material: lwmat });
    var lwshape = new CANNON.Box( new CANNON.Vec3( 0.5, 20, 20 ) );
    lwbody.addShape( lwshape );

    lwbody.position.set( -20, 20, 0 );

    lwall = lwbody;

    //right wall
    var rwmat = new CANNON.Material( { friction: 0.5, restitution: 5.0 });
    var rwbody = new CANNON.Body( { mass: 0, material: rwmat });
    var rwshape = new CANNON.Box( new CANNON.Vec3( 0.5, 20, 20 ) );
    rwbody.addShape( rwshape );

    rwbody.position.set( 20, 20, 0 );

    rwall = rwbody;

    //top wall

    var twmat = new CANNON.Material( { friction: 0.5, restitution: 5.0 });
    var twbody = new CANNON.Body( { mass: 0, material: twmat });
    var twshape = new CANNON.Box( new CANNON.Vec3( 20, 20, 0.5 ) );
    twbody.addShape( twshape );

    twbody.position.set( 0, 20, -20 );

    twall = twbody;

    //bottom wall


    var bwmat = new CANNON.Material( { friction: 0.5, restitution: 5.0 });
    var bwbody = new CANNON.Body( { mass: 0, material: bwmat });
    var bwshape = new CANNON.Box( new CANNON.Vec3( 20, 20, 0.5 ) );
    bwbody.addShape( bwshape );

    bwbody.position.set( 0, 20, 20 );

    bwall = bwbody;


    world.addBody( lwall );
    world.addBody( rwall );
    world.addBody( twall );
    world.addBody( bwall );

    Start();
} () );

function Process()
{
    var i = 0, l = Die.list.length, die;
    for ( i; i < l; ++i )
    {
        die = Die.list[ i ];
        if ( die ) 
        {
            die.update();

            io.emit( 'dieupdate', { uuid: die.uuid, position: die.body.position, quaternion: die.body.quaternion, color: die.color, isCorrect: die.isCorrect });
        }
    }
}


function Start()
{
    var logTimer = [ processTime, processTime, 0 ];
    setInterval( function ()
    {
        now = new Date().getTime();
        if ( then !== undefined )
        {
            delta = ( now - then ) / 1e3;
            world.step( timeStep, delta, maxIterations );
            Process();
        }
        then = now;

        if ( LOG === true )
        {
            if ( logTimer[ 0 ]-- <= 0 )
            {
                logTimer[ 0 ] = logTimer[ 1 ];
                var date = new Date();
                var dateStr = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
                console.log( '[World Process Interval]: ' + ++logTimer[ 2 ] + ' world-seconds since start, dt: ' + delta + ', rt: ' + dateStr );
            }
        }

    }, processTime );
    console.log( '>[World started]<' );
}


module.exports = world;
