const helpers = (ColdMeson => {
    function createMathWorld(ctx, program, w, h, fov) {

        ctx.useProgram(program)

        let matWorldUniformLocation = ctx.getUniformLocation(program, 'mWorld')
        let matViewUniformLocation = ctx.getUniformLocation(program, 'mView')
        let matProjUniformLocation = ctx.getUniformLocation(program, 'mProj')

        let worldMatrix = new Float32Array(16)
        let viewMatrix = new Float32Array(16)
        let projMatrix = new Float32Array(16)

        let zRotationMatrix = new Float32Array(16)
        let xRotationMatrix = new Float32Array(16)
        let yRotationMatrix = new Float32Array(16)

        let identityMatrix = mat4.identity(new Float32Array(16))

        mat4.identity(worldMatrix)

        let world = {
            gl: ctx,
            updateView(w, h, fov) {
                ctx.viewport(0, 0, ctx.canvas.width, ctx.canvas.height)
                mat4.perspective(projMatrix, glMatrix.toRadian(fov), ctx.canvas.width / ctx.canvas.height, 0.1, 1000.0)
                ctx.uniformMatrix4fv(matProjUniformLocation, ctx.FALSE, projMatrix)
            },
            sendUniforms() {
                ctx.uniformMatrix4fv(matWorldUniformLocation, ctx.FALSE, worldMatrix)
                ctx.uniformMatrix4fv(matViewUniformLocation, ctx.FALSE, viewMatrix)
                ctx.uniformMatrix4fv(matProjUniformLocation, ctx.FALSE, projMatrix)
            },
            lookAt(pos, point, rotation) {
                mat4.lookAt(viewMatrix, pos, point, rotation)
            },
            loacations: {
                matWorldUniformLocation,
                matViewUniformLocation,
                matProjUniformLocation,
            },
            rotate(x, y, z) {
                mat4.rotate(xRotationMatrix, identityMatrix, x, [0, 1, 0])
                mat4.rotate(yRotationMatrix, identityMatrix, y, [1, 0, 0])
                mat4.mul(this.matrices.worldMatrix, xRotationMatrix, yRotationMatrix)
                //mat4.rotate(zRotationMatrix, identityMatrix, z, [0, 0, 1])
                //mat4.mul(this.matrices.worldMatrix, identityMatrix, zRotationMatrix)
            },
            matrices: {
                worldMatrix,
                viewMatrix,
                projMatrix,
            }
        }
        world.updateView(w, h, fov)
        world.lookAt([0, 0, -8], [0, 0, 0], [0, 1, 0])
        world.sendUniforms()

        return world
    }
    function createTexture(gl, textureFile) {
        let texture = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        textureFile && gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            textureFile
        )
        gl.bindTexture(gl.TEXTURE_2D, null)
        return texture
    }

    
    function setPointer(ctx, program, buffer, name, nE, sI, oS) {
        ctx.bindBuffer(ctx.ARRAY_BUFFER, buffer);
        let pointer = ctx.getAttribLocation(program, name);
        ctx.vertexAttribPointer(
            pointer,
            nE,
            ctx.FLOAT,
            ctx.FALSE,
            sI * Float32Array.BYTES_PER_ELEMENT,
            oS * Float32Array.BYTES_PER_ELEMENT
        );
        ctx.enableVertexAttribArray(pointer)
        ctx.bindBuffer(ctx.ARRAY_BUFFER, null);
        return pointer
    }


    function createArrayBuffer(ctx, data) {
        var buffer = ctx.createBuffer();
        ctx.bindBuffer(ctx.ARRAY_BUFFER, buffer);
        ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(data), ctx.STATIC_DRAW);
        ctx.bindBuffer(ctx.ARRAY_BUFFER, null);
        buffer.length = data.length
        return buffer
    }

    function createElementArrayBuffer(ctx = gl, data) {
        var buffer = ctx.createBuffer();
        ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, buffer);
        ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), ctx.STATIC_DRAW);
        ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, null);
        buffer.length = data.length
        return buffer
    }

    class GL {
        constructor(width, height, element, options) {
            this.gl = document.createElement('canvas').getContext('webgl')
            this.canvas = this.gl.canvas
            this.gl.clearColor(0/1, 10/1, 100/1, 1);
            this.gl.enable(this.gl.DEPTH_TEST)
            this.gl.enable(this.gl.CULL_FACE)

            this.resize(width, height);

            element && element.appendChild(this.canvas)
        }
        setParent(element) {
            element && element.appendChild(this.canvas)
            return this
        }
        resize(width, height) {
            this.canvas.width = width
            this.canvas.height = height
            this.gl.viewport(0, 0, width, height)
        }
        render(scene, camera) {
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        }
        setClearColor(r, g, b, a) {
            this.gl.clearColor(r, g, b, a)
        }
    }
    class NormalBufferGeometry {
        constructor(gl, vertices, indices, uvs, normals) {
            this.gl = gl
            this.shaderConfig = {
                vertexPos: ['vbo', 3, 3, 0],
                textureUV: ['ubo', 2, 2, 0],
                meshNormals: ['nbo', 3, 3, 0],
            }
            this.nbo = createArrayBuffer(this.gl, normals)
            this.ubo = createArrayBuffer(this.gl, uvs)
            this.vbo = createArrayBuffer(this.gl, vertices);
            this.ibo = createElementArrayBuffer(this.gl, indices)
        }
    }
    class BufferGeometry {
        constructor(gl, vertices, indices, uvs) {
            this.gl = gl
            this.shaderConfig = {
                vertexPos: ['vbo', 3, 3, 0],
                textureUV: ['ubo', 2, 2, 0],
            }
            this.ubo = createArrayBuffer(this.gl, uvs)
            this.vbo = createArrayBuffer(this.gl, vertices);
            this.ibo = createElementArrayBuffer(this.gl, indices)
        }
    }
    class CubeGeometry {
        constructor(gl, m = 1) {
            this.gl = gl
            this.shaderConfig = {
                vertexPos: ['vbo', 3, 3, 0],
                textureUV: ['ubo', 2, 2, 0],
            }
            this.ubo = createArrayBuffer(this.gl, [
                0, 0,
                0, 1,
                1, 1,
                1, 0,
                0, 0,
                1, 0,
                1, 1,
                0, 1,
                1, 1,
                0, 1,
                0, 0,
                1, 0,
                1, 1,
                1, 0,
                0, 0,
                0, 1,
                0, 0,
                0, 1,
                1, 1,
                1, 0,
                1, 1,
                1, 0,
                0, 0,
                0, 1,
            ])
            this.vbo = createArrayBuffer(this.gl, [
                -1.0, 1.0, -1.0,
                -1.0, 1.0, 1.0,
                1.0, 1.0, 1.0,
                1.0, 1.0, -1.0,
                -1.0, 1.0, 1.0,
                -1.0, -1.0, 1.0,
                -1.0, -1.0, -1.0,
                -1.0, 1.0, -1.0,
                1.0, 1.0, 1.0,
                1.0, -1.0, 1.0,
                1.0, -1.0, -1.0,
                1.0, 1.0, -1.0,
                1.0, 1.0, 1.0,
                1.0, -1.0, 1.0,
                -1.0, -1.0, 1.0,
                -1.0, 1.0, 1.0,
                1.0, 1.0, -1.0,
                1.0, -1.0, -1.0,
                -1.0, -1.0, -1.0,
                -1.0, 1.0, -1.0,
                -1.0, -1.0, -1.0,
                -1.0, -1.0, 1.0,
                1.0, -1.0, 1.0,
                1.0, -1.0, -1.0,
            ].map(i => i *= m));
            this.ibo = createElementArrayBuffer(this.gl, [
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
        }
    }
    class GlobalNormalMaterialV2 {
        constructor(gl, texture) {
            this.gl = gl
            this.texture = texture
            this.vShaderText = [
                'precision mediump float;',
                'attribute vec3 vertPosition;',
                'attribute vec2 vertTexCoord;',
                'attribute vec3 meshNormals;',
                '',
                'varying vec3 fragNormal;',
                'varying vec2 fragTexCoord;',
                'uniform mat4 mWorld;',
                'uniform mat4 mView;',
                'uniform mat4 mProj;',
                'void main()',
                '{',
                '    fragNormal = (mWorld * vec4(meshNormals,0.0)).xyz * vec3(1, 1, -1);',
                '    fragTexCoord = vertTexCoord;',
                '    gl_Position = mProj * mView  * mWorld * vec4(vertPosition , 1.0);',
                '}',
            ].join('\n')

            this.fShaderText = [
                'precision mediump float;',
                '',
                'varying vec2 fragTexCoord;',
                'varying vec3 fragNormal;',
                'uniform sampler2D sampler;',
                'uniform vec3 scala;',
                'uniform vec3 ambientLightIntensity;',
                'uniform vec3 sunlightIntensity;',
                'uniform vec3 sunlightDirection;',
                'void main()',
                '{',
                '    vec3 surfaceNormal = normalize(fragNormal);',
                '',
                '    vec4 textel = texture2D(sampler, fragTexCoord);',
                '',
                '    vec3 lightItensity = ambientLightIntensity + ',
                '       sunlightIntensity * max(dot(fragNormal, sunlightDirection), 0.0);',
                '',
                '    gl_FragColor = vec4(scala, 1.0) *  vec4(textel.rgb * lightItensity, textel.a);',
                '}',
            ].join('\n')



            this.program = createShaderProgram(this.gl, this.vShaderText, this.fShaderText)
            this.use()
            const self = this
            this.extras = {
                ambLiIgUL: this.gl.getUniformLocation(this.program, 'ambientLightIntensity'),
                sunLiIgUl: this.gl.getUniformLocation(this.program, 'sunlightIntensity'),
                sunLiDgUl: this.gl.getUniformLocation(this.program, 'sunlightDirection'),
                scala: this.gl.getUniformLocation(this.program, 'scala'),
                setUniform(name, v1, v2, v3) {
                    self.gl.uniform3f(self.extras[name], v1, v2, v3)
                },
            }
        }
        use() {
            this.gl.useProgram(this.program)
        }
    }
    class GlobalNormalMaterial {
        constructor(gl, texture) {
            this.gl = gl
            this.texture = texture
            this.vShaderText = [
                'precision mediump float;',
                'attribute vec3 vertPosition;',
                'attribute vec2 vertTexCoord;',
                'attribute vec3 meshNormals;',
                '',
                'varying vec3 fragNormal;',
                'varying vec2 fragTexCoord;',
                'uniform mat4 mWorld;',
                'uniform mat4 mView;',
                'uniform mat4 mProj;',
                'void main()',
                '{',
                '    fragNormal = (mWorld * vec4(meshNormals,0.0)).xyz * vec3(1, 1, -1);',
                '    fragTexCoord = vertTexCoord;',
                '    gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
                '}',
            ].join('\n')

            this.fShaderText = [
                'precision mediump float;',
                'varying vec2 fragTexCoord;',
                'varying vec3 fragNormal;',
                'uniform sampler2D sampler;',
                'void main()',
                '{',
                '    //gl_FragColor = texture2D(sampler, fragTexCoord);',
                '    gl_FragColor = vec4(fragNormal, 1.0);',
                '}',
            ].join('\n')

            this.program = createShaderProgram(this.gl, this.vShaderText, this.fShaderText)
        }
        use() {
            this.gl.useProgram(this.program)
        }
    }
    class LocalNormalMaterial {
        constructor(gl, texture) {
            this.gl = gl
            this.texture = texture
            this.vShaderText = [
                'precision mediump float;',
                'attribute vec3 vertPosition;',
                'attribute vec2 vertTexCoord;',
                'attribute vec3 meshNormals;',
                '',
                'varying vec3 fragNormal;',
                'varying vec2 fragTexCoord;',
                'uniform mat4 mWorld;',
                'uniform mat4 mView;',
                'uniform mat4 mProj;',
                'void main()',
                '{',
                '    fragNormal = meshNormals;',
                '    fragTexCoord = vertTexCoord;',
                '    gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
                '}',
            ].join('\n')

            this.fShaderText = [
                'precision mediump float;',
                'varying vec2 fragTexCoord;',
                'varying vec3 fragNormal;',
                'uniform sampler2D sampler;',
                'void main()',
                '{',
                '    //gl_FragColor = texture2D(sampler, fragTexCoord);',
                '    gl_FragColor = vec4(fragNormal, 1.0);',
                '}',
            ].join('\n')

            this.program = createShaderProgram(this.gl, this.vShaderText, this.fShaderText)
        }
        use() {
            this.gl.useProgram(this.program)
        }
    }

    class TextureMaterial {
        constructor(gl, texture) {
            this.gl = gl
            this.texture = texture
            this.vShaderText = [

                'precision mediump float;',

                'attribute vec3 vertPosition;',
                'attribute vec2 vertTexCoord;',

                'varying vec2 fragTexCoord;',

                'uniform mat4 mWorld;',
                'uniform mat4 mView;',
                'uniform mat4 mProj;',

                'void main()',
                '{',
                '    fragTexCoord = vertTexCoord;',
                '    gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
                '}',
            ].join('\n')

            this.fShaderText = [
                'precision mediump float;',
                'varying vec2 fragTexCoord;',
                'uniform sampler2D sampler;',
                'void main()',
                '{',
                '    gl_FragColor = texture2D(sampler, fragTexCoord);',
                '}',
            ].join('\n')

            this.program = createShaderProgram(this.gl, this.vShaderText, this.fShaderText)
        }
        use() {
            this.gl.useProgram(this.program)
        }
    }
    class GLObject {
        constructor(gl, material, geometry) {

            this.gl = gl
            this.material = material
            this.geometry = geometry

            let vPointer = this.geometry[this.geometry.shaderConfig.vertexPos[0]]
            let vStride = this.geometry.shaderConfig.vertexPos[1]
            let vElements = this.geometry.shaderConfig.vertexPos[2]
            let vOffset = this.geometry.shaderConfig.vertexPos[3]

            let tPointer = this.geometry[this.geometry.shaderConfig.textureUV[0]]
            let tStride = this.geometry.shaderConfig.textureUV[1]
            let tElements = this.geometry.shaderConfig.textureUV[2]
            let tOffset = this.geometry.shaderConfig.textureUV[3]

            this.vertexPos = setPointer(gl, this.material.program, vPointer, 'vertPosition', vStride, vElements, vOffset)
            this.textureUV = setPointer(gl, this.material.program, tPointer, 'vertTexCoord', tStride, tElements, tOffset)

            if (this.geometry.shaderConfig.meshNormals) {
                let nPointer = this.geometry[this.geometry.shaderConfig.meshNormals[0]]
                let nStride = this.geometry.shaderConfig.meshNormals[1]
                let nElements = this.geometry.shaderConfig.meshNormals[2]
                let nOffset = this.geometry.shaderConfig.meshNormals[3]
                this.meshNormals = setPointer(gl, this.material.program, nPointer, 'meshNormals', nStride, nElements, nOffset)
            }


            this.texture = createTexture(this.gl, this.material.texture)
        }
        render() {
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            this.material.use()
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.geometry.vbo);
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.geometry.ibo);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)
            this.gl.drawElements(this.gl.TRIANGLES, this.geometry.ibo.length, this.gl.UNSIGNED_SHORT, 0);
        }
    }
    class Scene {
        constructor(gl, program, fov) {
            this.gl = gl
            this.program = program
            this.world = createMathWorld(this.gl, this.program, this.gl.canvas.width, this.gl.canvas.height, fov)
        }
    }
    console.info(ColdMeson)
    return {
        normalBufferGeometry: (gl, v, i, u, n) => new NormalBufferGeometry(gl, v, i, u, n),
        createRenderer: (w, h, e) => new GL(w, h, e),
        cubeGeometry: (gl, m) => new CubeGeometry(gl, m),
        bufferGeometry: (gl, v, i, u) => new BufferGeometry(gl, v, i, u),
        textureMaterial: (gl, txtr) => new TextureMaterial(gl, txtr),
        globalNormalMaterial: (gl, txtr) => new GlobalNormalMaterial(gl, txtr),
        globalNormalMaterialV2: (gl, txtr) => new GlobalNormalMaterialV2(gl, txtr),
        localNormalMaterial: (gl, txtr) => new LocalNormalMaterial(gl, txtr),
        createScene: (gl, prog, fov) => new Scene(gl, prog, fov),
        createObject: (gl, material, geometry) => new GLObject(gl, material, geometry)
    }
})('I do this for you guys.')