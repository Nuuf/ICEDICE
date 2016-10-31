function Die( _x, _y, _z, _color, _uuid )
{
    if ( !Die.mesh ) throw new Error( 'Dice not initialised' );
    var c = Die.mesh.clone();
    c.traverse( function ( _node )
    {
        if ( _node instanceof THREE.Mesh )
        {
            var cmat = _node.material.clone();
            cmat.color = new THREE.Color(parseInt(_color));
            _node.material = cmat;
        }
    });
    c.position.set( _x, _y, _z );
    c.scale.set( 5.2, 5.2, 5.2 );

    c.userData.uuid = _uuid;
    c.userData.isCorrect = false;

    c.userData.shader = null;

    return c;
}
Die.Init = function ( _onInit )
{
    var tex = Die.texture = new THREE.Texture(), nmap = Die.normalMap = new THREE.Texture();
    var ildr = globals.imageLoader, oldr = globals.objectLoader;

    ildr.load( './img/dice/Dice_Diff_White.png', function ( _img )
    {
        tex.image = _img;
        tex.needsUpdate = true;
        ildr.load( './img/dice/Dice_Lowpoly_Normal_256.png', function ( _img )
        {
            nmap.image = _img;
            nmap.needsUpdate = true;
            oldr.load( './obj/Dice.obj', function ( _obj )
            {
                _obj.traverse( function ( _node )
                {
                    if ( _node instanceof THREE.Mesh )
                    {
                        _node.material.map = tex;
                        _node.material.normalMap = nmap;
                        _node.castShadow = true;
                    }
                });

                Die.mesh = _obj;

                if ( _onInit && typeof _onInit === 'function' ) _onInit();
            });
        });
    });
};