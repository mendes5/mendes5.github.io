const TwoDee = {}
TwoDee.gl = (function () {

    function state(CANVAS) {

        const gl = CANVAS.getContext('webgl2',{antialias:false})

        const renderList = []

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
        gl.clearColor(0, 0, 0, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)

        const createShaderProgram = (vs, fs) => {
            const program = gl.createProgram()
            const vShader = createShader(vs)
            const fShader = createShader(fs)

            gl.attachShader(program, vShader)
            gl.attachShader(program, fShader)
            gl.linkProgram(program)

            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                gl.deleteShader(vShader)
                gl.deleteShader(fShader)

                throw new Error(gl.getProgramInfoLog(program), gl.deleteProgram(program))
            }
            return program
        }

        const createShader = (str) => {
            const typeEnum = /gl_Position/g.test(str)
                ? gl.VERTEX_SHADER
                : gl.FRAGMENT_SHADER

            const shader = gl.createShader(typeEnum)
            gl.shaderSource(shader, str)
            gl.compileShader(shader)
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                throw new Error(gl.getShaderInfoLog(shader), gl.deleteShader(shader))
            }
            return shader
        }

        class GL_Buffer {
            constructor(data) {
                this.buffer = gl.createBuffer()
                this.setData(data)
            }
            bind() {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
                return this
            }
            setData(data) {
                this.bind()
                gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
                return this
            }
            unbind() {
                gl.bindBuffer(gl.ARRAY_BUFFER, null)
                return this
            }
        }


        const vShaderSource =
            `#version 300 es
                     precision mediump float;
                     in vec2 a_position;
                     uniform mat3 u_projection;
                     uniform mat3 u_translation;
                     uniform mat3 u_skew;
                     uniform mat3 u_scaling;
                     uniform mat3 u_rotation;
                     uniform mat3 u_anchor;
                     void main() {
                         gl_Position = vec4((u_projection * u_translation *u_rotation * u_scaling  * u_anchor * vec3(a_position, 1)).xy, 0, 1);
                     }`

        const fShaderSource =
            `#version 300 es
                     precision mediump float;
                     out vec4 outColor;
                     uniform vec4 color;
                     void main() {
                        outColor = color; 
                     }`





        const program = createShaderProgram(vShaderSource, fShaderSource)

        gl.useProgram(program)
        const projectionLocation = gl.getUniformLocation(program, 'u_projection')

        const transaltionLocation = gl.getUniformLocation(program, 'u_translation')
        const rotationLocation = gl.getUniformLocation(program, 'u_rotation')
        const scalingLocation = gl.getUniformLocation(program, 'u_scaling')
        const colorLocation = gl.getUniformLocation(program, 'color')
        const anchorLocation = gl.getUniformLocation(program, 'u_anchor')
        const vertexPositionLocation = gl.getAttribLocation(program, 'a_position')
        gl.enableVertexAttribArray(vertexPositionLocation)
        const projMatrix = M3.fromProjection(gl.canvas.width, gl.canvas.height)
        gl.uniformMatrix3fv(projectionLocation, false, projMatrix)


        class Sprite {
            constructor(x = 10, y = 10, color) {
                this.transaltionMatrix = M3.fromTranslation(0, 0)
                this.scalingMatrix = M3.fromScale(1, 1)
                this.rotationMatrix = M3.fromRotation(0, 0)
                this.anchorMatrix = M3.fromTranslation(-x / 2, -y / 2)
                this.quad = new GL_Buffer(new Float32Array([
                    0, 0, x, 0, 0, y, 0, y, x, 0, x, y
                ])).unbind()
                this.color = new Float32Array(color)
                this._position = { x: 0, y: 0, set(x, y) { this.x = x, this.y = y } }
                this._rotation = { rad: 0, deg: 0, set(x, y) { this.x = x, this.y = y } }
                this._scale = { x: 1, y: 1 }
                this._dirty = true
                const self = this
                const dHandler = {
                    get(target, prop) {
                        return target[prop]
                    },
                    set(target, prop, value) {
                        self._dirty = true
                        return target[prop] = value
                    }
                }
                this.position = new Proxy(this._position, dHandler)
                this.scale = new Proxy(this._scale, dHandler)
                this.rotation = new Proxy(this._rotation, dHandler)
                renderList.push(this)
            }
            render() {
                this._dirty && this.updateMatrix()
                this.quad.bind()
                gl.uniform4fv(colorLocation, this.color)
                gl.vertexAttribPointer(vertexPositionLocation, 2, gl.FLOAT, false, 0, 0)
                gl.uniformMatrix3fv(transaltionLocation, false, this.transaltionMatrix)
                gl.uniformMatrix3fv(rotationLocation, false, this.rotationMatrix)
                gl.uniformMatrix3fv(scalingLocation, false, this.scalingMatrix)
                gl.uniformMatrix3fv(anchorLocation, false, this.anchorMatrix)
                gl.drawArrays(gl.TRIANGLES, 0, 6)
            }
            updateMatrix() {
                M3.translate(this.transaltionMatrix, this._position.x, this._position.y)
                M3.scale(this.scalingMatrix, this._scale.x, this._scale.y)
                M3.rotate(this.rotationMatrix, this._rotation.deg)
                this._dirty = false
            }
        }
        return {
            sprite: Sprite,
            render() {
                renderList.map(e => e.render())
            },
            clear(){
                gl.clear(gl.COLOR_BUFFER_BIT)
            },
            get(){
                console.log(gl)
            }
        }
    }
    return {
        state(a) {
            return state(a)
        }
    }
})()

//The GL Core module
console.info('GL Module Loaded.')












