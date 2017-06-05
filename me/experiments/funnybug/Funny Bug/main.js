var mouseIsLocked = false;
var speed = 0.1;
var keyU = false;
var placeDist = 10;
var i = 0;
var u = 0;
//Main objects
var mouse = { x: 0, y: 0 }
var KeyListener = new KeySet()
var projMatrix = mat4.create()
var globalMatrix = mat4.create()
var viewMatrix = mat4.create()
var lookAt = vec3.create()
var eye = vec3.create()
var quads = []
//Camera 
var cam = {
    runF: false,
    runB: false,
    runL: false,
    runR: false,
    runU: false,
    runD: false,
}
//GL Object
var gl = getGL(600, 600, { autoAppend: 1 })
gl.viewport(4, 0, 600, 600)
gl.clearColor(0, 0, 0, 1.0)
gl.clear(gl.COLOR_BUFFER_BIT)
gl.enable(gl.DEPTH_TEST)
gl.enable(gl.CULL_FACE)
//Shader Program
var program = createShaderProgram(gl, vShader, fShader)
gl.useProgram(program)
//Structs

const sunlightDirUniformLocation = gl.getUniformLocation(program, 'sun.direction');
const sunlightIntUniformLocation = gl.getUniformLocation(program, 'sun.color');
gl.uniform3f(sunlightDirUniformLocation, 3.0, 4.0, -2.0);
gl.uniform3f(sunlightIntUniformLocation, 1, 1, 1);
//Uniforms
var mProj = gl.getUniformLocation(program, 'mProj')
var mView = gl.getUniformLocation(program, 'mView')
var uMode = gl.getUniformLocation(program, 'uMode')
var scale = gl.getUniformLocation(program, 'mScale')
var mWorld = gl.getUniformLocation(program, 'mWorld')
var mGlobal = gl.getUniformLocation(program, 'mGlobal')
var uColor = gl.getUniformLocation(program, 'uColor')
var uEyePos = gl.getUniformLocation(program, 'uEyePos')
gl.uniform1i(uMode, 1)
gl.uniform4f(uColor, 0, 1, 0, 1)
gl.uniformMatrix4fv(mProj, false, projMatrix)
gl.uniformMatrix4fv(mView, false, viewMatrix)
gl.uniformMatrix4fv(mGlobal, false, globalMatrix)
//Attributes
var aPos = gl.getAttribLocation(program, 'aPos');
var aNormal = gl.getAttribLocation(program, 'aNormal');
var aTexUV = gl.getAttribLocation(program, 'aTexUV');
gl.enableVertexAttribArray(aNormal);
gl.enableVertexAttribArray(aPos);
gl.enableVertexAttribArray(aTexUV);
//Quad Element
class Quad {
    constructor(x = 0, y = 0, z = 0, s = 1) {
        this.vertexBuffer = gl.createBuffer()
        this.vertexData = new Float32Array([
            -1, +1, -1, 1,
            -1, +1, +1, 1,
        ])
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW);
        this.uvBuffer = gl.createBuffer()
        this.uvData = new Float32Array([
        ])
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.uvData, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.vertexAttribPointer(aTexUV, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(aPos, 4, gl.FLOAT, false, 0, 0);
    }
    render() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.vertexAttribPointer(aTexUV, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(aPos, 4, gl.FLOAT, false, 0, 0);
        gl.uniformMatrix4fv(mWorld, false, this.worldMatrix)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
        gl.drawElements(gl.TRIANGLES, this.indexData.length, gl.UNSIGNED_SHORT, 0)
    }
}
//Cube Element
class Cubes {
    constructor(x = 0, y = 0, z = 0, s = 1) {
        gl.useProgram(program)
        this.scaleMatrix = new Float32Array([
            s, 0, 0, 0,
            0, s, 0, 0,
            0, 0, s, 0,
            0, 0, 0, 1,
        ])
        this.worldMatrix = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1,
        ])
        this.vertexBuffer = gl.createBuffer()
        this.normalBuffer = gl.createBuffer()
        this.normalData = new Float32Array([
            //Top
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            //Left
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            //Right
            +1, 0, 0,
            +1, 0, 0,
            +1, 0, 0,
            +1, 0, 0,
            //Front
            0, 0, +1,
            0, 0, +1,
            0, 0, +1,
            0, 0, +1,
            //Back 
            0, +0, -1,
            0, -0, -1,
            0, -0, -1,
            0, +0, -1,
            //Bottom
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
        ])
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.normalData, gl.STATIC_DRAW);
        this.vertexData = new Float32Array([
            -1, +1, -1, 1,
            -1, +1, +1, 1,
            +1, +1, +1, 1,
            +1, +1, -1, 1,
            -1, +1, +1, 1,
            -1, -1, +1, 1,
            -1, -1, -1, 1,
            -1, +1, -1, 1,
            +1, +1, +1, 1,
            +1, -1, +1, 1,
            +1, -1, -1, 1,
            +1, +1, -1, 1,
            +1, +1, +1, 1,
            +1, -1, +1, 1,
            -1, -1, +1, 1,
            -1, +1, +1, 1,
            +1, +1, -1, 1,
            +1, -1, -1, 1,
            -1, -1, -1, 1,
            -1, +1, -1, 1,
            -1, -1, -1, 1,
            -1, -1, +1, 1,
            +1, -1, +1, 1,
            +1, -1, -1, 1,
        ])
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW);
        this.indexBuffer = gl.createBuffer()
        this.indexData = new Uint16Array([
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
        ])
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indexData, gl.STATIC_DRAW);
        this.uvBuffer = gl.createBuffer()
        this.uvData = new Float32Array([
            (16 * (0 + i)) / 256, (16 * (0 + u)) / 256,
            (16 * (0 + i)) / 256, (16 * (1 + u)) / 256,
            (16 * (1 + i)) / 256, (16 * (1 + u)) / 256,
            (16 * (1 + i)) / 256, (16 * (0 + u)) / 256,
            (16 * (0 + i)) / 256, (16 * (0 + u)) / 256,
            (16 * (1 + i)) / 256, (16 * (0 + u)) / 256,
            (16 * (1 + i)) / 256, (16 * (1 + u)) / 256,
            (16 * (0 + i)) / 256, (16 * (1 + u)) / 256,
            (16 * (1 + i)) / 256, (16 * (1 + u)) / 256,
            (16 * (0 + i)) / 256, (16 * (1 + u)) / 256,
            (16 * (0 + i)) / 256, (16 * (0 + u)) / 256,
            (16 * (1 + i)) / 256, (16 * (0 + u)) / 256,
            (16 * (1 + i)) / 256, (16 * (1 + u)) / 256,
            (16 * (1 + i)) / 256, (16 * (0 + u)) / 256,
            (16 * (0 + i)) / 256, (16 * (0 + u)) / 256,
            (16 * (0 + i)) / 256, (16 * (1 + u)) / 256,
            (16 * (0 + i)) / 256, (16 * (0 + u)) / 256,
            (16 * (0 + i)) / 256, (16 * (1 + u)) / 256,
            (16 * (1 + i)) / 256, (16 * (1 + u)) / 256,
            (16 * (1 + i)) / 256, (16 * (0 + u)) / 256,
            (16 * (1 + i)) / 256, (16 * (1 + u)) / 256,
            (16 * (1 + i)) / 256, (16 * (0 + u)) / 256,
            (16 * (0 + i)) / 256, (16 * (0 + u)) / 256,
            (16 * (0 + i)) / 256, (16 * (1 + u)) / 256,
        ])
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.uvData, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.vertexAttribPointer(aTexUV, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(aPos, 4, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(scale, false, this.scaleMatrix)
        quads.push(this)
    }
    render() {
        gl.useProgram(program)
        
   //     mat4.rotateY(this.worldMatrix, this.worldMatrix, 0.01)
   //     mat4.rotateZ(this.worldMatrix, this.worldMatrix, -0.007)
   //     mat4.rotateX(this.worldMatrix, this.worldMatrix, 0.02)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.vertexAttribPointer(aTexUV, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(aPos, 4, gl.FLOAT, false, 0, 0);
        gl.uniformMatrix4fv(mWorld, false, this.worldMatrix)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
        gl.drawElements(gl.TRIANGLES, this.indexData.length, gl.UNSIGNED_SHORT, 0)
    }
}
//Grid Element

