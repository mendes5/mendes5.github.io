//const ctx = document.createElement('canvas').getContext('webgl')
const c = document.createElement('canvas').getContext('webgl')
const debug = true
function getGL(size = [], options = {}) {

    let canvas
    if (size instanceof Array)
        canvas = document.createElement('canvas')
    else if (size instanceof String)
        canvas = document.getElementById('size')
    else if (size instanceof HTMLCanvasElement)
        canvas = size

    let gl = canvas.getContext('webgl', options.attributes)

    if (gl === undefined) {
        console.error('Your browser does not support webgl, please use an not outdated browser.')
        return null
    }
    if (options.clearColor) {
        let c = options.clearColor
        gl.clearColor(c[0], c[1], c[2], c[3])
    }
    if (options.depth)
        gl.enable(gl.DEPTH_TEST)
    if (options.cullFace)
        gl.enable(gl.CULL_FACE)

    gl.canvas.width = size[0]
    gl.canvas.height = size[1]
    gl.viewport(0, 0, size[0], [1])

    if (options.autoAppend)
        document.body.appendChild(gl.canvas)

    if (options.center)
        gl.canvas.style.margin = 'auto'

    debug && console.info('lib.js', gl.getContextAttributes())
    return gl
}

function makeShader(ctx = c, txt, type) {

    if (type === 'VERTEX_SHADER' || type === 'FRAGMENT_SHADER') {
        var shader = ctx.createShader(ctx[type])
    } else {
        console.error(`The string: ${type} is not a shader type`)
        return null
    }

    ctx.shaderSource(shader, txt);
    ctx.compileShader(shader);

    if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
        console.error(`ERROR compiling ${type} shader!`, ctx.getShaderInfoLog(shader));
        ctx.deleteShader(shader)
        return null
    }

    debug && console.info('lib.js:', ctx.getShaderInfoLog(shader))
    return shader
}


function createShaderProgram(ctx = c, vs, fs) {

    var program = ctx.createProgram()

    var vertexShader = makeShader(ctx, vs, 'VERTEX_SHADER')
    var fragmentShader = makeShader(ctx, fs, 'FRAGMENT_SHADER')

    ctx.attachShader(program, vertexShader);
    ctx.attachShader(program, fragmentShader);

    ctx.linkProgram(program);
    if (!ctx.getProgramParameter(program, ctx.LINK_STATUS)) {
        console.error('ERROR linking program!', ctx.getProgramInfoLog(program));
        ctx.deleteProgram(program)
        return null
    }

    ctx.validateProgram(program)
    if (!ctx.getProgramParameter(program, ctx.VALIDATE_STATUS)) {
        console.error('ERROR validating program!', ctx.getProgramInfoLog(program));
        ctx.deleteProgram(program)
        return null
    }

    debug && console.info('lib.js:', ctx.getProgramInfoLog(program))

    return program
}

function createArrayBuffer(ctx = c, data) {
    var buffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, buffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(data), ctx.DYNAMIC_DRAW);
    ctx.bindBuffer(ctx.ARRAY_BUFFER, null);
    buffer.length = data.length
    return buffer
}
id = 0
function initBuffer(ctx = c, prog, name, s) {

    let bufferData = [
        (Math.random() * 2) - 1, (Math.random() * 2) - 1, (Math.random() * 2) - 1, 1.0,
        (Math.random() * 2) - 1, (Math.random() * 2) - 1, (Math.random() * 2) - 1, 1.0,
        (Math.random() * 2) - 1, (Math.random() * 2) - 1, (Math.random() * 2) - 1, 1.0,
        (Math.random() * 2) - 1, (Math.random() * 2) - 1, (Math.random() * 2) - 1, 1.0,
        (Math.random() * 2) - 1, (Math.random() * 2) - 1, (Math.random() * 2) - 1, 1.0,
        (Math.random() * 2) - 1, (Math.random() * 2) - 1, (Math.random() * 2) - 1, 1.0,
    ]

    const buffer = createArrayBuffer(ctx, bufferData)

    buffer.id = id++
    buffer.name = s

    ctx.useProgram(prog)

    ctx.bindBuffer(ctx.ARRAY_BUFFER, buffer)
    let attrib = ctx.getAttribLocation(prog, name)
    ctx.vertexAttribPointer(attrib, 4, ctx.FLOAT, gl.FALSE, 0, 0)
    ctx.enableVertexAttribArray(attrib)
    ctx.bindBuffer(ctx.ARRAY_BUFFER, null)




    return { attrib, buffer }
}







