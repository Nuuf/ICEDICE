function socketSetup()
{
    //much wow
    var socket = globals.socket = io();

    var dice = globals.dice;

    socket.on('dieupdate', function(_data)
    {
        var i = 0, l = dice.length, die;
        for (i; i < l; ++i)
        {
            die = dice[i];
            if (die && die.userData.uuid === _data.uuid)
            {
                die.position.copy(_data.position);
                die.quaternion.copy(_data.quaternion);

                die.userData.shader.position.copy(die.position);

                die.userData.shader.material.uniforms.viewVector.value = new THREE.Vector3().subVectors( globals.camera.position, die.userData.shader.position );

                die.userData.isCorrect = _data.isCorrect;

                return true;
            }
        }
        var ndie = Die(_data.position.x, _data.position.y, _data.position.z, _data.color, _data.uuid);
        dice.push(ndie);
        var shaderMaterial = new THREE.ShaderMaterial( {
        vertexShader: THREE.GlowShader.vertexShader,
        fragmentShader: THREE.GlowShader.fragmentShader,
        uniforms:
        {
            c: { type: 'f', value: 1.0 },
            p: { type: 'f', value: 0.8 },
            glowColor: { type: 'c', value: new THREE.Color( 0xFFFFFF ) },
            viewVector: { type: 'v3', value: globals.camera.position }
        },
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true
        });

        var geom = new THREE.SphereGeometry(1, 16, 16);
        var mesh = new THREE.Mesh( geom, shaderMaterial );

        mesh.position.copy(ndie.position);
        mesh.scale.set(1.8, 2.4, 1.8);

        mesh.visible = false;

        ndie.userData.shader = mesh;
        globals.scene.add(ndie, mesh);
    });

    socket.on('remove', function(_data)
    {
        var i = 0, l = dice.length, die;
        for (i; i < l; ++i)
        {
            die = dice[i];
            if (die && die.userData.uuid === _data.uuid)
            {
                dice.splice(i, 1);
                die.parent.remove(die.userData.shader, die);
            }
        }
    });

    socket.on('alldicesleeping', function()
    {
        var i = 0, l = dice.length, die;
        for (i; i < l; ++i)
        {
            die = dice[i];
            if (die && die.userData.isCorrect) die.userData.shader.visible = true;
        }
    });

    socket.on('response', function(_data)
    {
        console.log(_data);
    });

    socket.on('update', function(_list)
    {
        if (globals.updatePlayerList) globals.updatePlayerList(_list);
    });

    socket.on('log', function(_str)
    {
        if (globals.addLogString) globals.addLogString(_str);
    });

}

function send(_msg)
{
    globals.socket.emit('message', _msg);
}