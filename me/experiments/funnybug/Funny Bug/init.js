let vShader,fShader,vShader2,fShader2;
const main = document.createElement('script')
main.src = './main.js'
Promise.all([getText('./shaders/test.vert.glsl'), getText('./shaders/test.frag.glsl'),getText('./shaders/bView.vert.glsl'), getText('./shaders/bView.frag.glsl')]).then(shaders => {
    vShader = shaders[0]
    fShader = shaders[1]
    vShader2 = shaders[2]
    fShader2 = shaders[3]
    document.body.appendChild(main)
})