class Grid {
    constructor(x = 0, y = 0, z = 0, s = 1, r = 10, s2 = 1) {
        this.program = createShaderProgram(gl, vShader2, fShader2)
        gl.useProgram(this.program)
        this.postition = [x, y, z]
        this.scaleMatrix = new Float32Array([
            s, 0, 0, 0,
            0, s, 0, 0,
            0, 0, s, 0,
            0, 0, 0, 1,
        ])
        this.worldMatrix = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1,
        ])
        this.vertexBuffer = gl.createBuffer()
        this.updateGrid(r, s2)
        
        this.mProj = gl.getUniformLocation(this.program, 'mProj')
        this.mView = gl.getUniformLocation(this.program, 'mView')
        this.mWorld = gl.getUniformLocation(this.program, 'mWorld')
        
        this.aPos = gl.getAttribLocation(this.program, 'aPos')
        gl.vertexAttribPointer(aPos, 4, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
        quads.push(this)
    }
    translate(x = 1, y = 1, z = 1) {
        this.worldMatrix = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1
        ])
        this.postition = [x, y, z]
    }
    updateGrid(r = 1, s = 1) {
        r = r + 1
        const vert = []
        for (let x of range(r)) {
            //Line 1 
            vert.push(0)                    //x
            vert.push(Math.sin(x * s) * 20) //y
            vert.push(x * s)                //z
            vert.push(1)                    //w
            //Line 2 
            vert.push((r - 1) * s)          //x
            vert.push(Math.sin(x * s) * 20) //y
            vert.push(x * s)                //z
            vert.push(1)                    //w
            //Line 3
            vert.push(x * s)                //x
            vert.push(Math.sin(x * s) * 20) //y
            vert.push(0)                    //z
            vert.push(1)                    //w
            //Line 4
            vert.push(x * s)                //x
            vert.push(Math.sin(x * s) * 20) //y
            vert.push((r - 1) * s)          //z
            vert.push(1)                    //w
        }
        this.translate(-((r * s) / 2), this.postition[1], -((r * s) / 2))
        this.vertexData = new Float32Array(vert)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW);
    }
    render() {
        gl.useProgram(this.program)
        gl.uniformMatrix4fv(this.mView, false, viewMatrix)
        gl.uniformMatrix4fv(this.mProj, false, projMatrix)
        gl.uniformMatrix4fv(this.mWorld, false, this.worldMatrix)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
        gl.vertexAttribPointer(this.aPos, 4, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.LINES, 0, this.vertexData.length / 4)
    }
}
//Hitbox Element
class HitBox extends Cubes {
    constructor(x = 0, y = 0, z = 0, s = 1) {
        super(x = 0, y = 0, z = 0, s = 1)
    }
    render() {
        gl.useProgram(program)
        this.worldMatrix[12] = (eye[0] + Math.sin(mouse.y / 30) * Math.cos(mouse.x / 30) * placeDist)
        this.worldMatrix[13] = (eye[1] - Math.cos(mouse.y / 30) * placeDist)
        this.worldMatrix[14] = (eye[2] + Math.sin(mouse.y / 30) * Math.sin(mouse.x / 30) * placeDist)
        gl.uniform3f(uEyePos, this.worldMatrix[12], this.worldMatrix[13], this.worldMatrix[14])
        gl.uniform4f(uColor, 1, 0, 0, 1)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.vertexAttribPointer(aTexUV, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(aPos, 4, gl.FLOAT, false, 0, 0);
        gl.uniformMatrix4fv(mWorld, false, this.worldMatrix)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
        gl.uniform1i(uMode, 0)
        gl.drawElements(gl.POINTS, this.indexData.length, gl.UNSIGNED_SHORT, 0)
        gl.uniform1i(uMode, 1)
    }
}
//Textures
const textureObject1 = gl.createTexture()
const textureFile1 = new Image()
textureFile1.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, textureObject1)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureFile1)
}
textureFile1.src = './textures/textureAtlases.png'
const uSampler1 = gl.getUniformLocation(program, 'uSampler1')
gl.activeTexture(gl.TEXTURE0)
gl.bindTexture(gl.TEXTURE_2D, textureObject1);
gl.uniform1i(uSampler1, 0)
//View Matrix

