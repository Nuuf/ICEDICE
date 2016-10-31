function Background( _axis )
{
    if ( !Background.mesh ) throw new Error( 'Background not initialised' );
    var c = Background.mesh.clone();
    if ( _axis && _axis instanceof THREE.Vector3 )
    {
        c.quaternion.setFromAxisAngle( _axis, -Math.PI / 2 );
    }
    return c;
}
Background.Init = function ( _onInit )
{
    var tex = Background.texture = new THREE.Texture();

    globals.imageLoader.load( './img/bg/bg.jpg', function ( _img )
    {
        tex.image = _img;
        tex.needsUpdate = true;

        var geom = new THREE.PlaneGeometry( 102, 51 );
        var mat = new THREE.MeshPhongMaterial( { map: tex });

        var mesh = new THREE.Mesh( geom, mat );

        mesh.receiveShadow = true;

        Background.mesh = mesh;

        if ( _onInit && typeof _onInit === 'function' ) _onInit();
    });
};