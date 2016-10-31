var colors = require( 'colors/safe' );
console.log( colors.cyan( '<[ICEDICE Server started]>' ) );
var server = require( './server/server' );
var phs = require( './server/physics' );
var io = require( './server/io' );
var db = require( './server/database' );
require( './server/commands' );

