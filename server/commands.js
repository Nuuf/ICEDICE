var nkcp = require( 'nkcp' ), io = require( './io' ), Die = require( './die' ), world = require( './physics' ), db = require( './database' );

var cmdlist = nkcp.CommandList({selected: true});

var colors = require( 'colors/safe' );

var CMD_DATA = { roller: '', rollerColor: '', log: true, list: cmdlist };


function createLogString()
{
    var str = '', total = 0, totalCorrect = 0;
    str += 'Player: ' + CMD_DATA.roller + ' rolled: ';
    var i = 0, l = Die.list.length, die;
    for ( i; i < l; ++i )
    {
        die = Die.list[ i ];
        var dval = die.GetSideValue();
        total += dval;
        str += dval;
        if ( i !== l - 1 ) str += ' + ';
        if ( die.isCorrect === true ) totalCorrect++;
    }
    str += ' = ' + total + ', correct: ' + totalCorrect + ' [' + l + ' DICE]';

    io.emit( 'log', str );

    var model = new db.LogModel( { roll: str, player: CMD_DATA.roller, dice: l, total: total, correct: totalCorrect});
    model.save( function ( _err )
    {
        if ( _err ) console.log( colors.red( _err ) );
        else ( console.log( colors.green( 'Roll saved to database' ) ) );
    });
}

Die.onAllSleep = function ()
{
    if ( CMD_DATA.log === true ) createLogString();
};

cmdlist.add( nkcp.Command( 'fullroll', function ( _dataStrs, _data )
{
    Die.removeAll();
    CMD_DATA.log = true;
    var a = parseInt( _dataStrs[ 0 ] ), i;
    if ( a > 50 ) 
    {
        _data.socket.emit( 'response', { message: 'You cannot roll more than 50' });
        return false;
    }
    var allowedSides =
        {
            PX: false,
            NX: false,
            PY: false,
            NY: false,
            PZ: false,
            NZ: false
        };
    for ( i = 1; i < _dataStrs.length; ++i )
    {
        var side = _dataStrs[ i ];
        if ( side );
        {
            allowedSides[ Die.SIDES[ side ] ] = true;
        }
    }
    for ( i = 0; i < a; ++i ) 
    {
        var die = Die( Math.random() * 10 - 5, 5, Math.random() * 10 - 5, world, true, true, _data.socket.color );
        if ( die === false )
        {
            _data.socket.emit( 'response', { message: 'MAXIMUM LIMIT REACHED' });
            break;
        }
        else die.allowedSides = allowedSides;
    }
    CMD_DATA.roller = _data.socket.name;
    CMD_DATA.rollerColor = _data.socket.color;
}, 'remove all dice and roll dice' ) );


cmdlist.add( nkcp.Command( 'roll', function ( _dataStrs, _data )
{
    CMD_DATA.log = false;
    var a = parseInt( _dataStrs[ 0 ] ), i;
    if ( a > 50 ) 
    {
        _data.socket.emit( 'response', { message: 'You cannot roll more than 50' });
        return false;
    }
    for ( i = 0; i < a; ++i ) 
    {
        var die = Die( Math.random() * 10 - 5, 5, Math.random() * 10 - 5, world, true, true, _data.socket.color );
        if ( die === false ) 
        {
            _data.socket.emit( 'response', { message: 'MAXIMUM LIMIT REACHED' });
            break;
        }
    }
}, 'roll dice' ) );

cmdlist.add( nkcp.Command( 'removeall', function ()
{
    Die.removeAll();
}, 'removes all dice' ) );

cmdlist.add( nkcp.Command( 'set', function ( _dataStrs, _data )
{
    _data.socket[ _dataStrs[ 0 ] ] = _dataStrs[ 1 ];
}, 'set socket data' ) );

cmdlist.add( nkcp.Command( 'update', function ( _dataStrs, _data )
{
    var list = '';
    var sockets = io.sockets.sockets, socket;
    for ( var _id in sockets )
    {
        socket = sockets[ _id ];
        if (socket && socket.name !== 'NULL') list += '<li><span style="color: ' + socket.color.replace( '0x', '#' ) + '">' + socket.name + '</span></li>';
    }
    io.emit( 'update', list );
}, 'send update info' ) );

module.exports = CMD_DATA;