const CubeRenderer = (function (vS, fS) {
    const quads = []
    let i = 0
    let u = 0, gl, mProj, program, uSampler1, mView, uMode, mWorld, uColor, aPos, aTexUV, textureAtlas, textureObject1, indexBuffer,indexData,vertexBuffer,vertexData;
    class Cube {
        constructor(x = 0, y = 0, z = 0, s = 1) {
            if (!gl) return new Error('CubeRenderer is not initialized. Call CubeRenderer.init(!WebGLRederingContext) first.')
            gl.useProgram(program)
            this.worldMatrix = new Float32Array([
                s, 0, 0, 0,
                0, s, 0, 0,
                0, 0, s, 0,
                x, y, z, 1,
            ])
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
            quads.push(this)
        }
        render() {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
            gl.vertexAttribPointer(aTexUV, 2, gl.FLOAT, false, 0, 0);
            gl.uniformMatrix4fv(mWorld, false, this.worldMatrix)
            gl.drawElements(gl.TRIANGLES, indexData.length, gl.UNSIGNED_SHORT, 0)
        }
    }
    return {
        init(g) {
            gl = g

            program = createShaderProgram(gl, vS, fS)
            gl.useProgram(program)

            mProj = gl.getUniformLocation(program, 'mProj')
            mView = gl.getUniformLocation(program, 'mView')
            mWorld = gl.getUniformLocation(program, 'mWorld')

            aPos = gl.getAttribLocation(program, 'aPos');
            aTexUV = gl.getAttribLocation(program, 'aTexUV');
            gl.enableVertexAttribArray(aPos);
            gl.enableVertexAttribArray(aTexUV);

            textureAtlas = new Image()
            textureObject1 = gl.createTexture()
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

            vertexBuffer = gl.createBuffer()
            vertexData = new Float32Array([
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
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

            indexBuffer = gl.createBuffer()
            indexData = new Uint16Array([
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
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);
        },
        render(vm) {
            gl.useProgram(program)
            gl.uniformMatrix4fv(mView, false, vm)
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.vertexAttribPointer(aPos, 4, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);            
            quads.map(quad => quad.render())
        },
        placeCube(x, y, z, s) {
            new Cube(x, y, z, s)
        },
        onResize(pm) {
            gl.useProgram(program)
            gl.uniformMatrix4fv(mProj, false, pm);
        }
    }
})(`
precision mediump float;
uniform mat4 mProj;
uniform mat4 mView;
uniform mat4 mWorld;
attribute vec2 aTexUV;
attribute vec4 aPos;
varying vec4 fColor;
varying vec2 fTexUV;
void main(){
    fTexUV = aTexUV;
	gl_Position = mProj * mView * mWorld * aPos;
}`, `
precision mediump float;
uniform sampler2D uSampler1;
varying vec2 fTexUV;
void main(){
        gl_FragColor = texture2D(uSampler1, fTexUV);
}`)
