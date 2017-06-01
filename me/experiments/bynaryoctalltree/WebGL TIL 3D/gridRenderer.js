const GridManager = (function (fS, vS) {

    let gl, mProj, mView, mWorld, aPos, program;
    const grids = []

    class Grid {
        constructor() {
            if (!gl) return new Error('GridManager not initialized, Call GridManager.init(!WebGLRederingContext) first.')
            this.postition = [0, 0, 0]
            this.worldMatrix = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,])
            this.vertexBuffer = gl.createBuffer()
            this.update(50, 50)
            gl.vertexAttribPointer(aPos, 4, gl.FLOAT, false, 0, 0);
            grids.push(this)
        }
        render() {
            gl.uniformMatrix4fv(mWorld, false, this.worldMatrix)
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
            gl.vertexAttribPointer(aPos, 4, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.LINES, 0, this.vertexData.length / 4)
        }
        update(r = 1, s = r) {
            r++
            s++
            const vert = []
            for (let x of range(r)) {
                vert.push(0); vert.push(0);
                vert.push(x * s); vert.push(1);
                vert.push((r - 1) * s); vert.push(0);
                vert.push(x * s); vert.push(1);
                vert.push(x * s); vert.push(0)
                vert.push(0); vert.push(1);
                vert.push(x * s); vert.push(0);
                vert.push((r - 1) * s); vert.push(1)
            }
            this.vertexData = new Float32Array(vert)
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
            gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW)
        }
    }
    return {
        init(g) {
            gl = g
            program = createShaderProgram(gl, vS, fS)
            mProj = gl.getUniformLocation(program, 'mProj')
            mView = gl.getUniformLocation(program, 'mView')
            mWorld = gl.getUniformLocation(program, 'mWorld')
            aPos = gl.getAttribLocation(program, 'aPos')
        },
        getGrid(r) {
            return new Grid()
        },
        render(vm) {
            gl.useProgram(program)
            gl.uniformMatrix4fv(mView, false, vm)
            grids.map(i => i.render())
        },
        onResize(pm) {
            gl.useProgram(program)
            gl.uniformMatrix4fv(mProj, false, pm)
        }
    }
})(`
precision mediump float;
void main(){
	gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}`, `
precision mediump float;
uniform mat4 mProj;
uniform mat4 mView;
uniform mat4 mWorld;
attribute vec4 aPos;
void main(){
	gl_Position = mProj * mView * mWorld * aPos;
}`)

