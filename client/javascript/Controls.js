
THREE.CustomControls = function ( _camera, _domElement )
{
    this.camera = _camera;

    this.domElement = _domElement;

    this.domElement.setAttribute( 'tabindex', 0 );

    this.camera.rotation.order = 'YXZ';


    this.keys =
        {
            W: false,
            A: false,
            S: false,
            D: false,
            Q: false,
            E: false,
            SPACE: false
        };
    this.mouse =
        {
            left: false,
            right: false
        };
    this.mouseDownVec = new THREE.Vector2( 0, 0 );
    this.mousePos = new THREE.Vector2( 0, 0 );

    this.rotSpeed = 1 * Math.PI / 180;

    this.domElement.addEventListener( 'contextmenu', function ( _e )
    {
        _e.preventDefault();
    }.bind( this ) );
    this.domElement.addEventListener( 'mousedown', function ( _e )
    {
        _e.preventDefault();
        this.domElement.focus();
        if ( _e.button === 0 ) this.mouse.left = true;
        if ( _e.button === 2 ) this.mouse.right = true;

        this.mouseDownVec.x = _e.clientX;
        this.mouseDownVec.y = _e.clientY;
    }.bind( this ) );
    this.domElement.addEventListener( 'mouseup', function ( _e )
    {
        _e.preventDefault();
        if ( _e.button === 0 ) this.mouse.left = false;
        if ( _e.button === 2 ) this.mouse.right = false;
    }.bind( this ) );
    this.domElement.addEventListener( 'mousemove', function ( _e )
    {
        _e.preventDefault();

        this.mousePos.x = _e.clientX;
        this.mousePos.y = _e.clientY;
    }.bind( this ) );


    this.domElement.addEventListener( 'keydown', function ( _e )
    {
        switch ( _e.key )
        {
            case 'w': this.keys.W = true; break;
            case 'a': this.keys.A = true; break;
            case 's': this.keys.S = true; break;
            case 'd': this.keys.D = true; break;
            case 'q': this.keys.Q = true; break;
            case 'e': this.keys.E = true; break;
            case ' ': this.keys.SPACE = true; break;
        }
    }.bind( this ) );
    this.domElement.addEventListener( 'keyup', function ( _e )
    {
        switch ( _e.key )
        {
            case 'w': this.keys.W = false; break;
            case 'a': this.keys.A = false; break;
            case 's': this.keys.S = false; break;
            case 'd': this.keys.D = false; break;
            case 'q': this.keys.Q = false; break;
            case 'e': this.keys.E = false; break;
            case ' ': this.keys.SPACE = false; break;
        }
    }.bind( this ) );
};
THREE.CustomControls.prototype.update = function ()
{
    if ( this.keys.W === true ) this.camera.translateZ( -1 );
    if ( this.keys.S === true ) this.camera.translateZ( 1 );
    if ( this.keys.A === true ) this.camera.translateX( -1 );
    if ( this.keys.D === true ) this.camera.translateX( 1 );

    if ( this.mouse.right )
    {
        this.camera.rotation.x = this.camera.rotation.x - (this.mousePos.y - this.mouseDownVec.y) / 200 / 180 * Math.PI;
        this.camera.rotation.y = this.camera.rotation.y - (this.mousePos.x - this.mouseDownVec.x) / 200 / 180 * Math.PI;
    }
};