class KeySet {
    constructor(element = window, detectMode = 'code'){
        element.addEventListener('keyup', this.keyUp.bind(this), false);
        element.addEventListener('keydown', this.keyDown.bind(this), false);
        this.elememt = element
        this.helper = false
        this.keys = {}
        this.detectMode = detectMode
        this.map = undefined
    }
    keyUp(e){
        if(this.keys[e[this.detectMode]] && this.keys[e[this.detectMode]].isDown){
            e.preventDefault()
            this.keys[e[this.detectMode]].isDown = false
            this.keys[e[this.detectMode]].release && this.keys[e[this.detectMode]].release()
        }
    }
    keyDown(e){
        if(this.keys[e[this.detectMode]] && ! this.keys[e[this.detectMode]].isDown){
            e.preventDefault()
            this.keys[e[this.detectMode]].isDown = true
            this.keys[e[this.detectMode]].press && this.keys[e[this.detectMode]].press()
        }
        this.helper ? KeySet.helper(e) : 0
    }
    bindGroupToMap(map, group, overwrite){
        overwrite ? this.keys = {} : null
        this.map = map
        for(let key in map){
            this.keys[map[key]] = {
                isDown:false,
                press:group[key].press,
                release:group[key].release
            }
        }
    }
    disable(){
        this.elememt.removeEventListener('keydown',this.keyDown,false)
        this.elememt.removeEventListener('keyup',this.keyUp,false)
    }
    reenable(){
        this.elememt.addEventListener('keydown',this.keyDown,false)
        this.elememt.addEventListener('keyup',this.keyUp,false)
    }
    static helper(e){
        console.log('code: "' + e.code + '", key: "' + e.key + '", keyCode: "' + e.keyCode + '".')
    }
}