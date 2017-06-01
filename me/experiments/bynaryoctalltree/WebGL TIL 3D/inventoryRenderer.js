const InventoryRenderer = (function (vS, fS) {
    let gl, cub, program, sunlightDirUniformLocation, sunlightIntUniformLocation, mProj, mView, mWorld, aPos, aNormal, aTexUV, textureObject1, textureAtlas, uSampler1, vertexBuffer, indexBuffer, normalBuffer, elements = []
    
    const projMatrix = mat4.create()
    const viewMatrix = mat4.create()
    const lookAt = vec3.fromValues(0, 0, 0)
    const eye = vec3.fromValues(0, 0, 0)

    let ort = 20
    let near = -500
    let far = 500

    const data = {
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
    class Cube {
        constructor(x = 0, y = 0, z = 0) {
            if (!gl) return new Error('InventoryManager not initialized, Call InventoryManager.init(!WebGLRederingContext) first.')
            this.worldMatrix = new Float32Array([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                x, y, z, 1,
            ])
            this.uvBuffer = gl.createBuffer()
            this.updateUVs(0, 0)
            mat4.rotateY(this.worldMatrix, this.worldMatrix, glMatrix.toRadian(45))
            elements.push(this)
        }
        updateUVs(u, v) {
            this.uvData = new Float32Array([
                (16 * (0 + u)) / 256, (16 * (0 + v)) / 256,
                (16 * (0 + u)) / 256, (16 * (1 + v)) / 256,
                (16 * (1 + u)) / 256, (16 * (1 + v)) / 256,
                (16 * (1 + u)) / 256, (16 * (0 + v)) / 256,
                (16 * (0 + u)) / 256, (16 * (0 + v)) / 256,
                (16 * (1 + u)) / 256, (16 * (0 + v)) / 256,
                (16 * (1 + u)) / 256, (16 * (1 + v)) / 256,
                (16 * (0 + u)) / 256, (16 * (1 + v)) / 256,
                (16 * (1 + u)) / 256, (16 * (1 + v)) / 256,
                (16 * (0 + u)) / 256, (16 * (1 + v)) / 256,
                (16 * (0 + u)) / 256, (16 * (0 + v)) / 256,
                (16 * (1 + u)) / 256, (16 * (0 + v)) / 256,
                (16 * (1 + u)) / 256, (16 * (1 + v)) / 256,
                (16 * (1 + u)) / 256, (16 * (0 + v)) / 256,
                (16 * (0 + u)) / 256, (16 * (0 + v)) / 256,
                (16 * (0 + u)) / 256, (16 * (1 + v)) / 256,
                (16 * (0 + u)) / 256, (16 * (0 + v)) / 256,
                (16 * (0 + u)) / 256, (16 * (1 + v)) / 256,
                (16 * (1 + u)) / 256, (16 * (1 + v)) / 256,
                (16 * (1 + u)) / 256, (16 * (0 + v)) / 256,
                (16 * (1 + u)) / 256, (16 * (1 + v)) / 256,
                (16 * (1 + u)) / 256, (16 * (0 + v)) / 256,
                (16 * (0 + u)) / 256, (16 * (0 + v)) / 256,
                (16 * (0 + u)) / 256, (16 * (1 + v)) / 256,
            ])
            gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer)
            gl.bufferData(gl.ARRAY_BUFFER, this.uvData, gl.STATIC_DRAW)
            gl.vertexAttribPointer(aTexUV, 2, gl.FLOAT, false, 0, 0)
        }
        render() {
            gl.uniformMatrix4fv(mWorld, false, this.worldMatrix)
            gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer)
            gl.vertexAttribPointer(aTexUV, 2, gl.FLOAT, false, 0, 0)
            gl.drawElements(gl.TRIANGLES, data.index.length, gl.UNSIGNED_SHORT, 0)
        }
    }
    return {
        init(g) {
            gl = g
            program = createShaderProgram(gl, vS, fS)
            gl.useProgram(program)
            sunlightDirUniformLocation = gl.getUniformLocation(program, 'sun.direction')
            sunlightIntUniformLocation = gl.getUniformLocation(program, 'sun.color')
            gl.uniform3f(sunlightDirUniformLocation, 3.0, 4.0, -2.0)
            gl.uniform3f(sunlightIntUniformLocation, 1, 1, 1)

            mProj = gl.getUniformLocation(program, 'mProj')
            mView = gl.getUniformLocation(program, 'mView')
            mWorld = gl.getUniformLocation(program, 'mWorld')

            aPos = gl.getAttribLocation(program, 'aPos')
            aNormal = gl.getAttribLocation(program, 'aNormal')
            aTexUV = gl.getAttribLocation(program, 'aTexUV')

            gl.enableVertexAttribArray(aNormal)
            gl.enableVertexAttribArray(aPos)
            gl.enableVertexAttribArray(aTexUV)

            textureObject1 = gl.createTexture()
            textureAtlas = new Image()
            gl.bindTexture(gl.TEXTURE_2D, textureObject1)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]))
            textureAtlas.onload = () => gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureAtlas)
            textureAtlas.src = './textures/textureAtlases.png'

            uSampler1 = gl.getUniformLocation(program, 'uSampler1')
            gl.activeTexture(gl.TEXTURE0)
            gl.bindTexture(gl.TEXTURE_2D, textureObject1)
            gl.uniform1i(uSampler1, 0)

            normalBuffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
            gl.bufferData(gl.ARRAY_BUFFER, data.normals, gl.STATIC_DRAW)
            vertexBuffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
            gl.bufferData(gl.ARRAY_BUFFER, data.vertices, gl.STATIC_DRAW)
            indexBuffer = gl.createBuffer()
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data.index, gl.STATIC_DRAW)

            cub = new Cube(0, 0, 0)
            this.updateViewMatrix()
            this.onResize()
        }, updateViewMatrix() {
            vec3.add(lookAt, eye, [-1, -Math.cos(glMatrix.toRadian(45)), 0])
            mat4.lookAt(viewMatrix, eye, lookAt, [0, 1, 0])
            gl.uniformMatrix4fv(mView, false, viewMatrix)
        }, onResize() {
            gl.useProgram(program)
            let w = window.innerWidth
            let h = window.innerHeight
            mat4.ortho(projMatrix, (-1 * (w / 2)) / ort, (1 * (w / 2)) / ort, (-1 * (h / 2)) / ort, (1 * (h / 2)) / ort, near, far)
            gl.uniformMatrix4fv(mProj, false, projMatrix)
        }, onMouseMove(e) {
            if (cub) {
                cub.worldMatrix[14] = -(e.x - gl.canvas.width / 2) / ort
                cub.worldMatrix[13] = -(e.y - gl.canvas.height / 2) / ort * 1.2
            }
        }, render() {
            gl.useProgram(program)
            gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
            gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0)
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
            gl.vertexAttribPointer(aPos, 4, gl.FLOAT, false, 0, 0)
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
            elements.map(quad => quad.render())
        }, getCube(x, y, z) {
            return new Cube(x, y, z)
        }
    }


})(`
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
}`, `
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
}`)


