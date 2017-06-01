
class MeshRenderer {
    constructor(gl, data = {}, vS = "", fS = "") {

        if (vS instanceof WebGLProgram)
            this.program = vS

        this.gl = gl

        this.mode = data.mode || 'TRIANGLES'

        this.worldMatrix = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            data.x || 0, data.y || 0, data.z || 0, 1,
        ])

        this.texUnit = data.textureUnit || 0

        this.uProj = gl.getUniformLocation(this.program, 'uProj')
        this.uView = gl.getUniformLocation(this.program, 'uView')
        this.uWorld = gl.getUniformLocation(this.program, 'uWorld')
        this.uSampler = gl.getUniformLocation(this.program, 'uSampler')

        this.aPos = gl.getAttribLocation(this.program, 'aPos');
        this.aTexUV = gl.getAttribLocation(this.program, 'aTexUV');

        this.glTexture = gl.createTexture()
        this.indexBuffer = gl.createBuffer()
        this.vertexBuffer = gl.createBuffer()
        this.uvBuffer = gl.createBuffer()

        this.textureBlob;
        this.indexData = new Uint16Array(data.indices)
        this.vertexData = new Float32Array(data.vertices)
        this.uvData = new Float32Array(data.uvs)

        gl.useProgram(this.program)
        if (this.useIndex = !!this.indexData.length) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indexData, gl.STATIC_DRAW);
        } else
            console.error('No index data supplyed.')

        if (this.useUVs = !!this.uvData.length) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.uvData, gl.STATIC_DRAW);
            gl.enableVertexAttribArray(this.aTexUV);
        }

        if (this.hasVertices = !!this.vertexData.length) {
            this.length = this.vertexData.length / 3
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW);
            gl.enableVertexAttribArray(this.aPos);
        } else
            console.error('No vertex data supplyed.')

        this.color = new Uint8Array([Math.random() * 255, Math.random() * 255, Math.random() * 255, 255])
        this.glTexture = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, this.glTexture)
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.color)
        if (!!data.url) {
            this.textureBlob = new Image()
            this.textureBlob.onload = () => {
                gl.bindTexture(gl.TEXTURE_2D, this.glTexture)
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.textureBlob)
                gl.generateMipmap(gl.TEXTURE_2D)
                gl.bindTexture(gl.TEXTURE_2D, null)
            }
            this.textureBlob.src = data.url
        }

        gl.bindTexture(gl.TEXTURE_2D, null)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
    }
    setTexture(src) {
        this.textureBlob = src
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src)
    }
    render(vm, pm) {
        if (this.hasVertices === true) {
            gl.useProgram(this.program)

            gl.uniformMatrix4fv(this.uWorld, false, this.worldMatrix)
            gl.uniformMatrix4fv(this.uView, false, vm)
            gl.uniformMatrix4fv(this.uProj, false, pm)

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.vertexAttribPointer(this.aPos, 3, gl.FLOAT, false, 0, 0);
            if (this.useUVs === true) {
                gl.activeTexture(gl[`TEXTURE${this.texUnit}`])
                gl.bindTexture(gl.TEXTURE_2D, this.glTexture)
                gl.uniform1i(this.uSampler, this.texUnit)
                gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
                gl.vertexAttribPointer(this.aTexUV, 2, gl.FLOAT, false, 0, 0);
            }
            if (this.useIndex === true) {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                gl.drawElements(gl[this.mode], this.indexData.length, gl.UNSIGNED_SHORT, 0)
            } else {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
                gl.drawArrays(gl[this.mode], 0, this.length)
            }
        } else
            console.warn('dis modelz hanz n00 vertices m9, coz yu suck WTF u want 2 b kilz bi XxX-_720@NOSCOPE_ED-_xXX?/ + XD')
    }
    setScale(v) {
        this.worldMatrix[0] = v
        this.worldMatrix[5] = v
        this.worldMatrix[10] = v
    }
    updateVertices(data, indices) {
        if (data instanceof Float32Array)
            this.vertexData = data
        else
            this.vertexData = new Float32Array(data)

        this.gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW)
        this.gl.bindBuffer(gl.ARRAY_BUFFER, this.null);
        if (indices) {

            if (indices instanceof Uint16Array)
                this.indexData = indices
            else
                this.indexData = new Uint16Array(indices)

            this.gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            this.gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indexData, gl.STATIC_DRAW)
            this.gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.null);
        } else {
            console.warn("No new Index data supplyed motherfucker, switching to gl.DrawArrays only to you look at this.")
            console.info("Do you want to the code predict the index buffer for you bitch?")
            this.length = this.vertexData.length / 3
            this.useIndex = false
        }
    }
}