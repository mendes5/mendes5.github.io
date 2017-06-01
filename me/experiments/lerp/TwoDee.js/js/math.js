class M3 {
    static identity(m) {
        m[0] = 1
        m[1] = 0
        m[2] = 0
        m[3] = 0
        m[4] = 1
        m[5] = 0
        m[6] = 0
        m[7] = 0
        m[8] = 1
        return m
    }
    static fromIdentity() {
        return new Float32Array([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ])
    }
    static projection(m, w, h) {
        m[0] = 2 / w
        m[1] = 0
        m[2] = 0
        m[3] = 0
        m[4] = -2 / h
        m[5] = 0
        m[6] = -1
        m[7] = 1
        m[8] = 1
        return m
    }
    static fromProjection(width, height) {
        return new Float32Array([
            2 / width, 0, 0,
            0, -2 / height, 0,
            -1, 1, 1,
        ])
    }
    static translate(m, tx, ty) {
        m[6] = tx
        m[7] = ty
        return m
    }
    static fromTranslation(tx, ty) {
        return new Float32Array([
            1, 0, 0,
            0, 1, 0,
            tx, ty, 1,
        ])
    }
    static rotate(m, a) {
        m[0] = m[4] = Math.cos(a)
        m[1] = -(m[3] = Math.sin(a))
        return m
    }
    static fromRotation(rx, ry) {
        const
            c = Math.cos(rx),
            s = Math.sin(ry)
        return new Float32Array([
            c, -s, 0,
            s, c, 0,
            0, 0, 1,
        ])
    }
    static scale(m, sx, sy) {
        m[0] = sx
        m[4] = sy
        return m
    }
    static fromScale(sx, sy) {
        return new Float32Array([
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1,
        ])
    }
    static multiply(out, M, m) {
        const [M0, M1, M2, M3, M4, M5, M6, M7, M8] = M
        const [m0, m1, m2, m3, m4, m5, m6, m7, m8] = m
        out[0] = m0 * M0 + m1 * M3 + m2 * M6
        out[1] = m0 * M1 + m1 * M4 + m2 * M7
        out[2] = m0 * M2 + m1 * M5 + m2 * M8
        out[3] = m3 * M0 + m4 * M3 + m5 * M6
        out[4] = m3 * M1 + m4 * M4 + m5 * M7
        out[5] = m3 * M2 + m4 * M5 + m5 * M8
        out[6] = m6 * M0 + m7 * M3 + m8 * M6
        out[7] = m6 * M1 + m7 * M4 + m8 * M7
        out[8] = m6 * M2 + m7 * M5 + m8 * M8
        return out
    }
};
console.info('Math Module Loaded.')