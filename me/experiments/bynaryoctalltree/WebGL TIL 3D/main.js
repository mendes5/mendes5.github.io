let mouseIsLocked = false;

const gl = getGL([600, 600], { autoAppend: 1, clearColor: [0, 0, 0], depth: true, cullFace: true })

const camera = new Camera(gl, 300, { near: 0.30, far: 1000, type: 'perspective', speed: 0.3, startPos: [0, 0, -10], lookAt: [4.7, -1.60] })

const elements = []

document.onpointerlockchange = e => mouseIsLocked = document.pointerLockElement === gl.canvas

onresize = e => {
    camera.getProjectionMatrix()
    gl.viewport(0, 0, gl.canvas.width = window.innerWidth, gl.canvas.height = window.innerHeight)
}

gl.canvas.onmousemove = e => {
    if (mouseIsLocked)
        camera.onMouseMove(e)
    else {

    }
}

gl.canvas.onclick = a => {
    if (!mouseIsLocked)
        gl.canvas.requestPointerLock()
}

onresize()
const lShader = createShaderProgram(gl, `
//Vertex Shader
precision mediump float;
uniform mat4 uProj;
uniform mat4 uView;
uniform mat4 uWorld;
attribute vec3 aPos;
attribute vec3 aNormal;
varying vec3 fColor;
void main(){
    fColor = aNormal;
	gl_Position = uProj * uView * uWorld  * vec4(aPos, 1.0);
}`, `
//Fragment Shader
precision mediump float;
varying vec3 fColor;
void main(){
    gl_FragColor = vec4(fColor, 1.0);
}`)
const mShader = createShaderProgram(gl, `
//Vertex Shader
precision mediump float;
uniform mat4 uProj;
uniform mat4 uView;
uniform mat4 uWorld;
attribute vec3 aPos;
void main(){
	gl_Position = uProj * uView * uWorld  * vec4(aPos, 1.0);
}`, `
//Fragment Shader
precision mediump float;
void main(){
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`)
const dShader = createShaderProgram(gl, `
//Vertex Shader
precision mediump float;
uniform mat4 uProj;
uniform mat4 uView;
uniform mat4 uWorld;
attribute vec2 aTexUV;
attribute vec3 aPos;
attribute vec3 aNormal;
varying vec2 fTexUV;
varying vec3 fNormal;
varying vec3 fPos;
void main(){
    fTexUV = aTexUV;
    fPos = (uWorld * vec4(aPos, 1.0)).xyz;
    fNormal = (uWorld * vec4(aNormal, 0.0)).xyz;
	gl_Position = uProj * uView * uWorld  * vec4(aPos, 1.0);
}`, `
//Fragment Shader
precision mediump float;
uniform sampler2D uSampler;
uniform vec3 uLightPos;
varying vec2 fTexUV;
varying vec3 fNormal;
varying vec3 fPos;
void main(){
    vec3 lToNormal = normalize(uLightPos - fPos);
    vec4 textel = texture2D(uSampler, fTexUV);
    float lightLevel = 0.8 + max(dot(fNormal,lToNormal)/2.0, 0.0);
    gl_FragColor = vec4(textel.rgb * lightLevel, 1.0);
}`)
let uLightPos = gl.getUniformLocation(dShader, 'uLightPos')

gl.useProgram(dShader)

loadAll({
    dat: './cube.json'
}).then(t => {
    elements.push(new MeshRenderer(gl, {
        texture: t.tex,
        vertices: t.dat.vertices,
        indices: t.dat.indices,
        uvs: t.dat.uvs,
        normals: t.dat.normals,
        url: './textures/gold_block.png'
    }, dShader))

})

let i = 0
let vm = 0
let pm = 0


function frame(dt) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    vm = camera.updateViewMatrix()
    pm = camera.seePMatrix()
    elements.map(e => e.render(vm, pm))
    gl.uniform3fv(uLightPos, [Math.cos(i += 0.05) * 10, 10, Math.sin(i) * 10])
    requestAnimationFrame(frame)
}

frame()
onresize()

function CubeVerticesFromPos(x, y, z) {
    x *= 2, y *= 2, z *= 2
    return [
        -1 + x, +1 + y, -1 + z,
        -1 + x, +1 + y, +1 + z,
        +1 + x, +1 + y, +1 + z,
        +1 + x, +1 + y, -1 + z,
        -1 + x, +1 + y, +1 + z,
        -1 + x, -1 + y, +1 + z,
        -1 + x, -1 + y, -1 + z,
        -1 + x, +1 + y, -1 + z,
        +1 + x, +1 + y, +1 + z,
        +1 + x, -1 + y, +1 + z,
        +1 + x, -1 + y, -1 + z,
        +1 + x, +1 + y, -1 + z,
        +1 + x, +1 + y, +1 + z,
        +1 + x, -1 + y, +1 + z,
        -1 + x, -1 + y, +1 + z,
        -1 + x, +1 + y, +1 + z,
        +1 + x, +1 + y, -1 + z,
        +1 + x, -1 + y, -1 + z,
        -1 + x, -1 + y, -1 + z,
        -1 + x, +1 + y, -1 + z,
        -1 + x, -1 + y, -1 + z,
        -1 + x, -1 + y, +1 + z,
        +1 + x, -1 + y, +1 + z,
        +1 + x, -1 + y, -1 + z
    ]
}

function lineFromTo(f, t) {
    return [
        f.x * 2, f.y * 2, f.z * 2,
        t.x * 2, t.y * 2, t.z * 2
    ]
}

const cIndices = [
    0, 1, 2,
    0, 2, 3,
    5, 4, 6,
    6, 4, 7,
    8, 9, 10,
    8, 10, 11,
    13, 12, 14,
    15, 14, 12,
    16, 17, 18,
    16, 18, 19,
    21, 20, 22,
    22, 20, 23
]

let ran = 204
let root = new MergedGeo()
let nodes = []

range(100).map(_ => nodes.unshift(new SpatialNode(randBetw(-ran, ran), randBetw(-ran, ran), randBetw(-ran, ran))))
nodes.map(i => root.addNode(i))
root.root.connectToParent()

gl.canvas.onclick = a => {
    if (!mouseIsLocked)
        gl.canvas.requestPointerLock()
    else {
        let n = new SpatialNode(1+(camera.eye[0] / 2), camera.eye[1] / 2, camera.eye[2] / 2)
        root.root.add(n)
        n.connectToParent()
    }
}
