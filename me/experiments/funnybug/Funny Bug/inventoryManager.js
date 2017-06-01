class Cube {
    constructor(x = 0, y = 0, z = 0, ctx) {
        this.ctx = ctx
        this.worldMatrix = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1,
        ])

        this.u = 0
        this.v = 0
        this.uvBuffer = gl.createBuffer()
        this.updateUVs(0, 0)
        mat4.rotateY(this.worldMatrix, this.worldMatrix, glMatrix.toRadian(45))
        ctx.elements.push(this)

    }
    updateUVs(u, v) {
        this.u = u
        this.v = v
        this.uvData = new Float32Array([
            (16 * (0 + this.u)) / 256, (16 * (0 + this.v)) / 256,
            (16 * (0 + this.u)) / 256, (16 * (1 + this.v)) / 256,
            (16 * (1 + this.u)) / 256, (16 * (1 + this.v)) / 256,
            (16 * (1 + this.u)) / 256, (16 * (0 + this.v)) / 256,
            (16 * (0 + this.u)) / 256, (16 * (0 + this.v)) / 256,
            (16 * (1 + this.u)) / 256, (16 * (0 + this.v)) / 256,
            (16 * (1 + this.u)) / 256, (16 * (1 + this.v)) / 256,
            (16 * (0 + this.u)) / 256, (16 * (1 + this.v)) / 256,
            (16 * (1 + this.u)) / 256, (16 * (1 + this.v)) / 256,
            (16 * (0 + this.u)) / 256, (16 * (1 + this.v)) / 256,
            (16 * (0 + this.u)) / 256, (16 * (0 + this.v)) / 256,
            (16 * (1 + this.u)) / 256, (16 * (0 + this.v)) / 256,
            (16 * (1 + this.u)) / 256, (16 * (1 + this.v)) / 256,
            (16 * (1 + this.u)) / 256, (16 * (0 + this.v)) / 256,
            (16 * (0 + this.u)) / 256, (16 * (0 + this.v)) / 256,
            (16 * (0 + this.u)) / 256, (16 * (1 + this.v)) / 256,
            (16 * (0 + this.u)) / 256, (16 * (0 + this.v)) / 256,
            (16 * (0 + this.u)) / 256, (16 * (1 + this.v)) / 256,
            (16 * (1 + this.u)) / 256, (16 * (1 + this.v)) / 256,
            (16 * (1 + this.u)) / 256, (16 * (0 + this.v)) / 256,
            (16 * (1 + this.u)) / 256, (16 * (1 + this.v)) / 256,
            (16 * (1 + this.u)) / 256, (16 * (0 + this.v)) / 256,
            (16 * (0 + this.u)) / 256, (16 * (0 + this.v)) / 256,
            (16 * (0 + this.u)) / 256, (16 * (1 + this.v)) / 256,
        ])
        gl.bindBuffer(this.ctx.gl.ARRAY_BUFFER, this.uvBuffer)
        gl.bufferData(this.ctx.gl.ARRAY_BUFFER, this.uvData, this.ctx.gl.STATIC_DRAW)
        gl.vertexAttribPointer(this.ctx.aTexUV, 2, this.ctx.gl.FLOAT, false, 0, 0)
    }
    render() {
        mat4.rotateY(this.worldMatrix, this.worldMatrix, glMatrix.toRadian(1))        
        this.ctx.gl.uniformMatrix4fv(this.ctx.mWorld, false, this.worldMatrix)
        this.ctx.gl.bindBuffer(this.ctx.gl.ARRAY_BUFFER, this.uvBuffer)
        this.ctx.gl.vertexAttribPointer(this.ctx.aTexUV, 2, this.ctx.gl.FLOAT, false, 0, 0)
        this.ctx.gl.drawElements(this.ctx.gl.TRIANGLES, this.ctx.data.index.length, this.ctx.gl.UNSIGNED_SHORT, 0)
    }
}

