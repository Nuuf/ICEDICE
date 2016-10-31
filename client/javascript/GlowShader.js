THREE.GlowShader = {
    /* http://stemkoski.github.io/Three.js/Shader-Glow.html */
    vertexShader: [

        /*"void main()",
        "{",
        "gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);",
        "}"*/

        "uniform vec3 viewVector;",
        "uniform float c;",
        "uniform float p;",
        "varying float intensity;",
        "void main()",
        "{",
        "vec3 vNormal=normalize(normalMatrix*normal);",
        "vec3 vNormel=normalize(normalMatrix*viewVector);",
        "intensity=pow(c-dot(vNormal,vNormel),p);",
        "gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);",
        "}"

    ].join( '' ),

    fragmentShader: [

        /*"void main()",
        "{",
        "gl_FragColor=vec4(1.0,0.0, 1.0, 1.0);",
        "}"*/

        "uniform vec3 glowColor;",
        "varying float intensity;",
        "void main()",
        "{",
        "vec3 glow=glowColor * intensity;",
        "gl_FragColor=vec4(glow,1.0);",
        "}"

    ].join( '' )
};