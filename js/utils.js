//I like of these as globals
const log = (...lod) => {
    lod.map(o => console.log(o))
}
Object.defineProperty(window, 'cls', {
    get(x, y, z) {
        console.clear()
    },
    set(x, y, z) {
        console.clear()
    }
});

(_ => {
    const selfStyle = document.createElement('style')
    selfStyle.textContent =
        `.domPrint{
        font-size:16px;
        font-family:"Segoe UI";
        margin:0px;
        padding:2px;
    }
    .domPrint > p{
        margin:2px;        
    }`
    document.head.appendChild(selfStyle)
})()

const domPrint = (title, text) => {
    const field = document.createElement('fieldset')
    field.className = 'domPrint'
    field.innerHTML = `<legend>${title}</legend><p>${text}</p>`
    document.body.appendChild(field)
}

const C$ = (str = 'html', all = false) => !all ? document.querySelector(str) : document.querySelectorAll(str);
const Sin = Math.sin
const Cos = Math.cos

const utils = (_ => {

    const toRadFactor = Math.PI / 180

    Math.toRad = (v) => v * toRadFactor
    Math.TWO_PI = Math.PI * 2

    const _canvas = document.createElement('canvas').getContext('2d')


    const getRandRGB = () => {
        _canvas.fillStyle = `hsl(${random(360)}, 100%, 50%)`
        return hexToRgb(_canvas.fillStyle.slice(1))
    }

    const getRandHEX = () => {
        _canvas.fillStyle = `hsl(${random(360)}, 100%, 50%)`
        return _canvas.fillStyle
    }

    //By 'David'
    //http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    const hexToRgb = (hex) => {
        const arrBuff = new ArrayBuffer(4);
        const vw = new DataView(arrBuff);
        vw.setUint32(0, parseInt(hex, 16), false);
        const arrByte = new Uint8Array(arrBuff);
        return [arrByte[1], arrByte[2], arrByte[3]]
    }

    let __;

    const arrayOf = (n = 1, s = 0) => new Array(n).fill(1).map(i => new s())

    const arrayBy = (n = 1, s = _ => 0) => new Array(n).fill(1).map(i => s())

    const range = (n, s = 0, f = 1) => new Array(n).fill(1).map(i => i = s += f)

    const UUID = (a = 4, b = 4) => new Array(a).fill(0).map(i => new Array(b).fill(0).map(e => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')).join('-')

    const random = (v) => Math.floor(Math.random() * v)

    const getTexture = url => {
        return fetch(url, { mode: 'no-cors' }).then(r => r.blob().then(r => {
            let tag = document.createElement('img')
            tag.src = URL.createObjectURL(r)
            return tag
        }))
    }

    //By 'Francisc'
    //http://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
    const randIntBetw = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

    const randomOf = (obj, _) => Array.isArray(obj) ? obj[randIntBetw(0, obj.length - 1)] : (_ = Object.keys(obj), obj[_[randIntBetw(0, _.length)]])
    
    const array2D = (r, c) => new Array(r).fill(0).map(i => i = new Array(c).fill(0))
    
    
    const extendContext2D = ctx => Object.assign(ctx, {
        clear() {
            this.clearRect(0, 0, this.canvas.width, this.canvas.height)
        },
        resize(w, h){
            this.canvas.width = w
            this.canvas.height = h
            return this
        },
        strokeCircle(x = 0, y = 0, r = 0) {
            this.beginPath()
            this.ellipse(x, y, r, r, 0, 0, Math.TWO_PI)
            this.stroke()
        },
        fillCircle(x = 0, y = 0, r = 0) {
            this.beginPath()
            this.ellipse(x, y, r, r, 0, 0, Math.TWO_PI)
            this.fill()
        },
        _circle(x = 0, y = 0, r = 0) {
            this.ellipse(x, y, r, r, 0, 0, Math.TWO_PI)
        }
    })


    const extendContext3D = gl => Object.assign(gl, {
        resize(x = 0, y = 0) {
            this.viewport(0, 0, x, y)
            this.canvas.width = x
            this.canvas.height = y
        },
        fitToScreen() {
            gl.viewport(
                0, 0,
                this.canvas.width = innerWidth,
                this.canvas.height = innerHeight
            )
        },
        fitToParent() {
            gl.viewport(
                0, 0,
                this.canvas.width = this.canvas.parentElement.clientWidth,
                this.canvas.height = this.canvas.parentElement.clientHeight
            )
        },
        getSize() {
            return [this.canvas.width, this.canvas.height]
        }
    })


    const extendCanvas = canvas => {
        canvas.resize = function (x = 0, y = 0) {
            this.width = x
            this.height = y
            return this
        }
        canvas.setParent = function(element = document.body){
            element.appendChild(canvas)
            return this
        }
        canvas.fitToParent = function () {
            this.width = this.parentElement.clientWidth
            this.height = this.parentElement.clientHeight
            return this
        }
        canvas.fitToScreen = function () {
            this.width = innerWidth
            this.height = innerHeight
            return this
        }
        canvas.get2D = function () {
            if (this.mode === undefined) {
                this.mode = 'CanvasRenderingContext2D'
                return extendContext2D(this.getContext('2d'))
            } else {
                console.error(`This canvas aleardy is an ${this.mode} and cannot be turned on a 'CanvasRenderingContext2D.`)
                console.error(this)
                return null
            }
        }
        canvas.getGL = function () {
            if (this.mode === undefined) {
                this.mode = 'WebGLRenderingContext'
                let gl = this.getContext('webgl')
                if (!gl) {
                    console.error('WebGL not supported in this browser.')
                    return null
                }
                return extendContext3D(gl)
            } else {
                console.error(`This canvas aleardy is an ${this.mode} and cannot be turned on a 'WebGLRenderingContext.`)
                console.error(this)
                return null
            }
        }
        canvas.getGL2 = function () {
            if (this.mode === undefined) {
                this.mode = 'WebGL2RenderingContext'
                let gl2 = this.getContext('webgl2')
                if (!gl2) {
                    console.error('WebGL 2 not supported in this browser version.')
                    return null
                }
                return extendContext3D(gl2)
            } else {
                console.error(`This canvas aleardy is an ${this.mode} and cannot be turned on a 'WebGL2RenderingContext.`)
                console.error(this)
                return null
            }
        }
        return canvas
    }

    const getCanvas = {
        fromId(id) {
            const canvas = C$(id)
            return extendCanvas(canvas)
        },
        fromClass(name, index = 0) {
            const canvas = C$(name, true)
            return extendCanvas(canvas[index])
        },
        creatingIt() {
            const canvas = document.createElement('canvas')
            return extendCanvas(canvas)
        }
    }

    const getText = (url) => fetch(url, { mode: 'no-cors' }).then(r => r.text())

    const getJSON = (url) => fetch(url, { mode: 'no-cors' }).then(r => r.json())

    const getBlob = (url) => fetch(url, { mode: 'no-cors' }).then(r => r.blob())

    const getArrayBuffer = (url) => fetch(url, { mode: 'no-cors' }).then(r => r.arrayBuffer())

    //Copied from mozilla docs
    //https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
    const flatten = arr => arr.reduce((a, b) => a.concat(b))

    //By 'jolly.exe'
    //http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
    const getParameterByName = (name, url) => {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    const utilData = {
        textFormats: ['txt', 'glsl'],
        imageFormats: ['png', 'bmp', 'gif', 'jpg', 'jpeg'],
        videoFormats: ['mov', 'webm', 'mp4', 'swf'],
        audioFormats: ['mp3', 'ogg', 'wav'],
        parseableFormats: ['js', 'css', 'html'],
        deniedFormats: [],
    }

    const loadScript = (url) => {
        return new Promise((res, rej) => {
            const script = document.createElement('script')
            script.src = url
            document.body.appendChild(script)
            script.onerror = e => rej(e)
            script.onload = e => res(e)
        })
    }

    const pixelToGlCoord = (event, canvas) => {
        var x = event.clientX, y = event.clientY;
        var midX = canvas.width / 2, midY = canvas.height / 2;
        var rect = event.target.getBoundingClientRect();
        x = ((x - rect.left) - midX) / midX;
        y = (midY - (y - rect.top)) / midY;
        return { x, y }
    }

    const getE3ShaderData = (str) => {
        let shaderData = { uniform: [], in: [] }
        let data = str.match(/in.*;|uniform.*;/g)
        data && data.map(item => {
            let [input, type, name] = item.split(' ')
            name = name.slice(0, name.length - 1)
            shaderData[input].push(new ShaderDescriptor(name, type))
        })
        shaderData.isVertexShader = /gl_Position/.test(str)
        return shaderData
    }

    const getE2ShaderData = (str) => {
        let shaderData = { uniform: {}, attribute: {} }
        let data = str.match(/attribute.*;|uniform.*;/g)
        data && data.map(item => {
            let [type1, type2, name] = item.split(' ')
            name = name.slice(0, name.length - 1)
            shaderData[type1][name] = {}
            shaderData[type1][name].location = name
            shaderData[type1][name].type = type2
        })
        shaderData.isFragmentShader = /gl_FragColor/.test(str)
        shaderData.isVertexShader = /gl_Position/.test(str)
        return shaderData
    }

    const loadAll = (obj = {}) => {
        let resolved = {}
        // iDontKnowHowToNameThis é um objeto que lembra os 'index' dos itens para 
        //coloca-los de volta em um objeto igual o da 
        //entrada e que sera usado para criar um outro objeto quando a Promisse for
        //resolvida   
        let iDontKnowHowToNameThis = {}
        let promisseArray = []
        let keys = Object.keys(obj)

        for (let i of Object.keys(obj)) {
            let path = obj[i]
            let ext = getFileExtension(path)
            if (isEqualToAny(ext, utilData.textFormats)) {
                iDontKnowHowToNameThis[i] = promisseArray.push(getText(path)) - 1
            } else if (isEqualToAny(ext, utilData.audioFormats)) {
                iDontKnowHowToNameThis[i] = promisseArray.push(Url2Tag(path, 'audio')) - 1
            } else if (isEqualToAny(ext, utilData.videoFormats)) {
                iDontKnowHowToNameThis[i] = promisseArray.push(Url2Tag(path, 'video')) - 1
            } else if (isEqualToAny(ext, utilData.imageFormats)) {
                iDontKnowHowToNameThis[i] = promisseArray.push(Url2Tag(path, 'image')) - 1
            } else if (isEqualToAny(ext, utilData.parseableFormats)) {
                iDontKnowHowToNameThis[i] = promisseArray.push(Url2Tag(path, 'script')) - 1
            } else if (isEqualToAny(ext, utilData.deniedFormats)) {
                throw new Error('u got a virus m9.')
            } else if (ext === 'json') {
                iDontKnowHowToNameThis[i] = promisseArray.push(getJSON(path)) - 1
            }
        }
        return Promise.all(promisseArray).then(data => {
            for (let i of Object.keys(iDontKnowHowToNameThis)) {
                resolved[i] = data[iDontKnowHowToNameThis[i]]
            }
            return resolved
        })
    }
    //Modified version, by 'adnasa'
    //https://gist.github.com/adnasa/94e26f50082454910657
    const getFileExtension = (filePath = '') => {
        const ext = filePath.split('.')
        return ext[ext.length - 1]
    }

    const isEqualToAny = (input, items = []) => {
        let res = false
        items.map(_i_ => !res && (res = (_i_ === input)))
        return res
    }
    const contains = (arr, value)=>{
        let res = false
        arr.map(val => val === value && (res = true))
        return res
    }
    const hasAllStrings = (input, strArr = []) => {
        let res = true
        strArr.map(val => !input.includes(val) && (res = false))
        return res
    }

    const extensionToMediaType = (name) => {
        if (isEqualToAny(name, utilData.videoFormats))
            return 'video'
        else if (isEqualToAny(name, utilData.audioFormats))
            return 'audio'
        else if (isEqualToAny(name, utilData.parseableFormats))
            return 'script'
        else if (isEqualToAny(name, utilData.imageFormats))
            return 'image'
        else return 'none'
    }

    //Magic
    const Url2Tag = (url, type) => {
        let result;
        const ext = type || extensionToMediaType(getFileExtension(url))
        switch (ext.toLowerCase()) {
            case 'audio':
                result = fetch(url, { mode: 'no-cors' }).then(r => r.blob().then(r => {
                    let uri = URL.createObjectURL(r)
                    let tag = document.createElement('audio')
                    tag.src = uri
                    return tag
                }))
                break;
            case 'video':
                result = fetch(url, { mode: 'no-cors' }).then(r => r.blob().then(r => {
                    let uri = URL.createObjectURL(r)
                    let tag = document.createElement('video')
                    tag.src = uri
                    return tag
                }))
                break;
            case 'image':
                result = fetch(url, { mode: 'no-cors' }).then(r => r.blob().then(r => {
                    let uri = URL.createObjectURL(r)
                    let tag = document.createElement('img')
                    tag.src = uri
                    return tag
                }))
                break;
            case 'script':
                result = fetch(url, { mode: 'no-cors' }).then(r => r.blob().then(r => {
                    let uri = URL.createObjectURL(r)
                    let tag = document.createElement('script')
                    tag.src = uri
                    return tag
                }))
                break;
            default:
                console.warn(`Unknow format ${ext}.`)
                break;
        }
        return result;
    }

    /*Usage:
    new KeyListener({
        'KeyW':{
            press(){player.jump()},
            release(){ player.speed = 0; player.direction = -1}
        }
    } ,gl.canvas)*/
    class KeyListener {
        constructor(obj, element = window) {
            element.addEventListener('keyup', this.keyUp.bind(this), false);
            element.addEventListener('keydown', this.keyDown.bind(this), false);
            this.elememt = element
            this.keys = {}
            for (let key in obj) {
                this.keys[key] = {
                    isDown: false,
                    press: obj[key].press,
                    release: obj[key].release
                }
            }
        }
        keyUp(e) {
            if (this.keys[e.code] && this.keys[e.code].isDown) {
                e.preventDefault()
                this.keys[e.code].isDown = false
                this.keys[e.code].release && this.keys[e.code].release()
            }
        }
        keyDown(e) {
            if (this.keys[e.code] && !this.keys[e.code].isDown) {
                e.preventDefault()
                this.keys[e.code].isDown = true
                this.keys[e.code].press && this.keys[e.code].press()
            }
        }
        detach() {
            this.elememt.removeEventListener('keydown', this.keyDown, false)
            this.elememt.removeEventListener('keyup', this.keyUp, false)
        }
    }

    /*Usage
    const keys = new BooleanicKeys({
        'KeyW'(dt){player.x+=10*dt}
    },gl.canvas) 
    
    let loop = (dt)=>{
        //paramter is optional
        keys.update(dt)
    }
     */
    class BooleanicKeys {
        constructor(obj, element = window) {
            element.addEventListener('keyup', this.keyUp.bind(this), false);
            element.addEventListener('keydown', this.keyDown.bind(this), false);
            this.elememt = element
            this.keys = {}
            for (let key in obj) {
                this.keys[key] = {
                    isDown: false,
                    press: obj[key],
                }
            }
        }
        keyUp(e) {
            if (this.keys[e.code] && this.keys[e.code].isDown) {
                e.preventDefault()
                this.keys[e.code].isDown = false
            }
        }
        keyDown(e) {
            if (this.keys[e.code] && !this.keys[e.code].isDown) {
                e.preventDefault()
                this.keys[e.code].isDown = true
            }
        }
        update(val) {
            for (let key in this.keys) {
                this.keys[key].isDown && this.keys[key].press(val)
            }
        }
        detach() {
            this.elememt.removeEventListener('keydown', this.keyDown, false)
            this.elememt.removeEventListener('keyup', this.keyUp, false)
        }
    }

    async function loadJSON() {
        return await fetch('test.json').then(r => r.json())
    }

    let loop = fn => {
        let handle;
        let stoped = false;
        let lp = function (dt) {
            fn(dt)
            handle = requestAnimationFrame(lp)
        }
        lp()
        let result = {
            stop: _ => cancelAnimationFrame(handle),
            play: _ => lp(),
            toggle: _ => (stoped = !stoped) ? result.stop() : result.play()
        }
        return result
    }

    let playFromSoundCloud = async function (url) {
        let audio = new Audio()
        audio.crossOrigin = "anonymous"
        let link = `https://api.soundcloud.com/resolve.json?url=${encodeURIComponent(url)}&client_id=17a992358db64d99e492326797fff3e8`
        let result = await fetch(link).then(res => res.json()).then(json => json)
        audio.src = `http://api.soundcloud.com/tracks/${result.id}/stream?client_id=17a992358db64d99e492326797fff3e8`
        audio.play()

        return { audio, result }
    }
   const Grid2DIterator = (x, y, fn) => {
       x--
       y--
        for(let ny = 0; ny <= y; ny ++){
            for(let nx = 0; nx <= x; nx ++){
                fn(nx, ny)
            }
        }
   }
    
    
    return Object.assign({
        Grid2DIterator,
        extendCanvas,
        extendContext2D,
        extendContext3D,
        getRandRGB,
        getRandHEX,
        hexToRgb,
        range,
        UUID,
        random,
        randIntBetw,
        getCanvas,
        getText,
        getJSON,
        getBlob,
        getArrayBuffer,
        flatten,
        getParameterByName,
        loadScript,
        pixelToGlCoord,
        getE3ShaderData,
        getE2ShaderData,
        loadAll,
        getFileExtension,
        isEqualToAny,
        hasAllStrings,
        Url2Tag,
        KeyListener,
        BooleanicKeys,
        loadJSON,
        loop,
        arrayOf,
        arrayBy,
        randomOf,
        playFromSoundCloud,
        getTexture,
        contains,
        array2D,
    }, {
            //By 'Keith Peters' 2007 (colorized)
            //https://github.com/bit101
            lerp: (norm, min, max) => (max - min) * norm + min,
            norm: (value, min, max) => (value - min) / (max - min),
            distance: (p0, p1) => Math.sqrt(p1.x - p0.x ** 2 + p1.y - p0.y ** 2),
            distanceXY: (x0, y0, x1, y1) => Math.sqrt(x1 - x0 ** 2 + y1 - y0 ** 2),
            circleCollision: (c0, c1) => utils.distance(c0, c1) <= c0.radius + c1.radius,
            inRange: (value, min, max) => value >= Math.min(min, max) && value <= Math.max(min, max),
            clamp: (value, min, max) => Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max)),
            circlePointCollision: (x, y, circle) => utils.distanceXY(x, y, circle.x, circle.y) < circle.radius,
            pointInRect: (x, y, rect) => utils.inRange(x, rect.x, rect.x + rect.width) && utils.inRange(y, rect.y, rect.y + rect.height),
            map: (value, sourceMin, sourceMax, destMin, destMax) => utils.lerp(utils.norm(value, sourceMin, sourceMax), destMin, destMax),
            rangeIntersect: (min0, max0, min1, max1) => Math.max(min0, max0) >= Math.min(min1, max1) && Math.min(min0, max0) <= Math.max(min1, max1),
            rectIntersect: (r0, r1) => utils.rangeIntersect(r0.x, r0.x + r0.width, r1.x, r1.x + r1.width) && utils.rangeIntersect(r0.y, r0.y + r0.height, r1.y, r1.y + r1.height),
        })
})()
