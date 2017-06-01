/*class Grid {
    constructor(x = 0, y = 0, z = 0, s = 1, r = 10, s2 = 1) {
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
        gl.vertexAttribPointer(aPos, 4, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
        quads.push(this)
        gl.uniformMatrix4fv(scale, false, this.scaleMatrix)
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
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW);
    }
    render() {
        gl.uniform4f(uColor, 1, 0.5, 0, 1)
        gl.disableVertexAttribArray(aTexUV)
        gl.disableVertexAttribArray(aNormal)
        gl.uniformMatrix4fv(mWorld, false, this.worldMatrix)
        gl.uniform1i(uMode, 0)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
        gl.vertexAttribPointer(aPos, 4, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.LINES, 0, this.vertexData.length / 4)
        gl.uniform1i(uMode, 1)
        gl.enableVertexAttribArray(aTexUV)
        gl.enableVertexAttribArray(aNormal)
    }
}*/