let camR = vec3.create()
let forward = vec3.create()

function updateViewMatrix() {
    //gl.useProgram(program)
    mouse.y < -93.33 ? mouse.y = -93.33 : null
    mouse.y > -0.5 ? mouse.y = -0.5 : null
    forward[0] = +Math.sin(mouse.y / 30) * Math.cos(mouse.x / 30)
    forward[1] =-Math.cos(mouse.y / 30);
    forward[2] = +Math.sin(mouse.y / 30) * Math.sin(mouse.x / 30)  
    vec3.add(lookAt, eye, forward)
    mat4.lookAt(viewMatrix, eye, lookAt, [0, 1, 0]);
    gl.uniformMatrix4fv(mView, false, viewMatrix)
}
//Update Eye Pos
function updateMovement() {
    if (cam.runF) {
        eye[0] -= +Math.cos(mouse.x / 30) * speed
        //   eye[1] += -Math.cos(mouse.y / 30) * speed
        eye[2] -= +Math.sin(mouse.x / 30) * speed
    }
    if (cam.runB) {
        eye[0] += +Math.cos(mouse.x / 30) * speed
        //   eye[1] -= -Math.cos(mouse.y / 30) * speed
        eye[2] += +Math.sin(mouse.x / 30) * speed
    }
    if (cam.runL) {
        camR[0] = Math.cos(mouse.x / 30) * speed
        camR[2] = Math.sin(mouse.x / 30) * speed
        vec3.rotateY(camR, camR, [0, 1, 0], 90 * Math.PI / 180)
        eye[0] -= camR[0]
        eye[2] -= camR[2]
    }
    if (cam.runR) {
        camR[0] = Math.cos(mouse.x / 30) * speed
        camR[2] = Math.sin(mouse.x / 30) * speed
        vec3.rotateY(camR, camR, [0, 1, 0], 90 * Math.PI / 180)
        eye[0] += camR[0]
        eye[2] += camR[2]
    }
    if (cam.runU) {
        eye[1] += 1 * speed
    }
    if (cam.runD) {
        eye[1] -= 1 * speed
    }
}
//Keyboard Handler
const KeyMap = {
    up: 'Space',
    down: 'ShiftLeft',
    left: 'KeyA',
    right: 'KeyD',
    front: 'KeyW',
    back: 'KeyS',
    inventory: 'KeyE',
    whe: 'KeyT',
    who: 'KeyY',
}
const KeyGroup = {
    up: {
        press() { cam.runU = true },
        release() { cam.runU = false }
    },
    down: {
        press() { cam.runD = true },
        release() { cam.runD = false }
    },
    left: {
        press() { cam.runL = true },
        release() { cam.runL = false }
    },
    right: {
        press() { cam.runR = true },
        release() { cam.runR = false }
    },
    front: {
        press() { cam.runF = true },
        release() { cam.runF = false }
    },
    back: {
        press() { cam.runB = true },
        release() { cam.runB = false }
    },
    inventory: {
        press() {
            keyU = true
        },
        release() {
            keyU = false
        }
    },
    whe: {
        press() {
            placeDist++
        }
    },
    who: {
        press() {
            placeDist--
        }
    }

}
KeyListener.bindGroupToMap(KeyMap, KeyGroup, true)
//On Click Handler
gl.canvas.onclick = a => {
    if (mouseIsLocked) {
        console.log('Place Bloc')
        new Cubes(
            eye[0] + Math.sin(mouse.y / 30) * Math.cos(mouse.x / 30) * placeDist,
            eye[1] - Math.cos(mouse.y / 30) * placeDist,
            eye[2] + Math.sin(mouse.y / 30) * Math.sin(mouse.x / 30) * placeDist
        )
    } else {
        gl.canvas.requestPointerLock()
    }
}
//LockChange Handler
lockChangeAlert = e => {
    if (document.pointerLockElement === gl.canvas) {
        mouseIsLocked = true
    } else {
        mouseIsLocked = false
    }
}
document.addEventListener('pointerlockchange', lockChangeAlert, false);
//Mousemove Handler
onmousemove = e => {
    if (mouseIsLocked) {
        mouse.x += e.movementX / 10
        mouse.y += e.movementY / 10
    }else{
        inv.onmousemove(e)        
    }
}
let ort = 30
let fov = 90
let drawMode = 1
//Onresize Handler
onresize = e => {
    let w = window.innerWidth
    let h = window.innerHeight
    gl.canvas.width = w
    gl.canvas.height = h
    gl.viewport(0, 0, w, h)
    if (drawMode) {
        mat4.perspective(projMatrix, glMatrix.toRadian(fov), w / h, 0.30, 10000);
    } else {
        mat4.ortho(projMatrix, (-1 * (w / 2)) / ort, (1 * (w / 2)) / ort, (-1 * (h / 2)) / ort, (1 * (h / 2)) / ort, 0.02, 1000)
    }
    gl.uniformMatrix4fv(mProj, false, projMatrix);
}
//Onwheel Handler
onwheel = e => {
    if (keyU) {
        console.log(`X:${i++}`)
    } else {
        console.log(`Y:${u++}`)
    }
    inv.cub.updateUVs(i,u)
}
//Animation Frame Handler 


let inv = new InventoryManager(gl, './textures/textureAtlases.png', vShader, fShader)

gl.useProgram(program)

function frame() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    updateMovement()
    updateViewMatrix()
    quads.map(quad => quad.render())
    inv.render()
    requestAnimationFrame(frame)
}

//Init
onresize()
frame()
gl.useProgram(program)

const viewer = new HitBox(1, 2, 3, 1)
const grid1 = new Grid(0, 0, 0, 1, 500, 16)
