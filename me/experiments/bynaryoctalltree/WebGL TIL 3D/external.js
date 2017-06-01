class Mesh {
    constructor(res, texture) {
        gl.useProgram(program)
        this.texture = texture
        this.scaleMatrix = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ])
        this.worldMatrix = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ])
        this.renderable = true
        this.vertexBuffer = gl.createBuffer()
        this.normalBuffer = gl.createBuffer()
        this.normalData = new Float32Array(res.normals)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, this.normalData, gl.STATIC_DRAW)
        this.vertexData = new Float32Array(res.vertices)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW)
        this.indexBuffer = gl.createBuffer()
        this.indexData = new Uint16Array(flatten(res.faces))
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indexData, gl.STATIC_DRAW)
        this.uvBuffer = gl.createBuffer()
        this.uvData = new Float32Array(flatten(res.texturecoords))
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, this.uvData, gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer)
        gl.vertexAttribPointer(aTexUV, 2, gl.FLOAT, false, 0, 0)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
        gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0)

        gl.uniformMatrix4fv(scale, false, this.scaleMatrix)
    }
    render() {
        if (this.renderable) {
            this.texture.use()
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
            gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
            gl.vertexAttribPointer(aTexUV, 2, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
            gl.uniformMatrix4fv(mWorld, false, this.worldMatrix)
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
            gl.drawElements(gl.TRIANGLES, this.indexData.length, gl.UNSIGNED_SHORT, 0)
        }
    }
}
let fluttershy
loadAll({
    gemTex: '/textures/FlutterGemTex.png',
    baseNeck: '/textures/BaseNeckTex.png',
    wings: '/textures/fluttershy_wings.png',
    tail: '/textures/fluttershy_tail.png',
    fHair: '/textures/fluttershy_hair_front.png',
    bHair: '/textures/fluttershy_hair_back.png',
    eyes: '/textures/fluttershy_eyes.png',
    body: '/textures/fluttershy_body.png',
    eyelashes: '/textures/fluttershy_eyelashes.png'
}).then(t => {



    getJSON('/fluttershy.json').then(a => {
        console.clear()
        fluttershy = {
            meshes: {
                tail: new Mesh(a.meshes[0], new Texture(t.tail)),
                eyelashesBottom: new Mesh(a.meshes[1], new Texture(t.eyelashes)),
                eyelashesTop: new Mesh(a.meshes[2], new Texture(t.eyelashes)),
                maneBottm: new Mesh(a.meshes[3], new Texture(t.bHair)),
                maneTop: new Mesh(a.meshes[4], new Texture(t.fHair)),
                eyes: new Mesh(a.meshes[5], new Texture(t.eyes)),
                totchTop: new Mesh(a.meshes[6], new Texture(t.eyes)),
                tough: new Mesh(a.meshes[7], new Texture(t.body)),
                totchBottom: new Mesh(a.meshes[8], new Texture(t.eyes)),
                topWings: new Mesh(a.meshes[9], new Texture(t.wings)),
                body: new Mesh(a.meshes[10], new Texture(t.body)),
                baseNeck: new Mesh(a.meshes[11], new Texture(t.baseNeck)),
                gem: new Mesh(a.meshes[12], new Texture(t.gemTex)),
            },
            render() {
                this.meshes.body.render()
                this.meshes.eyelashesBottom.render()
                this.meshes.tail.render()
                this.meshes.eyelashesTop.render()
                this.meshes.maneBottm.render()
                this.meshes.maneTop.render()
                this.meshes.eyes.render()
                this.meshes.totchTop.render()
                this.meshes.tough.render()
                this.meshes.totchBottom.render()
                this.meshes.topWings.render()
                this.meshes.gem.render()
                this.meshes.baseNeck.render()
            }
        }
        quads.push(fluttershy)
    })
})

        //Eyelash bottom
        new MeshRenderer(gl, {
            texture: t.eyelashes,
            vertices: t.load.meshes[1].vertices,
            indices: flatten(t.load.meshes[1].faces),
            uvs: flatten(t.load.meshes[1].texturecoords),
            normals: t.load.meshes[1].normals
        }, dShader),
        //Eyelash top
        new MeshRenderer(gl, {
            texture: t.tail,
            vertices: t.load.meshes[2].vertices,
            indices: flatten(t.load.meshes[2].faces),
            uvs: flatten(t.load.meshes[2].texturecoords),
            normals: t.load.meshes[2].normals
        }, dShader),
        //Mane bottom
        new MeshRenderer(gl, {
            texture: t.bHair,
            vertices: t.load.meshes[3].vertices,
            indices: flatten(t.load.meshes[3].faces),
            uvs: flatten(t.load.meshes[3].texturecoords),
            normals: t.load.meshes[3].normals
        }, dShader),
        //Mane top
        new MeshRenderer(gl, {
            texture: t.fHair,
            vertices: t.load.meshes[4].vertices,
            indices: flatten(t.load.meshes[4].faces),
            uvs: flatten(t.load.meshes[4].texturecoords),
            normals: t.load.meshes[4].normals
        }, dShader),
        //Eyes
        new MeshRenderer(gl, {
            texture: t.eyes,
            vertices: t.load.meshes[5].vertices,
            indices: flatten(t.load.meshes[5].faces),
            uvs: flatten(t.load.meshes[5].texturecoords),
            normals: t.load.meshes[5].normals
        }, dShader),
        //Totch top
        new MeshRenderer(gl, {
            texture: t.eyes,
            vertices: t.load.meshes[6].vertices,
            indices: flatten(t.load.meshes[6].faces),
            uvs: flatten(t.load.meshes[6].texturecoords),
            normals: t.load.meshes[6].normals
        }, dShader),
        //Tough
        new MeshRenderer(gl, {
            texture: t.body,
            vertices: t.load.meshes[7].vertices,
            indices: flatten(t.load.meshes[7].faces),
            uvs: flatten(t.load.meshes[7].texturecoords),
            normals: t.load.meshes[7].normals
        }, dShader),
        //Totch bottom
        new MeshRenderer(gl, {
            texture: t.eyes,
            vertices: t.load.meshes[8].vertices,
            indices: flatten(t.load.meshes[8].faces),
            uvs: flatten(t.load.meshes[8].texturecoords),
            normals: t.load.meshes[8].normals
        }, dShader),
        //Wings
        new MeshRenderer(gl, {
            texture: t.wings,
            vertices: t.load.meshes[9].vertices,
            indices: flatten(t.load.meshes[9].faces),
            uvs: flatten(t.load.meshes[9].texturecoords),
            normals: t.load.meshes[9].normals
        }, dShader),
        //Body
        new MeshRenderer(gl, {
            texture: t.body,
            vertices: t.load.meshes[10].vertices,
            indices: flatten(t.load.meshes[10].faces),
            uvs: flatten(t.load.meshes[10].texturecoords),
            normals: t.load.meshes[10].normals
        }, dShader),
        //Base Nekc
        new MeshRenderer(gl, {
            texture: t.baseNeck,
            vertices: t.load.meshes[11].vertices,
            indices: flatten(t.load.meshes[11].faces),
            uvs: flatten(t.load.meshes[11].texturecoords),
            normals: t.load.meshes[11].normals
        }, dShader),
        //Gem
        new MeshRenderer(gl, {
            texture: t.gemTex,
            vertices: t.load.meshes[12].vertices,
            indices: flatten(t.load.meshes[12].faces),
            uvs: flatten(t.load.meshes[12].texturecoords),
            normals: t.load.meshes[12].normals
        }, dShader)