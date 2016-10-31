var CANNON = require( 'cannon' ), uuid = require( 'uuid' ), io = require( './io' );

var localUp = new CANNON.Vec3(), inverseBodyOrientation = new CANNON.Quaternion(), limit = Math.sin( Math.PI / 4 );

function Die( _x, _y, _z, _world, _randomAngVel, _randomLinVel, _color )
{
    if (Die.list.length >= 50) return false;
    if ( this instanceof Die )
    {
        this.uuid = uuid.v4();

        var mat = new CANNON.Material( { friction: 0.08, restitution: 0.1 });

        var shape = new CANNON.Box( new CANNON.Vec3( 1, 1, 1 ) );

        this.body = new CANNON.Body( { mass: 2, material: mat });
        this.body.sleepSpeedLimt = 0.05;
        this.body.addShape( shape );
        this.body.position.set( _x, _y, _z );

        if ( _randomAngVel === true )
        {
            this.body.angularVelocity.set(
                Math.random() * 50 - 25,
                Math.random() * 50 - 25,
                Math.random() * 50 - 25
            );
            this.body.quaternion.setFromAxisAngle( new CANNON.Vec3( 1, 0, 0 ), Math.random() * Math.PI * 2 );
            this.body.quaternion.setFromAxisAngle( new CANNON.Vec3( 0, 1, 0 ), Math.random() * Math.PI * 2 );
            this.body.quaternion.setFromAxisAngle( new CANNON.Vec3( 0, 0, 1 ), Math.random() * Math.PI * 2 );
        }
        if (_randomLinVel === true)
        {
            this.body.velocity.set(Math.random() * 100 - 50, 0, Math.random() * 100 - 50);
        }

        this.sideUp = 'NONE';

        this.color = _color;

        this.allowedSides =
            {
                PX: false,
                NX: false,
                PY: false,
                NY: false,
                PZ: false,
                NZ: false
            };

        this.isCorrect = false;


        this.body.addEventListener( 'sleep', this.onSleep );
        this.body.addEventListener( 'wake', this.onWake );

        Die.list.push( this );

        _world.addBody( this.body );
    }
    else return new Die( _x, _y, _z, _world, _randomAngVel, _randomLinVel, _color );
}
Die.prototype.update = function ()
{
    localUp.set( 0, 1, 0 );
    this.body.quaternion.inverse( inverseBodyOrientation );
    inverseBodyOrientation.vmult( localUp, localUp );

    if ( localUp.x > limit ) this.sideUp = 'PX';
    else if ( localUp.x < -limit ) this.sideUp = 'NX';
    else if ( localUp.y > limit ) this.sideUp = 'PY';
    else if ( localUp.y < -limit ) this.sideUp = 'NY';
    else if ( localUp.z > limit ) this.sideUp = 'PZ';
    else if ( localUp.z < -limit ) this.sideUp = 'NZ';
    else this.sideUp = '00';

    if ( this.allowedSides[ this.sideUp ] === true ) this.isCorrect = true;
    else this.isCorrect = false;
};
Die.prototype.onSleep = function ()
{
    if ( ++Die.sleepTotal >= Die.list.length )
    {
        if ( Die.allSleeping === false )
        {
            Die.allSleeping = true;

            if (Die.onAllSleep) Die.onAllSleep();

            io.emit( 'alldicesleeping' );
        }
        Die.sleepTotal = 0;
    }
};
Die.prototype.onWake = function ()
{
    Die.sleepTotal--;
    Die.allSleeping = false;
};
Die.prototype.remove = function ()
{
    var index = Die.list.indexOf( this );
    Die.list.splice( index, 1 );
    this.body.world.removeBody( this.body );
    io.emit( 'remove', { uuid: this.uuid });
};
Die.prototype.GetSideValue = function()
{
    switch( this.sideUp)
    {
        case Die.SIDES.ONE: return 1;
        case Die.SIDES.TWO: return 2;
        case Die.SIDES.THREE: return 3;
        case Die.SIDES.FOUR: return 4;
        case Die.SIDES.FIVE: return 5;
        case Die.SIDES.SIX: return 6;
        default: return 0;
    }
};
Die.list = [];
Die.sleepTotal = 0;
Die.allSleeping = false;
Die.removeAll = function ()
{
    while ( Die.list.length > 0 )
    {
        Die.list[ 0 ].remove();
    }
    Die.sleepTotal = 0;
    Die.allSleeping = false;
};
Die.SIDES =
    {
        PX: 'ONE',
        NX: 'TWO',
        PY: 'THREE',
        NY: 'SIX',
        PZ: 'FOUR',
        NZ: 'FIVE',
        ONE: 'PX',
        TWO: 'NX',
        THREE: 'PY',
        FOUR: 'PZ',
        FIVE: 'NZ',
        SIX: 'NY'
    };

module.exports = Die;