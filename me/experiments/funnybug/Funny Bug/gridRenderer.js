/*class Grid {
    constructor(ctx) {
        this.ctx = ctx
        this.postition = [0, 0, 0]
        this.worldMatrix = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ])
        this.vertexBuffer = ctx.gl.createBuffer()
        this.updateGrid(10)
        ctx.gl.vertexAttribPointer(ctx.aPos, 4, ctx.gl.FLOAT, false, 0, 0)
        ctx.gl.bindBuffer(ctx.gl.ARRAY_BUFFER, null)
        ctx.quads.push(this)
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
    updateGrid(rows = 1) {
        let r = rows + 1
        let s = r
        const vert = []
        for (let x of range(r)) {
            vert.push(0)
            vert.push(0)
            vert.push(x * s)
            vert.push(1)
            vert.push((r - 1) * s)
            vert.push(0)
            vert.push(x * s)
            vert.push(1)
            vert.push(x * s)
            vert.push(0)
            vert.push(0)
            vert.push(1)
            vert.push(x * s)
            vert.push(0)
            vert.push((r - 1) * s)
            vert.push(1)
        }
        this.translate(-((r * s) / 2), this.postition[1], -((r * s) / 2))
        this.vertexData = new Float32Array(vert)
        this.ctx.gl.bindBuffer(this.ctx.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.ctx.gl.bufferData(this.ctx.gl.ARRAY_BUFFER, this.vertexData, this.ctx.gl.STATIC_DRAW);
    }
    render() {

        gl.disableVertexAttribArray(aTexUV)
        gl.disableVertexAttribArray(aNormal)
        this.ctx.gl.uniformMatrix4fv(this.mWorld, false, this.worldMatrix)
        this.ctx.gl.bindBuffer(this.ctx.gl.ARRAY_BUFFER, this.vertexBuffer)
        this.ctx.gl.vertexAttribPointer(this.ctx.aPos, 4, this.ctx.gl.FLOAT, false, 0, 0);
        this.ctx.gl.drawArrays(this.ctx.gl.LINES, 0, this.vertexData.length /4)
        gl.enableVertexAttribArray(aTexUV)
        gl.enableVertexAttribArray(aNormal)
    }
}

class GridMananger {
    constructor(gl) {
        this.gl = gl
        this.projMatrix = mat4.create()
        this.globalMatrix = mat4.create()
        this.viewMatrix = mat4.create()
        this.lookAt = vec3.create()
        this.eye = vec3.create()
        this.quads = []
        this.program = createShaderProgram(gl, `
precision mediump float;

uniform mat4 mProj;
uniform mat4 mView;
uniform mat4 mWorld;

attribute vec4 aPos;
void main(){
 	gl_Position = mProj * mView * mWorld * aPos;
}
        `, `
precision mediump float;
void main(){
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
        `)
        gl.useProgram(this.program)
        this.onResize()
        this.mProj = gl.getUniformLocation(this.program, 'mProj')
        this.mView = gl.getUniformLocation(this.program, 'mView')
        this.mWorld = gl.getUniformLocation(this.program, 'mWorld')
        this.aPos = gl.getAttribLocation(this.program, 'aPos');
        gl.enableVertexAttribArray(this.aPos);
    }
    getViewMatrix(viewMatrix) {
        this.gl.uniformMatrix4fv(this.mView, false,viewMatrix)
    }
    onResize() {
        let w = window.innerWidth
        let h = window.innerHeight
        mat4.perspective(this.projMatrix, glMatrix.toRadian(90), w / h, 0.30, 10000);
        this.gl.uniformMatrix4fv(this.mProj, false, this.projMatrix);
    }
    render(viewMatrix) {
        this.gl.useProgram(this.program)
        this.getViewMatrix(viewMatrix)
        this.quads.map(quad => quad.render())
    }
    createGrid() {
        return new Grid(this)
    }
}*/