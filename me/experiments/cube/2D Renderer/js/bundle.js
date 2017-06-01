document.body.style.margin = '0px'
document.body.style.overflow = 'hidden'

let gl = document.querySelector('#c').getContext('webgl2')
gl.canvas.width = innerWidth
gl.canvas.height = innerHeight
gl.canvas.style.display = 'block'
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
gl.clearColor(0, 0, 0, 1)

let TK = GL_ToolKit(gl)

let shaderProgram = TK.shaderProgram(`#version 300 es
precision mediump float;
uniform mat4 mProj;
uniform mat4 mView;
uniform mat4 mWorld;
uniform mat4 mScale;

in vec2 aTexUV;
in vec4 aPos;

out vec4 fColor;
out vec2 fTexUV;

void main(){
  fTexUV = aTexUV;
	gl_Position = mProj * mView * mWorld * mScale * aPos;
}`
  ,
  `#version 300 es
precision mediump float;
 
in vec2 fTexUV;
uniform sampler2D u_texture;
 
out vec4 outColor;
 
void main() {
   outColor = texture(u_texture, fTexUV);
}`)

const camera = new Camera(gl, 300, { near: 0.01, far: 1000, type: 'perspective', speed: 0.1, startPos: [0, 0, -10], lookAt: [4.7, -1.60] })

shaderProgram.use()
shaderProgram.uniforms.mProj = camera.getProjectionMatrix()
shaderProgram.uniforms.mView = camera.updateViewMatrix()
shaderProgram.uniforms.mWorld = mat4.create()
shaderProgram.uniforms.mScale = mat4.create()
shaderProgram.uniforms.u_texture = 0


let main;
gl.enable(gl.DEPTH_TEST)
let s = { a: false }
/*

let vid = Url2Tag('/how 2 montage.mp4').then(r =>{ s.a = r, s.a.play()})
*/

/*
navigator.getUserMedia({video:true}, function (stream) {
  var video = document.createElement('video');
  video.src = window.URL.createObjectURL(stream);

  video.onloadedmetadata = function (e) {
    s.a = video
  };
}, a=>{
  console.error(1)
});
*/

loadAll({
  dat: './cube.json'
}).then(t => {
  main = new MeshRenderer(gl, {
    vertices: t.dat.vertices.map(i => i *= 100),
    indices: t.dat.indices,
    uvs: t.dat.uvs,
    normals: t.dat.normals,
    url: './textures/uv2.jpg',
  }, shaderProgram.program)

  main2 = new MeshRenderer(gl, {
    vertices: t.dat.vertices,
    indices: t.dat.indices,
    uvs: t.dat.uvs,
    normals: t.dat.normals,
    url: './textures/original.png',
  }, shaderProgram.program)

  function frame(dt) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    shaderProgram.uniforms.mProj = vm = camera.seePMatrix()
    shaderProgram.uniforms.mView = pm = camera.updateViewMatrix()
    main.render(vm, pm)
    main2.render(vm, pm)
    main2.setTexture(gl.canvas)
     
    requestAnimationFrame(frame)
  }
  frame()
})

