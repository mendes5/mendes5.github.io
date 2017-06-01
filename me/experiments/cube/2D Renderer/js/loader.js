/*
//No gl Matrix
var m3 = {
    projection(out, width, height) {
        out[0] = 2 / width
        out[4] = -2 / height
        out[6] = -1
        out[7] = 1
        out[8] = 1
    },
    create(){
        return [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1 
        ]
    },
    identity(out) {
        out[0] = 1, out[1] = 0, out[2] = 0
        out[3] = 0, out[4] = 1, out[5] = 0
        out[6] = 0, out[7] = 0, out[8] = 1
    },
    translation(out, tx, ty) {
        out[0] = 1, out[1] = 0, out[2] = 0
        out[3] = 0, out[4] = 1, out[5] = 0
        out[6] = tx, out[7] = ty, out[8] = 1
    },

    rotation(out, rd) {
        const c = Math.cos(rd);
        const s = Math.sin(rd);

        out[0] = c, out[1] = -s, out[2] = 0
        out[3] = s, out[4] = c, out[5] = 0
        out[6] = 0, out[7] = 0, out[8] = 1
    },

    scaling(sx, sy) {
        out[0] = sx, out[1] = 0, out[2] = 0
        out[3] = 0, out[4] = sy, out[5] = 0
        out[6] = 0, out[7] = 0, out[8] = 1
    },
    cast: 1,
    multiply(a, b) {
        var a00 = a[0 * 3 + 0];
        var a01 = a[0 * 3 + 1];
        var a02 = a[0 * 3 + 2];
        var a10 = a[1 * 3 + 0];
        var a11 = a[1 * 3 + 1];
        var a12 = a[1 * 3 + 2];
        var a20 = a[2 * 3 + 0];
        var a21 = a[2 * 3 + 1];
        var a22 = a[2 * 3 + 2];
        var b00 = b[0 * 3 + 0];
        var b01 = b[0 * 3 + 1];
        var b02 = b[0 * 3 + 2];
        var b10 = b[1 * 3 + 0];
        var b11 = b[1 * 3 + 1];
        var b12 = b[1 * 3 + 2];
        var b20 = b[2 * 3 + 0];
        var b21 = b[2 * 3 + 1];
        var b22 = b[2 * 3 + 2];

        return [
            b00 * a00 + b01 * a10 + b02 * a20,
            b00 * a01 + b01 * a11 + b02 * a21,
            b00 * a02 + b01 * a12 + b02 * a22,

            b10 * a00 + b11 * a10 + b12 * a20,
            b10 * a01 + b11 * a11 + b12 * a21,
            b10 * a02 + b11 * a12 + b12 * a22,

            b20 * a00 + b21 * a10 + b22 * a20,
            b20 * a01 + b21 * a11 + b22 * a21,
            b20 * a02 + b21 * a12 + b22 * a22,
        ];
    },
    translate(m, tx, ty) {
        return m3.multiply(m, m3.translation(tx, ty));
    },

    rotate(m, angleInRadians) {
        return m3.multiply(m, m3.rotation(angleInRadians));
    },

    scale(m, sx, sy) {
        return m3.multiply(m, m3.scaling(sx, sy));
    },
};





console.info('Math Module Loaded.')
*/