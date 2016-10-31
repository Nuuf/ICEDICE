var http = require( 'http' ), express = require( 'express' ), path = require( 'path' );
var app = express(), server = http.createServer( app );

var PORT = 8000;

app.get( '/', function ( _req, _res )
{
    _res.sendFile( path.join( __dirname, './../client/html/', 'index.html' ) );
});

app.use( '/js', express.static( path.join( __dirname, './../client/javascript/' ) ) );
app.use( '/css', express.static( path.join( __dirname, './../client/css/' ) ) );
app.use( '/bow', express.static( path.join( __dirname, './../bower_components/' ) ) );
app.use( '/img', express.static( path.join( __dirname, './../client/images/' ) ) );
app.use( '/obj', express.static( path.join( __dirname, './../client/objects/' ) ) );

server.listen( PORT, function ()
{
    console.log( 'Server running on port: ' + PORT );
});

module.exports = server;