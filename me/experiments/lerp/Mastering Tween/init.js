let cnv2 = document.createElement('canvas')
let cnv1 = document.getElementById('canvas')

let ctx2 = cnv2.getContext('2d')
let ctx1 = cnv1.getContext('2d')

let halfW, w, halfH, h

let balls = [], master = {
    x: 500, y: 100, draw() {

    }
};

let state = {
    ease: 0.87,
    alpha: 0.80,
    speed: 0.1
}
let ui = new dat.GUI()

ui.add(state, 'ease', 0.01, 1)
ui.add(state, 'alpha', 0, 1)
ui.add(state, 'speed', 0.001, 0.1)

onresize = _ => {
    halfW = (w = cnv2.width = cnv1.width = innerWidth) / 2
    halfH = (h = cnv2.height = cnv1.height = innerHeight) / 2
}

onresize()
let c = 0
class ball {
    constructor(m) {
        this.color = c++
        this.master = m
        this.x = halfH
        this.y = halfW
    }
    draw() {
        ctx1.fillStyle = `hsl(${this.color},100%,50%)`
        ctx1.fillRect(
            (this.x += (this.master.x - this.x) * state.ease) - 5,
            (this.y += (this.master.y - this.y) * state.ease) - 5,
            10, 10
        )
    }
}

function getTween(b, e, i) {
    return b + ((i / 1) * (e - b));
}

let v = 0

let main = {
    lerp: 0,
    x: halfW,
    y: halfH,
    sx: halfW,
    sy: halfH,
    test() {
        this.x = getTween(this.sx, master.x, this.lerp += state.speed)
        this.y = getTween(this.sy, master.y, this.lerp)
        if ((this.x - master.x) < 50 && -50 < (this.x - master.x)) {
            if ((this.y - master.y) < 50 && -50 < (this.y - master.y)) {
                this.lerp = 0
                master.x = Math.random() * w
                master.y = Math.random() * h
                this.sx = this.x
                this.sy = this.y
            }
        }
    }
}
let last = main
let tick = 0

for (let x = 0; x < 360; x++) {
    last = new ball(last)
    balls.push(last)
}
let frameHanle = 0;
update = _ => {
    ctx2.globalAlpha = state.alpha;
    ctx2.clearRect(0, 0, w, h);
    ctx2.drawImage(cnv1, 0, 0);
    ctx1.clearRect(0, 0, w, h);
    ctx1.drawImage(cnv2, 0, 0);
    main.test()
    master.draw()
    balls.map(m => m.draw())
    frameHanle = requestAnimationFrame(update)
}

document.body.onmouseover = _ => {
    update()
}
document.body.onmouseleave = _ => {
    cancelAnimationFrame(frameHanle)
}