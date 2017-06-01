let ctx = document.createElement('canvas')
let gl = ctx.getContext('webgl')
document.body.appendChild(ctx)
ctx.width = 600
ctx.height = 600;
gl.viewport(0, 0, 600, 600);
gl.clearColor(0.1, 0.1, 0.1, 1.0)
let vShaderSource = 
`precision mediump float;
attribute vec3 aColor;
attribute vec2 aPosition;
varying vec3 fColor;
void main(){
    fColor = aColor;
    gl_Position = vec4(aPosition, 1.0, 1.0);
}`
let fShaderSource = 
`precision mediump float;
varying vec3 fColor;
void main(){
    gl_FragColor = vec4(fColor, 1.0);
}`
let vShaderObject = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(vShaderObject, vShaderSource)
gl.compileShader(vShaderObject)
if (!gl.getShaderParameter(vShaderObject, gl.COMPILE_STATUS)) 
    console.error(gl.getShaderInfoLog(vShaderObject));
let fShaderObject = gl.createShader(gl.FRAGMENT_SHADER)
gl.shaderSource(fShaderObject, fShaderSource)
gl.compileShader(fShaderObject)
if (!gl.getShaderParameter(fShaderObject, gl.COMPILE_STATUS)) 
    console.error(gl.getShaderInfoLog(fShaderObject));
let program = gl.createProgram()
gl.attachShader(program, vShaderObject)
gl.attachShader(program, fShaderObject)
gl.linkProgram(program)
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) 
    console.error(gl.getProgramInfoLog(program));
gl.useProgram(program)
let positionBufferData = [
    0.0, 0.9,
    -0.9, -0.9,
    0.9, -0.9
]
let positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionBufferData), gl.STATIC_DRAW)
let aPosition = gl.getAttribLocation(program, 'aPosition')
gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, gl.FALSE, 0, 0)
gl.enableVertexAttribArray(aPosition)
let colorBufferData = [
    0.0, 0.0, 1.0,
    0.0, 1.0, 0.0,
    1.0, 0.0, 0.0
]
let colorBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorBufferData), gl.STATIC_DRAW)
let aColor = gl.getAttribLocation(program, 'aColor')
gl.vertexAttribPointer(aColor, 3, gl.FLOAT, gl.FALSE, 0, 0)
gl.enableVertexAttribArray(aColor)
gl.clear(gl.COLOR_BUFFER_BIT)
gl.drawArrays(gl.TRIANGLES, 0, 3)