class InventoryManager {
    constructor(gl, url) {
        this.gl = gl
        this.projMatrix = mat4.create()
        this.viewMatrix = mat4.create()
        this.lookAt = vec3.fromValues(0, 0, 0)
        this.eye = vec3.fromValues(0, 0, 0)
        this.elements = []
        this.ort = 20
        this.near = -500
        this.far = 500
        this.vShader = `
precision mediump float;

uniform mat4 mProj;
uniform mat4 mView;
uniform mat4 mWorld;

attribute vec2 aTexUV;
attribute vec4 aPos;
attribute vec3 aNormal;

varying vec3 fNormal;
varying vec2 fTexUV;

void main(){
    fTexUV = aTexUV;
    gl_PointSize = 4.0;
    fNormal = vec3(mWorld * vec4(aNormal, 0.0)).xyz;
	gl_Position = mProj * mView * mWorld * aPos;
}`
        this.fShader = `
precision mediump float;

struct DirectionalLight
{
	vec3 direction;
	vec3 color;
};

uniform sampler2D uSampler1;
uniform DirectionalLight sun;

vec3 ambientLightIntensity = vec3(0.5, 0.5, 0.5);

varying vec2 fTexUV;
varying vec3 fNormal;

void main(){
	vec3 surfaceNormal = normalize(fNormal);
	vec3 normSunDir = normalize(sun.direction);
	vec4 texel = texture2D(uSampler1, fTexUV);

	vec3 lightIntensity = ambientLightIntensity + sun.color * max(dot(fNormal, normSunDir), 0.0);
	gl_FragColor = vec4(texel.rgb * lightIntensity, texel.a);
}`
        this.program = createShaderProgram(gl, this.vShader, this.fShader)
        gl.useProgram(this.program)

        this.sunlightDirUniformLocation = gl.getUniformLocation(this.program, 'sun.direction')
        this.sunlightIntUniformLocation = gl.getUniformLocation(this.program, 'sun.color')
        gl.uniform3f(this.sunlightDirUniformLocation, 3.0, 4.0, -2.0)
        gl.uniform3f(this.sunlightIntUniformLocation, 1, 1, 1)

        this.mProj = gl.getUniformLocation(this.program, 'mProj')
        this.mView = gl.getUniformLocation(this.program, 'mView')
        this.mWorld = gl.getUniformLocation(this.program, 'mWorld')
        gl.uniformMatrix4fv(this.mProj, false, this.projMatrix)
        gl.uniformMatrix4fv(this.mView, false, this.viewMatrix)

        this.aPos = gl.getAttribLocation(this.program, 'aPos')
        this.aNormal = gl.getAttribLocation(this.program, 'aNormal')
        this.aTexUV = gl.getAttribLocation(this.program, 'aTexUV')
        gl.enableVertexAttribArray(this.aNormal)
        gl.enableVertexAttribArray(this.aPos)
        gl.enableVertexAttribArray(this.aTexUV)

        this.textureObject1 = gl.createTexture()
        this.textureFile1 = new Image()
        gl.bindTexture(gl.TEXTURE_2D, this.textureObject1)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 0, 0, 255]))
        this.textureFile1.onload = () => gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.textureFile1)

        this.textureFile1.src = url
        this.uSampler1 = gl.getUniformLocation(this.program, 'uSampler1')
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, this.textureObject1)
        gl.uniform1i(this.uSampler1, 0)

        this.data = {
            normals: new Float32Array([
                0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
                -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
                +1, 0, 0, +1, 0, 0, +1, 0, 0, +1, 0, 0,
                0, 0, +1, 0, 0, +1, 0, 0, +1, 0, 0, +1,
                0, +0, -1, 0, -0, -1, 0, -0, -1, 0, +0, -1,
                0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
            ]),
            vertices: new Float32Array([
                -1, +1, -1, 1, -1, +1, +1, 1, +1, +1, +1, 1, +1, +1, -1, 1,
                -1, +1, +1, 1, -1, -1, +1, 1, -1, -1, -1, 1, -1, +1, -1, 1,
                +1, +1, +1, 1, +1, -1, +1, 1, +1, -1, -1, 1, +1, +1, -1, 1,
                +1, +1, +1, 1, +1, -1, +1, 1, -1, -1, +1, 1, -1, +1, +1, 1,
                +1, +1, -1, 1, +1, -1, -1, 1, -1, -1, -1, 1, -1, +1, -1, 1,
                -1, -1, -1, 1, -1, -1, +1, 1, +1, -1, +1, 1, +1, -1, -1, 1,
            ]),
            index: new Uint16Array([
                0, 1, 2, 0, 2, 3, 5, 4, 6,
                6, 4, 7, 8, 9, 10, 8, 10, 11,
                13, 12, 14, 15, 14, 12, 16, 17, 18,
                16, 18, 19, 21, 20, 22, 22, 20, 23
            ])
        }

        this.normalBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, this.data.normals, gl.STATIC_DRAW)
        this.vertexBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, this.data.vertices, gl.STATIC_DRAW)
        this.indexBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.data.index, gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

        this.cub = new Cube(0, 0, 0, this)

        this.updateViewMatrix()
        this.onresize()
    }
    updateViewMatrix() {
        vec3.add(this.lookAt, this.eye, [-1, -Math.cos(glMatrix.toRadian(45)), 0])
        mat4.lookAt(this.viewMatrix, this.eye, this.lookAt, [0, 1, 0])
        gl.uniformMatrix4fv(this.mView, false, this.viewMatrix)
    }
    render() {
        this.gl.useProgram(this.program)
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer)
        this.gl.vertexAttribPointer(this.aNormal, 3, this.gl.FLOAT, false, 0, 0)
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
        this.gl.vertexAttribPointer(this.aPos, 4, this.gl.FLOAT, false, 0, 0)
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
        this.elements.map(quad => quad.render())
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
    }
    onresize() {
        let w = window.innerWidth
        let h = window.innerHeight
        mat4.ortho(this.projMatrix, (-1 * (w / 2)) / this.ort, (1 * (w / 2)) / this.ort, (-1 * (h / 2)) / this.ort, (1 * (h / 2)) / this.ort, this.near, this.far)
        gl.uniformMatrix4fv(this.mProj, false, this.projMatrix)
    }
    onmousemove(e) {
        this.cub.worldMatrix[14] = -(e.x - this.gl.canvas.width / 2) / this.ort
        this.cub.worldMatrix[13] = -(e.y - this.gl.canvas.height / 2) / this.ort * 1.2
    }
    addCube() {
        new Cube(x, y, z, this)
    }
}
