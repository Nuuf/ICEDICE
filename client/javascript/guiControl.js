function guiControl()
{
    var init_cover = $( '#init_cover' );
    var init_name = $( '#init_name' );
    var init_color = $( '#init_color' );
    var gui = $( '#gui' );
    var join = $( '#join' );

    var reset_highlight = $( '#reset_highlight' );

    var dice = $( '#dice' );
    var fullroll = $( '#fullroll' );
    var roll = $( '#roll' );

    var hone = $( '#hone' );
    var htwo = $( '#htwo' );
    var hthr = $( '#hthr' );
    var hfou = $( '#hfou' );
    var hfiv = $( '#hfiv' );
    var hsix = $( '#hsix' );

    var pnames = $( '#pnames' );

    var reset_camera = $( '#reset_camera' );

    var canvas = $( globals.renderer.domElement );

    var head_display = $('#head_display');

    join.on( 'click', function ( _e )
    {
        var in_val = init_name.val();
        var ic_val = init_color.val().replace( '#', '0x' );
        if ( init_name.val() !== '' ) 
        {
            send( 'set name ' + in_val );
            send( 'set color ' + ic_val );

            init_cover.toggle();
            gui.toggle();

            send('update');
        }
    });
    reset_highlight.on( 'click', function ( _e )
    {
        var boxes = $( '#hboxes > li > input' );
        boxes.prop( 'checked', false );
    });

    fullroll.on( 'click', function ( _e )
    {
        var msg = 'fullroll ' + dice.val() + ' ';
        if ( hone.prop( 'checked' ) === true ) msg += 'ONE ';
        if ( htwo.prop( 'checked' ) === true ) msg += 'TWO ';
        if ( hthr.prop( 'checked' ) === true ) msg += 'THREE ';
        if ( hfou.prop( 'checked' ) === true ) msg += 'FOUR ';
        if ( hfiv.prop( 'checked' ) === true ) msg += 'FIVE ';
        if ( hsix.prop( 'checked' ) === true ) msg += 'SIX ';
        send( msg );
        dice.val('');
    });
    roll.on( 'click', function ( _e )
    {
        var msg = 'roll ' + dice.val();
        send( msg );
        dice.val('');
    });

    dice.on( 'keydown', function ( _e )
    {
        if ( _e.key === 'Enter' && _e.altKey === true ) roll.click();
        else if ( _e.key === 'Enter' ) fullroll.click();
    });

    canvas.on( 'click', function ( _e )
    {
        if ( _e.button === 0 ) dice.focus();
    });

    globals.updatePlayerList = function ( _list )
    {
        pnames.html( _list );
    };

    globals.addLogString = function(_str)
    {
        console.log(_str);
        head_display.html(_str);
    };

    reset_camera.on( 'click', function ( _e )
    {
        globals.camera.position.set( 0, 100, 10 );
        globals.camera.lookAt(new THREE.Vector3(0, 0, 0));
    });
}