const ctx = createCanvas()

ctx.fillRect(0, 0, 10, 10)

const target = { x: 0, y: 0 }

let ease = 0.5

onmousemove = e => {
    target.x = e.x
    target.y = e.y
}
let ids = 0
class Ball {
    constructor(leader) {
        this.leader = leader
        this.id = ids++
        this.x = 0
        this.y = 0
    }
    draw() {
        this.x += (this.leader.x - this.x) * ease
        this.y += (this.leader.y - this.y) * ease
        if (mode) {
            ctx.moveTo(this.x, this.y)
            ctx.lineTo(this.leader.x, this.leader.y)
        } else {
            ctx.fillStyle = `hsl(${this.id * 2}, 100%, 50%)`
            ctx.circle(this.x, this.y, 20)
        }
    }
}

let mode = false
let b = new Ball(target);
let last = b;
let balls = []

ctx.lineWidth = 5

range(180).map(_ => {
    last = new Ball(last)
    balls.push(last)
})

let state = false
onwheel = _ => {
    balls.map(b => {
        b.x = random(innerWidth)
        b.y = random(innerHeight)
    })
}

onclick = _ => {
    if (state = !state) {
        b.leader = balls[179]
    } else {
        b.leader = target
    }
}

let speed = overlays.range(1, 100, e => {
    ease = e.srcElement.value / 100
})

const update = function () {
    ctx.clear()
    mode && ctx.beginPath()
    b.draw()
    balls.map(i => i.draw())
    mode && ctx.stroke()
    requestAnimationFrame(update)
}
update()