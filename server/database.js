var mongoose = require( 'mongoose' );

mongoose.Promise = require( 'bluebird' );

var colors = require( 'colors/safe' );

mongoose.connect( 'mongodb://localhost/icedice' );

var db = mongoose.connection;

db.on( 'error', console.error.bind( console, colors.red( 'connection error:' ) ) );
db.once( 'open', function ()
{
    console.log( colors.cyan( '>>>>>>>>[Connected to database]>>>>>>>>' ) );
});

var LogSchema = mongoose.Schema(
    {
        roll: String,
        time: {
            type: Date, default: Date.now
        },
        player: String,
        dice: Number,
        total: Number,
        correct: Number
    });
var LogModel = mongoose.model( 'LogModel', LogSchema );

exports.LogSchema = LogSchema;
exports.LogModel = LogModel;