function GL_ToolKit(gl) {

    const state = {
        gl: gl,
        mode: null,
        program: null,
        arrayBuffer: null,
        indexBuffer: null,
        vertexArray: null,
        attribute: null,
        texute: null,
    }
    if (!state.gl) {
        console.error('No webgl2 for you')
    }

    state.mode = state.gl.TRIANGLES

  
    class Shader {
        constructor(str) {
            this.string = str;
            [this.typeString, this.typeEnum] = /gl_Position/g.test(this.string)
                ? ['vertex shader', state.gl.VERTEX_SHADER]
                : ['fragment sahder', state.gl.FRAGMENT_SHADER]
            this.shader = state.gl.createShader(this.typeEnum)
            state.gl.shaderSource(this.shader, this.string)
            state.gl.compileShader(this.shader)
            this.infoLog = null
            this.compileStatus = state.gl.getShaderParameter(this.shader, state.gl.COMPILE_STATUS)
            if (!this.compileStatus) {
                this.infoLog = state.gl.getShaderInfoLog(this.shader)
                throw new Error(this.infoLog)
            }
        }
        error(string, log) {
            state.gl.deleteShader(this.shader)
            this.shader = null
            this.string = null
            console.error(string, log)
        }
    }
    class AttribManager {
        constructor(caller, location, type) {
            this.caller = caller
            this.name = location
            this.type = type
            this.index = state.gl.getAttribLocation(this.caller.program, location)
            this.info = state.gl.getActiveAttrib(this.caller.program, this.index)
            let typeData = getDataOfType(type)
            this.modeString = typeData.typeString
            this.mode = typeData.typeEnum
            this.size = typeData.size
            this.enabled = false
            this.initialized = false
            this.bufferBound = null
        }
        setPointer() {
            this.initialized = true
            this.bufferBound = state.arrayBuffer
            state.gl.vertexAttribPointer(this.index, this.size, this.mode, false, 0, 0)
        }
        enable() {
            this.enabled = true
            state.gl.enableVertexAttribArray(this.index)
        }
        disable() {
            this.enabled = false
            state.gl.disableVertexAttribArray(this.index)
        }
    }
    class ShaderProgram {
        constructor(vertex, fragment) {
            this.vertexShader = new Shader(vertex)
            this.fragmentShader = new Shader(fragment)
            this.program = state.gl.createProgram()
            state.gl.attachShader(this.program, this.vertexShader.shader)
            state.gl.attachShader(this.program, this.fragmentShader.shader)
            state.gl.linkProgram(this.program)
            this.linkStatus = state.gl.getProgramParameter(this.program, state.gl.LINK_STATUS)
            if (!this.linkStatus) {
                this.infoLog = state.gl.getProgramInfoLog(this.program)
                this.error('Falied to link the shader program (Maybe them have incorrect inputs/outputs/precision).', this.infoLog || 'No info log returned from the context')
            }
            this.attributes = {}
            this._uniforms = {}
            this.uniforms = {}
            this.uniformArrays = {}
            this.getAttributes()
            this.getUniforms()
            this.validateStatus = 'not validated'
        }
        getAttributes() {
            this.attributes = {
                enableAll() {
                    for (let att in this)
                        this[att] instanceof AttribManager && this[att].enable()
                },
                disableAll() {
                    for (let att in this)
                        this[att] instanceof AttribManager && this[att].disable()
                }
            }

            let data = this.vertexShader.string.match(/in(?![t]).*;/g)
            data && data.map(item => {
                let [_in, type, location] = item.split(' ')
                location = location.slice(0, location.length - 1)
                this.attributes[location] = new AttribManager(this, location, type)
            })
        }
        getUniforms() {
            this._uniforms = {}
            this.uniforms = {}
            this.uniformArrays = {}
            const _self = this
            const data1 = this.vertexShader.string.match(/uniform.*;/g)
            const data2 = this.fragmentShader.string.match(/uniform.*;/g)
            const data = data1.concat(data2)
            data && data.map(item => {
                let [useless, type, location] = item.split(' ')
                location = location.slice(0, location.length - 1)
                if (/([[].*])+/g.test(location)) {
                    const size = getTheDamnSizeOfTheUniform(location)
                    location = location.match(/([\w]+(?=[[]))/g)[0]
                    let uniformArray = range(size, -1).map(i => this.genUniformManager(`${location}[${i}]`, type))
                    this.uniformArrays[location] = new Proxy(uniformArray, {
                        get(targ, prop) {
                            console.log(targ[prop])
                            return targ[prop].lastSet
                        },
                        set(targ, prop, value) {
                            return targ[prop].setValue(value)
                        }
                    })
                } else {
                    this._uniforms[location] = this.genUniformManager(location, type)
                }
            })
            this.uniforms = new Proxy(this._uniforms, {
                get(targ, prop) {
                    console.log(targ[prop])
                    return targ[prop].lastSet
                },
                set(targ, prop, value) {
                    return targ[prop].setValue(value)
                }
            })
        }
        use() {
            state.gl.useProgram(this.program)
            state.program = this
            return this
        }
        error(string, log) {
            state.gl.deleteProgram(this.program)
            this.program = null
            this.vertexShader.error('Forced to delete vertex shader', 'as the program has not created')
            this.fragmentShader.error('Forced to delete fragment shader', 'as the program has not created')
            console.error(log)
            console.log(this)
            throw new Error(string)
        }
        validate() {
            state.gl.validateProgram(this.program)
            this.validateStatus = state.gl.getProgramParameter(this.program, state.gl.VALIDATE_STATUS)
            if (!this.validateStatus) {
                this.infoLog = gl.getProgramInfoLog(this.program)
                state.gl.deleteProgram(this.program)
                this.program = null

                console.error('The Program is not valid.', this.infoLog, this.program)
            }
        }
        setUniform(location, v1, v2, v3, v4) {
            this.uniformManger.setUniform(location, v1, v2, v3, v4)
        }
        setPointer(location) {
            state.gl.vertexAttribPointer(this.vertextAttribs.attribLocations[location], this.vertextAttribs.attribSizes[location], state.gl.FLOAT, false, 0, 0)
        }
        genUniformManager(location, type) {
            const UniformManger = {}
            UniformManger.index = state.gl.getUniformLocation(this.program, location)
            UniformManger.setValue = setUniformFactory(UniformManger, typeToEnum(type))
            Object.defineProperty(UniformManger, 'lastSet', {
                set(a) {
                    console.warn('UniformManager.lastSet property is not used to be setted.')
                    return a
                },
                get() {
                    return state.gl.getUniform(_self.program, UniformManger.index)
                }
            })
            return UniformManger
        }
    }
   
    class GL_Texture {
        constructor(url) {
            this.texture2D = state.gl.createTexture()
            this.bind()
            state.gl.texParameteri(state.gl.TEXTURE_2D, state.gl.TEXTURE_MIN_FILTER, state.gl.LINEAR)
            state.gl.texParameteri(state.gl.TEXTURE_2D, state.gl.TEXTURE_MAG_FILTER, state.gl.LINEAR)
            state.gl.texImage2D(state.gl.TEXTURE_2D, 0, state.gl.RGBA, 1, 1, 0, state.gl.RGBA, state.gl.UNSIGNED_BYTE, new Uint8Array([Math.random() * 125, Math.random() * 125, Math.random() * 125, 255]))
            this.setTexture(url)
        }
        bind() {
            state.gl.bindTexture(3553, this.texture2D)
            state.gl.activeTexture(state.gl.TEXTURE0)
            state.texture = this
            return this
        }
        unbind() {
            state.gl.bindTexture(3553, null)
            state.texture = null
            return this
        }
        destroy() {
            this.unbind()
            state.gl.deleteTexture(this.texture2D)
            this.texture2D = null
            this.textureBlob = null
        }
        setTexture(file) {
            if (typeof file === 'string') {
                this.textureElement = new Image()
                this.textureElement.onload = _ => {
                    this.bind()
                    state.gl.texImage2D(state.gl.TEXTURE_2D, 0, state.gl.RGBA, state.gl.RGBA, state.gl.UNSIGNED_BYTE, this.textureElement)
                    state.gl.generateMipmap(3553)
                    state.gl.activeTexture(state.gl.TEXTURE0)
                }
                this.textureElement.src = file
            } else {
                this.textureElement = file
                state.gl.texImage2D(state.gl.TEXTURE_2D, 0, state.gl.RGBA, state.gl.RGBA, state.gl.UNSIGNED_BYTE, file)
            }
        }
    }
    const getTheDamnSizeOfTheUniform = (location) => Number(location.match(/([[].*])+/g)[0].match(/\d+/g))
    const setUniformFactory = (caller, postFix) => {
        let setValue;
        let Gl_Set_Unifrom = state.gl[`uniform${postFix}`].bind(state.gl)
        switch (postFix) {
            case '1ui': case '1i': case '1f':
                setValue = function (v) {
                    Gl_Set_Unifrom(this.index, v)
                    return 1
                }
                break
            case '2ui': case '2i': case '2f':
                setValue = function (v1, v2) {
                    Gl_Set_Unifrom(this.index, v1, v2)
                    return 1
                }
                break
            case '3ui': case '3i': case '3f':
                setValue = function (v1, v2, v3) {
                    Gl_Set_Unifrom(this.index, v1, v2, v3)
                    return 1
                }
                break
            case '4ui': case '4i': case '4f':
                setValue = function (v1, v2, v3, v4) {
                    Gl_Set_Unifrom(this.index, v1, v2, v3, v4)
                    return 1
                }
                break
            case '1fv': case '2fv': case '3fv': case '4fv':
            case '1uiv': case '2uiv': case '3uiv': case '4uiv':
            case '1iv': case '2iv': case '3iv': case '4iv':
                setValue = function (v) {
                    Gl_Set_Unifrom(this.index, v)
                    return 1
                }
                break
            case 'Matrix2x3fv': case 'Matrix3fv': case 'Matrix4x3fv':
            case 'Matrix2x4fv': case 'Matrix3x4fv': case 'Matrix4fv':
            case 'Matrix2fv': case 'Matrix3x2fv': case 'Matrix4x2fv':
                setValue = function (v) {
                    Gl_Set_Unifrom(this.index, false, v)
                    return 1
                }
                break
            default:
                throw new Error(`Unsupported uniform postfix ${postFix}.`)
                break
        }
        return setValue.bind(caller)
    }
    const typeToEnum = (name) => {
        let result = 0;
        switch (name) {
            case 'float': result = '1f'; break;
            case 'int': result = '1i'; break;
            case 'bool': result = '1i'; break;
            case 'mat2': result = 'Matrix2fv'; break;
            case 'mat3': result = 'Matrix3fv'; break;
            case 'mat4': result = 'Matrix4fv'; break;
            case 'mat2x3': result = 'Matrix2x3fv'; break;
            case 'mat2x4': result = 'Matrix2x4fv'; break;
            case 'mat3x2': result = 'Matrix3x2fv'; break;
            case 'mat3x4': result = 'Matrix3x4fv'; break;
            case 'mat4x2': result = 'Matrix4x2fv'; break;
            case 'mat4x4': result = 'Matrix4x4fv'; break;
            case 'vec2': result = '3fv'; break;
            case 'vec3': result = '3fv'; break;
            case 'vec4': result = '3fv'; break;
            case 'ivec2': result = '2iv'; break;
            case 'ivec3': result = '3iv'; break;
            case 'ivec4': result = '4iv'; break;
            case 'bvec2': result = '2iv'; break;
            case 'bvec3': result = '3iv'; break;
            case 'bvec4': result = '4iv'; break;
            case 'uint': result = '1ui'; break;
            case 'uvec2': result = '2uiv'; break;
            case 'uvec3': result = '3uiv'; break;
            case 'uvec4': result = '4uiv'; break;
            case 'sampler2D': result = '1i'; break;
            case 'sampler3D': result = '1i'; break;
            case 'samplerCube': result = '1i'; break;
            case 'samplerCubeShadow': result = '1i'; break;
            case 'sampler2DShadow': result = '1i'; break;
            case 'sampler2DArray': result = '1i'; break;
            case 'sampler2DArrayShadow': result = '1i'; break;
            case 'isampler2D': result = '1i'; break;
            case 'isampler3D': result = '1i'; break;
            case 'isamplerCube': result = '1i'; break;
            case 'isampler2DArray': result = '1i'; break;
            case 'usampler2D': result = '1i'; break;
            case 'usampler3D': result = '1i'; break;
            case 'usamplerCube': result = '1i'; break;
            case 'usampler2DArray': result = '1i'; break;
        }
        return result
        
    }
    const getDataOfType = (str) => {
        let result;
        switch (str) {
            case 'float': result = { size: 1, typeString: 'FLOAT', typeEnum: state.gl.FLOAT }; break;
            case 'vec2': result = { size: 2, typeString: 'FLOAT', typeEnum: state.gl.FLOAT }; break;
            case 'vec3': result = { size: 3, typeString: 'FLOAT', typeEnum: state.gl.FLOAT }; break;
            case 'vec4': result = { size: 4, typeString: 'FLOAT', typeEnum: state.gl.FLOAT }; break;
            case 'int': result = { size: 1, typeString: 'BYTE', typeEnum: state.gl.BYTE }; break;
            case 'ivec2': result = { size: 2, typeString: 'BYTE', typeEnum: state.gl.BYTE }; break;
            case 'ivec3': result = { size: 3, typeString: 'BYTE', typeEnum: state.gl.BYTE }; break;
            case 'ivec4': result = { size: 4, typeString: 'BYTE', typeEnum: state.gl.BYTE }; break;
            case 'uint': result = { size: 1, typeString: 'UNSIGNED_BYTE', typeEnum: state.gl.UNSIGNED_BYTE }; break;
            case 'uvec2': result = { size: 2, typeString: 'UNSIGNED_BYTE', typeEnum: state.gl.UNSIGNED_BYTE }; break;
            case 'uvec3': result = { size: 3, typeString: 'UNSIGNED_BYTE', typeEnum: state.gl.UNSIGNED_BYTE }; break;
            case 'uvec4': result = { size: 4, typeString: 'UNSIGNED_BYTE', typeEnum: state.gl.UNSIGNED_BYTE }; break;
            default: throw new Error('Unsupported attribute type ' + str); break;
        }
        return result;
    }
    return {
        shaderProgram: (vs, fs) => new ShaderProgram(vs, fs),
        buffer: (inp, siz, mod) => new GL_Buffer(inp, siz, mod),
        arrayBuffer: (inp, siz, mod) => new GL_ArrayBuffer(inp, siz, mod),
        texture: (url) => new GL_Texture(url),
    }
}














