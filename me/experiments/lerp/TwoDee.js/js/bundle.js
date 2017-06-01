const canvas = document.querySelector('#c')
canvas.width = innerWidth
canvas.height = innerHeight
const gl = TwoDee.gl.state(canvas)
let ease = 0.6

class Ball {
    constructor(leader) {
        this.leader = leader
        this.sprite = new gl.sprite(random(100), random(100), [Math.random() + 0.08, Math.random() + 0.08, Math.random() + 0.08, 1])
        this.x = 0
        this.y = 0
    }
    draw() {
        this.x += parseInt(this.leader.x - this.x) * ease 
        this.y += parseInt(this.leader.y - this.y) * ease 
        this.sprite._dirty = true
        this.sprite._rotation.deg = this.x / 100
        this.sprite._position.x = this.x
        this.sprite._position.y = this.y
        this.sprite.render()
    }
}

let target = { x: 0, y: 0 }

let b = new Ball(target);
let last = b;

let balls = []

range(100).map(_ => {
    last = new Ball(last)
    balls.push(last)
})

canvas.onmousemove = e => {
    target.x = e.x
    target.y = e.y
}
let frameHanle = 0

let update = _ => {
    gl.clear()
    b.draw()
    balls.forEach(i => i.draw())
    frameHanle = requestAnimationFrame(update)
}

document.body.onmouseover = _ => {
    update()
}
document.body.onmouseleave = _ => {
    cancelAnimationFrame(frameHanle)
}