class Vec3 {
    constructor() {
        this.x = 1
        this.y = 1
        this.z = 1
    }
}
class Vec2 {
    constructor() {
        this.x = 1
        this.y = 1
    }
}
class Vertex {
    constructor() {
        this.pos = new Vec3()
        this.normal = new Vec3()
        this.uv = new Vec2()
    }
}
class Triangle {
    constructor() {
        this.vertices = new Array(3).fill(1).map(i => new Vertex())
    }
}
class Quad {
    constructor() {
        this.triangles = new Array(2).fill(1).map(i => new Triangle())
    }
}
class Cube {
    constructor() {
        this.faces = new Array(6).fill(1).map(i => new Quad())
    }
}

class SpatialNode {
    constructor(x, y, z) {
        this.mesh = new MeshRenderer(gl, {
            vertices: CubeVerticesFromPos(x, y, z),
            indices: cIndices,
            mode: 'TRIANGLES'
        }, mShader)

        elements.unshift(this.mesh)

        this.color = [Math.random(), Math.random(), Math.random()]
        this.x = x
        this.y = y
        this.z = z
        this.parent = null
        this.order = ""
        this.leafs = {
            FUL: null,
            FUR: null,
            FDL: null,
            FDR: null,
            BUL: null,
            BUR: null,
            BDL: null,
            BDR: null,
        }
    }
    add(node) {
        node.parent = this
        if (node.x > this.x)
            node.shortOrder = "F"
        else
            node.shortOrder = "B"
        if (node.y > this.y)
            node.shortOrder += "U"
        else
            node.shortOrder += "D"
        if (node.z > this.z)
            node.shortOrder += "R"
        else
            node.shortOrder += "L"
        if (this.leafs[node.shortOrder] != null)
            this.leafs[node.shortOrder].add(node)
        else
            this.leafs[node.shortOrder] = node
        return node
    }
    connectToParent() {
        elements.unshift(new MeshRenderer(gl, {
            vertices: lineFromTo(this, this.parent),
            normals: this.color.concat(this.parent.color),
            indices: [0, 1],
            mode: 'LINE_LOOP'
        }, lShader));
        for (let child in this.leafs) {
            if (this.leafs[child] != null)
                this.leafs[child].connectToParent()
        }
    }
    tracePathTo(t) {
        if (this.x === t.x && this.y === t.y && this.z === t.z) {

        } else {
            for (let child in this.leafs) {
                if (this.leafs[child] != null)
                    this.leafs[child].tracePathTo(t)
            }
        }
    }
    hilight() {
        console.log(this)
    }
}

class MergedGeo {
    constructor() {
        this.x = 0
        this.y = 0
        this.z = 0
        this.color = [1, 1, 1]
        this.root = new SpatialNode(0, 0, 0)
        this.root.parent = this
    }
    addNode(node) {
        this.root.add(node)
    }
}
