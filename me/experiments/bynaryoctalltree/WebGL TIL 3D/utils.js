

    const _canvas = document.createElement('canvas').getContext('2d')

    const getRandColor = ()=>{
        _canvas.fillStyle = `hsl(${random(360)}, 100%, 50%)`
    }

    const range = (n, s = 0, f = 1) => new Array(n).fill(1).map(i => i = s += f)

    const random = (v) => Math.floor(Math.random() * v)

    const randBetw = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

    const getText = (url) => fetch(url, { mode: 'no-cors' }).then(r => r.text())

    const getJSON = (url) => fetch(url, { mode: 'no-cors' }).then(r => r.json())

    const getBlob = (url) => fetch(url, { mode: 'no-cors' }).then(r => r.blob())

    const getArrayBuffer = (url) => fetch(url, { mode: 'no-cors' }).then(r => r.arrayBuffer())

    const flatten = arr => arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatten(val) : val), [])

    const utilData = {
        textFormats: ['txt', 'glsl'],
        imageFormats: ['png', 'bmp', 'gif', 'jpg', 'jpeg', 'png-LARGE'],
        videoFormats: ['mov', 'webm', 'mp4', 'swf'],
        audioFormats: ['mp3', 'ogg', 'wav'],
        parseableFormats: ['js', 'css', 'html'],
        deniedFormats: [],
    }

    const loadScript = (url) => {
        let script = document.createElement('script')
        script.src = './main.js'
        document.body.appendChild(script)
    }

    const pixelToGlCoord = (event, canvas) => {
        var x = event.movementX, y = event.movementY;
        var midX = canvas.width / 2, midY = canvas.height / 2;
        var rect = event.target.getBoundingClientRect();
        x = ((x - rect.left) - midX) / midX;
        y = (midY - (y - rect.top)) / midY;
        return { x, y }
    }

    const getShaderData = (str) => {
        let shaderData = { uniform: {}, attribute: {} }
        srt.match(/attribute.*;|uniform.*;/g).map(item => {
            let [type1, type2, name] = item.split(' ')
            shaderData[type1][name] = {}
            shaderData[type1][name].location = name
            shaderData[type1][name].type = type
        })
        return shaderData
    }

    const loadAll = (obj = {}) => {
        let resolved = {}
        let buffer = {}
        let proArray = []
        let keys = Object.keys(obj)

        for (let i of Object.keys(obj)) {
            let path = obj[i]
            let ext = A.gfe(path)
            if (A.ieta(ext, utilData.textFormats)) {
                buffer[i] = proArray.push(getText(path)) - 1
            } else if (A.ieta(ext, utilData.audioFormats)) {
                buffer[i] = proArray.push(getURI(path, 'audio')) - 1
            } else if (A.ieta(ext, utilData.videoFormats)) {
                buffer[i] = proArray.push(getURI(path, 'video')) - 1
            } else if (A.ieta(ext, utilData.imageFormats)) {
                buffer[i] = proArray.push(getURI(path, 'image')) - 1
            } else if (A.ieta(ext, utilData.parseableFormats)) {
                buffer[i] = proArray.push(getURI(path, 'script')) - 1
            } else if (A.ieta(ext, utilData.deniedFormats)) {
                throw new Error('Copy your entire folder and send to fernando.devmines@gmail.com coz u got a viruz m8.')
            } else if (ext === 'json') {
                buffer[i] = proArray.push(getJSON(path)) - 1
            }
        }

        return Promise.all(proArray).then(data => {
            for (let i of Object.keys(buffer)) {
                resolved[i] = data[buffer[i]]
            }
            return resolved
        })
    }

    const getFileExtension = (filePath = '') => {
        const ext = filePath.split('.')
        return ext[ext.length - 1]
    }


    const isEqualToAny = (input, items = []) => {
        let res = false
        items.map(i => !res && (res = i === input))
        return res
    }

    const hasAllStrs = (input, strArr = []) => {
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

    const A = {
        gfe: getFileExtension,
        ieta: isEqualToAny,
    }

    const getURI = (url, type) => {
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
                return new Error(`Unknow format ${ext}.`)
                break;
        }
        return result;
    }

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
        update() {
            for (let key in this.keys) {
                this.keys[key].isDown && this.keys[key].press()
            }
        }
        detach() {
            this.elememt.removeEventListener('keydown', this.keyDown, false)
            this.elememt.removeEventListener('keyup', this.keyUp, false)
        }
    }
    
