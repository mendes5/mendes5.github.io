class Camera {
    constructor(gl, sense = 100, opt = {}) {

        this.viewMatrix = mat4.create()
        this.projMatrix = mat4.create()

        this.gl = gl

        this.speed
        this._speed = opt.speed || 0.01
        this.fov
        this._fov = opt.fov || 90
        this.sensivity
        this._sense = sense
        this._near = opt.near || 0.3
        this._far = opt.far || 500

        if (opt.type === 'orthographic')
            this.mode = 0
        else if (!opt.type || opt.type === 'perspective' || opt.type != 'perspective')
            this.mode = 1

        if (opt.startPos)
            this.eye = vec3.fromValues(opt.startPos[0], opt.startPos[1], opt.startPos[2])
        else
            this.eye = vec3.create()

        this.forward = vec3.create()
        this.camR = vec3.create()
        if(opt.lookAt)
            this.mouse = { x: opt.lookAt[0], y: opt.lookAt[1] }
        else
            this.mouse = { x: 0, y: 0 }        
        this.aim = { x: 0, y: 0 }

        this.ortho = 40
        this._ortho = 40
        this.w = this.gl.canvas.width
        this.h = this.gl.canvas.height

        this.lookAt = vec3.create()

        this.keys = new BooleanicKeys({
            KeyW: function () {
                this.eye[0] -= +Math.cos(this.mouse.x) * this._speed
                this.eye[2] -= +Math.sin(this.mouse.x) * this._speed
            }.bind(this),
            KeyS: function () {
                this.eye[0] += +Math.cos(this.mouse.x) * this._speed
                this.eye[2] += +Math.sin(this.mouse.x) * this._speed
            }.bind(this),
            KeyA: function () {
                this.camR[0] = Math.cos(this.mouse.x) * this._speed
                this.camR[2] = Math.sin(this.mouse.x) * this._speed
                vec3.rotateY(this.camR, this.camR, [0, 1, 0], 90 * Math.PI / 180)
                this.eye[0] -= this.camR[0]
                this.eye[2] -= this.camR[2]
            }.bind(this),
            KeyD: function () {
                this.camR[0] = Math.cos(this.mouse.x) * this._speed
                this.camR[2] = Math.sin(this.mouse.x) * this._speed
                vec3.rotateY(this.camR, this.camR, [0, 1, 0], 90 * Math.PI / 180)
                this.eye[0] += this.camR[0]
                this.eye[2] += this.camR[2]
            }.bind(this),
            Space: function () {
                this.eye[1] += 1 * this._speed
            }.bind(this),
            ShiftLeft: function () {
                this.eye[1] -= 1 * this._speed
            }.bind(this)
        })
    }
    updateViewMatrix() {
        this.keys.update()
        this.mouse.y < -3.1 ? this.mouse.y = -3.1 : null
        this.mouse.y > -0.0001 ? this.mouse.y = -0.0001 : null
        this.forward[0] = +Math.sin(this.mouse.y) * Math.cos(this.mouse.x)
        this.forward[1] = -Math.cos(this.mouse.y);
        this.forward[2] = +Math.sin(this.mouse.y) * Math.sin(this.mouse.x)
        vec3.add(this.lookAt, this.eye, this.forward)
        mat4.lookAt(this.viewMatrix, this.eye, this.lookAt, [0, 1, 0]);
        return this.viewMatrix
    }
    onMouseMove(e) {
        this.mouse.x += e.movementX / this._sense
        this.mouse.y += e.movementY / this._sense
        this.aim.x += e.movementX
        this.aim.y += e.movementY
    }
    getProjectionMatrix() {
        this.w = this.gl.canvas.width
        this.h = this.gl.canvas.height
        if (this.mode)
            mat4.perspective(this.projMatrix, glMatrix.toRadian(this._fov), this.w / this.h, this._near, this._far);
        else
            mat4.ortho(this.projMatrix, (-1 * (this.w / 2)) / this._ortho, (1 * (this.w / 2)) / this._ortho, (-1 * (this.h / 2)) / this._ortho, (1 * (this.h / 2)) / this._ortho, - this._near * 4, this._far)
        return this.projMatrix
    }
    seePMatrix() {
        return this.projMatrix
    }
    updateMovement() {
        this.keys.update()
    }
    set fov(v) {
        this._fov = v
        this.onResize()
    }
    set sensivity(v) {
        this._sense = v
    }
    set speed(v) {
        this._speed = v
    }
    set ortho(v) {
        this._ortho = v
    }
}

