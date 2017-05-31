const canvas = C$("canvas")
let frameHandle;
onresize = _ => {
    canvas.width = innerWidth
    canvas.height = innerHeight
}
onresize()

const ctx = canvas.getContext("2d");

ctx.circle = (x = 0, y = 0, r = 5) => {
    ctx.beginPath()
    ctx.ellipse(x, y, r, r, 0, 0, Math.TWO_PI)
    ctx.fill()
}

let ids = 1;

class DotTicker {
    constructor() {
        this.x = utils.randIntBetw(50, innerWidth - 50)
        this.y = utils.randIntBetw(50, innerHeight - 50)

        this.radius = 500
        this._radius = utils.randIntBetw(5, 20)

        this.vx = utils.randIntBetw(-2, 2)
        this.vy = utils.randIntBetw(-2, 2)

        this.id = ids++
    }

    line() {
        for (let dot of dots) {
            ctx.moveTo(this.x, this.y)
            ctx.lineTo(dot.x, dot.y)
        }
    }
    tick() {
        this.x += (this.x > innerWidth || this.x < 0 ? this.vx = -this.vx : this.vx)
        this.y += (this.y > innerHeight || this.y < 0 ? this.vy = -this.vy : this.vy)
        ctx.circle(this.x, this.y, this._radius)
    }
}

const dots = utils.arrayOf(13, DotTicker)

ctx.fillStyle = "#c0c0c0"
ctx.strokeStyle = "rgba(30,30,30,0.1)"

const s = new DotTicker()

const rColor = utils.randomOf([
    "#F3A94C","#FF2D80",
    "#FFFC9B","#401063",
    "#F870B1","#F42C29",
    "#E6ECEF","#F4D53E",
    "#8AE1FF","#0593E0",
    "#D291EB","#6ADE51",
])

let l = utils.loop(_ => {
    ctx.fillStyle = "#c0c0c0"
    ctx.clearRect(0, 0, innerWidth, innerHeight)
    ctx.beginPath()
    dots.map(i => i.line())
    ctx.stroke()
    dots.map(i => i.tick())
    ctx.fillStyle = rColor
    ctx.beginPath()
    s.line()
    ctx.stroke()
    s.tick()
})
