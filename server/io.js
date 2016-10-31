var server = require( './server' ), sio = require( 'socket.io' ), colors = require( 'colors/safe' ), nkcp = require('nkcp');
var io = sio.listen( server );

io.on( 'connection', function ( _socket )
{
    _socket.color = '0xFFFFFF';
    _socket.name = 'NULL';
    console.log( colors.green( 'connection:' + _socket.request.connection.remoteAddress.replace( '::ffff:', '' ) ) );
    _socket.on( 'disconnect', function ()
    {
        nkcp.parseSelected( 'update' );
        console.log( colors.red( 'disconnection:' + _socket.request.connection.remoteAddress.replace( '::ffff:', '' ) ) );
    });
    _socket.on( 'message', function ( _msg )
    {
        if ( typeof _msg === 'string' )
        {
            if ( nkcp.parseSelected( _msg, { socket: _socket }) === false ) console.log( 'Command not found------' );
        }
    });
});

module.exports = io;


