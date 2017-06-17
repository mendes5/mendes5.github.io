const ColdVector = (function () {

    let lett = 'abcdefghijklmnopqrstuvwxyz'.split('');

    function setAttributes(objA, objB) {
        for (let i in objB) {
            objA[i] = objB[i];
        };
    };

    function newUUID() {
        return new Array(4).fill(0).map((element) => {
            return lett[Number.parseInt(Math.random() * 26)] + ((new Date().getMilliseconds() + Math.random() * 1000).toFixed(0));
        }).join('-');
    };

    function isEqualToAny(x, arr) {
        let result = false;
        arr.map(i => x === i && !result && (result = true));
        return result;
    };

    const ns = 'http://www.w3.org/2000/svg';
    
    const Filters = {
        shadowFilter(dx, dy, dev){
            let filter = document.createElementNS(ns, 'filter');
            let shadow = document.createElementNS(ns, 'feDropShadow');
            shadow.setAttributeNS(null, 'dx', dx)
            shadow.setAttributeNS(null, 'dy', dy)
            shadow.setAttributeNS(null, 'stdDeviation', dev)
            filter.appendChild(shadow)
            filter.id = newUUID()
            filter.setAttributeNS(null, 'id', filter.id)
            filter.setAttributeNS(null, 'height', '200%')
            filter.setAttributeNS(null, 'width', '200%')
            return {
                data : {filter, shadow},
                applyTo(svgE){
                    if(Array.isArray(svgE)){
                        svgE.map(e => (e.element || e).setAttributeNS(null, 'filter', `url(#${filter.id})`))
                    }else{
                        (svgE.element || svgE).setAttributeNS(null, 'filter', `url(#${filter.id})`);
                    }
                },
            }
        }
    }
    
    class SVGCanvas {
        constructor(x, y) {
            const self = this;
            this.context = this
            this.element = document.createElementNS(ns, 'svg');
            this.definitions = document.createElementNS(ns, 'defs');
            this.element.appendChild(this.definitions);
            this.resize(x, y);
        };
        setParent(node) {
            node.appendChild(this.element);
        };
        addChild(child) {
            this.element.appendChild(child.element || child);
            if (child.element) {
                child.context = this;
                child.parent = this;
            };
            return this;
        };
        resize(x, y) {
            this.element.setAttributeNS(null, 'width', x);
            this.element.setAttributeNS(null, 'height', y);
            return this;
        };
        createShadowFilter(dx, dy, deviation){
            let element = Filters.shadowFilter(dx, dy, deviation)
            this.addDefinition(element.data.filter)
            return element
        };
        addDefinition(def) {
            this.definitions.appendChild(def.element || def);
            return this;
        };
        removeDefinition(def) {
            this.definitions.removeChild(def.element || def);
            return this;
        };
        path(p, att) {
            let svgE = new Path(p, att).setParent(this);
            svgE.context = this;
            return svgE;
        };
        circle(r, att) {
            let svgE = new Circle(r, att).setParent(this);
            svgE.context = this;
            return svgE;
        };
        ellipse(rx, ry, att) {
            let svgE = new Ellipse(rx, ry, att).setParent(this);
            svgE.context = this;
            return svgE;
        };
        rectangle(w, h, att) {
            let svgE = new Rect(w, h, att).setParent(this);
            svgE.context = this;
            return svgE;
        };
        polygon(p, att) {
            let svgE = new Polygon(p, att).setParent(this);
            svgE.context = this;
            return svgE;
        };
        //Others:
        image(src, att) {
            let svgE = new Image(src, att).setParent(this);
            svgE.context = this;
            return svgE;
        };
        symbol(svg, att) {
            let svgE = new Symbol(svg, att).setParent(this);
            svgE.context = this;
            return svgE;
        };
        clipPath(id, mask, att) {
            let svgE = new ClipPath(id, mask, att).setParent(this);
            svgE.context = this;
            return svgE;
        }
        group(el, att) {
            let svgE = new Group(el, att).setParent(this);
            svgE.context = this;
            return svgE;
        };
        //Lines:
        line(x1, y1, x2, y2, w, att) {
            let svgE = new Line(x1, y1, x2, y2, w, att).setParent(this);
            svgE.context = this;
            return svgE;
        };
        polyline(p, att) {
            let svgE = new Polyline(p, att).setParent(this);
            svgE.context = this;
            return svgE;
        };
        //Text:
        text(str, att) {
            let svgE = new Text(str, att).setParent(this);
            svgE.context = this;
            return svgE;
        };
        textPath(srt, path, att) {
            let svgE = new TextPath(srt, path, att).setParent(this);
            svgE.context = this;
            return svgE;
        };
        //Constructors
        fromSymbol(id, att) {
            let svgE = new Use(id, att).setParent(this);
            svgE.context = this;
            return svgE;
        };
    };

    const getSVGCanvas = {
        blank(x, y) {
            return new SVGCanvas(x, y);
        },
        inDocument(x, y) {
            let ctx = new SVGCanvas(x, y);
            document.body.appendChild(ctx.element);
            return ctx;
        },
        inElementNode(element, x, y) {
            let ctx = new SVGCanvas(x, y);
            element.appendChild(ctx.element);
            return ctx;
        },
        inElementId(id, x, y) {
            let ctx = new SVGCanvas(x, y);
            let div = document.getElementById(id);
            div.appendChild(ctx);
            return ctx;
        }
    }
    class BasicElement {
        constructor(shape, attribs) {
            const self = this;
            this.element = document.createElementNS(ns, shape);
            this.parent = null;
            this.context = null;
            this.isDef = false;
            this.element.id = newUUID();
            this.attributes = new Proxy({}, {
                get: (target, name) => { return self.element.getAttributeNS(null, name) },
                set: (target, name, value) => { return self.element.setAttributeNS(null, name, value) }
            });
            setAttributes(this.attributes, attribs);
        };
        setFilter(url){
            this.element.setAttributeNS(null, 'filter', '#' + (typeof url === 'string' ? url : url.element.id));
        };
        setParent(svgE) {
            (svgE.element || svgE).appendChild(this.element);
            this.parent = svgE;
            this.context = svgE.context;
            return this;
        };
        isDefinition(bool) {
            this.isDef = bool;
            if (bool) {
                this.context.definitions.appendChild(this.element);
            } else {
                this.context.element.appendChild(this.element);
            };
            return this;
        };
    };
    class MatrixBase extends BasicElement {
        constructor(shape, attribs) {
            super(shape, attribs);
            const self = this;
            this.element.setAttributeNS(null, 'transform', "matrix(1 0 0 1 0 0 ) translate(0 0) translate(0 0) rotate(0 0 0) skewX(0) skewY(0)  scale(1 1)");
            this._transform = {
                positionx: 0,
                positiony: 0,
                anchorx: 0,
                anchory: 0,
                rotation: 0,
                skewx: 0,
                skewy: 0,
                scalex: 1,
                scaley: 1,
                _anchorx: 0,
                _anchory: 0,
                _pivotx:0,
                _pivoty:0
            };

            this.rotation = 0;
            this.position = {
                x: 0, y: 0,
                set(x, y) {
                    this.x = x, this.y = y
                    return self
                }
            };
            this.anchor = {
                x: 0, y: 0,
                set(x, y) {
                    self.anchor.x = x, self.anchor.y = y
                    return self
                }
            };
            this.skew = {
                x: 0, y: 0,
                set(x, y) {
                    this.x = x, this.y = y
                    return self
                }
            };
            this.scale = {
                x: 0, y: 0,
                set(x, y) {
                    self.scale.x = x, self.scale.y = y
                    return self
                }
            };
            Object.defineProperty(this, 'rotation', {
                get() { return self._transform.rotation },
                set(value) {
                    self._transform.rotation = value;
                    self.element.transform.baseVal.getItem(3).setRotate(value, self._transform._pivotx, self._transform._pivoty);
                    return value;
                }
            });
            Object.defineProperties(self.position, {
                'x': {
                    get() { return self._transform.positionx },
                    set(value) {
                        self._transform.positionx = value;
                        self.element.transform.baseVal.getItem(1).setTranslate(value, self._transform.positiony);
                        return value;
                    }
                },
                'y': {
                    get() { return self._transform.positiony },
                    set(value) {
                        self._transform.positiony = value;
                        self.element.transform.baseVal.getItem(1).setTranslate(self._transform.positionx, value);
                        return value;
                    }
                }
            });
            Object.defineProperties(self.anchor, {
                'x': {
                    get() { return self._transform.anchorx },
                    set(value) {
                        self._transform.anchorx = value;
                        self._transform._anchorx = -(value * self.element.getBBox().width * self._transform.scalex);
                        self._transform._pivotx =  -self._transform._anchorx
                        self.element.transform.baseVal.getItem(2).setTranslate(self._transform._anchorx, self._transform._anchory);
                        self.updateRotation()
                        return value;
                    }
                },
                'y': {
                    get() { return self._transform.anchory },
                    set(value) {
                        self._transform.anchory = value;
                        self._transform._anchory = -(value * self.element.getBBox().height * self._transform.scaley);
                        self._transform._pivoty = -self._transform._anchory
                        self.element.transform.baseVal.getItem(2).setTranslate(self._transform._anchorx, self._transform._anchory);
                        self.updateRotation()
                        return value;
                    }
                }
            });
            Object.defineProperties(self.skew, {
                'x': {
                    get() { return self._transform.skewx },
                    set(value) {
                        self._transform.skewx = value;
                        self.element.transform.baseVal.getItem(4).setSkewX(value);
                        return value;
                    }
                },
                'y': {
                    get() { return self._transform.skewy },
                    set(value) {
                        self._transform.skewy = value;
                        self.element.transform.baseVal.getItem(5).setSkewY(value);
                        return value;
                    }
                }
            });
            Object.defineProperties(self.scale, {
                'x': {
                    get() { return self._transform.scalex },
                    set(value) {
                        self._transform.scalex = value;
                        self.element.transform.baseVal.getItem(6).setScale(value, self._transform.scaley);
                        self.updateAnchor();
                        return value;
                    }
                },
                'y': {
                    get() { return self._transform.scaley },
                    set(value) {
                        self._transform.scaley = value;
                        self.element.transform.baseVal.getItem(6).setScale(self._transform.scalex, value);
                        self.updateAnchor();
                        return value;
                    }
                }
            })
        };
        setRotation(v) {
            this.rotation = v;
            return this;
        };
        setRadRotation(v) {
            this.rotation = v * (180 / Math.PI);
            return this;
        };
        updateAnchor() {
            this.anchor.x=this.anchor.x
            this.anchor.y=this.anchor.y
        };
        updateRotation(){
            this.rotation = this.rotation
        }
    };

    class Group extends MatrixBase {
        constructor(svgs, att = {}) {
            super('g', att);
            if (svgs) {
                if (Array.isArray(svgs)) {
                    svgs.map(item => this.element.appendChild(item.element || item));
                } else {
                    this.element.appendChild(svgs);
                };
            };
        };
        addChild(svgE) {
            this.element.appendChild(svgE.element || svgE);
            if (svgE.element) {
                svgE.parent = this;
                svgE.context = this.context;
            };
        };
    };
    class TextPath extends MatrixBase {
        constructor(str, path, att = {}) {
            super('text', att);
            const self = this;
            this.textPath = document.createElementNS(ns, 'textPath');
            this.textPath.textContent = str;
            this.text = str;
            this.path = path;
            this._path = path;
            this.element.appendChild(this.textPath);
            if (typeof path === 'string') {
                this.textPath.setAttributeNS(null, 'href', '#' + path);
                this._path = document.getElementById(path);
            } else {
                this.textPath.setAttributeNS(null, 'href', '#' + path.element.id);
                this._path = path;
            };
            Object.defineProperties(this, {
                'text': {
                    get() {
                        return self.textPath.textContent;
                    },
                    set(v) {
                        return self.textPath.textContent = v;
                    }
                },
                'path': {
                    get() {
                        return self._path;
                    },
                    set(path) {
                        if (typeof path === 'string') {
                            self.textPath.setAttributeNS(null, 'href', '#' + path);
                            self._path = document.getElementById(path);
                        } else {
                            self.textPath.setAttributeNS(null, 'href', '#' + path.element.id);
                            self._path = path;
                        };
                    }
                }
            });
        };
    };
    class Text extends MatrixBase {
        constructor(str, att = {}) {
            super('text', att);
            const self = this;
            this.element.textContent = str;
            this.text = str;
            Object.defineProperty(this, 'text', {
                get() { return self.element.textContent },
                set(v) { return self.element.textContent = v }
            });
        };
    };
    class Use extends MatrixBase {
        constructor(url, att = {}) {
            super('use', att);
            this.element.setAttributeNS(null, 'href', '#' + (typeof url === 'string' ? url : url.element.id));
        };
    };
    class Symbol extends MatrixBase {
        constructor(first, att = {}) {
            super('symbol', att);
            if (first) {
                if (Array.isArray(first)) {
                    first.map(item => this.element.appendChild(item.element || item));
                } else {
                    this.element.appendChild(first.element || first);
                };
            };
            this.context && this.context.definitions.appendChild(this.element);
            this.isDefinition = undefined;
        };
        setParent(svgE) {
            this.parent = svgE;
            this.context = svgE.context;
            this.context.definitions.appendChild(this.element);
            return this;
        };
        addElement(svgE) {
            this.element.appendChild(svgE.element || svgE);
            if (svgE.element) {
                svgE.parent = this;
                svgE.context = this.context;
            };
            return this;
        };
        addElements(svgS) {
            svgS.map(item => {
                this.element.appendChild(item.element || item);
                if (item.element) {
                    item.parent = this;
                    item.context = this.context;
                };
            });
            return this;
        };
        removeElement(svgE) {
            this.element.removeChild(svgE.element || svgE);
            return this;
        };
        use() {
            return new Use(this.element.id).setParent(this.parent);
        };
    };
    class Polyline extends MatrixBase {
        constructor(points = "", att) {
            super('polyline', Object.assign({
                'points': points,
            }, att));
        };
        clear(){
            while (this.element.points.numberOfItems > 0){
	            this.element.points.removeItem(0)
            }
            return this
        };
        addPoint(x, y){
            let point = this.context.element.createSVGPoint()
            point.x = x
            point.y = y
            this.element.points.appendItem(point)
            return this
        };
        setPointPosition(index, x, y){
            let point = this.element.points.getItem(index)
            point.x = x
            point.y = y
            return this
        };
        setLastPointPos(x, y){
            let point = this.element.points.getItem(this.element.points.length - 1)
            point.x = x
            point.y = y
            return this
        }
    };
    class Polygon extends MatrixBase {
        constructor(points = '0,0 10,10 0,10', att = {}) {
            super('polygon', Object.assign({
                'points': points
            }, att));
        };
    };
    class Image extends MatrixBase {
        constructor(src, att = {}) {
            super('image', Object.assign({
                'href': src,
                'externalResourcesRequired':'true'
            }, att));
            this.element.onload  = a => {
                this.updateAnchor()
            }
        };
    };
    class Ellipse extends MatrixBase {
        constructor(radiusX = 10, radiusY = 5, att = {}) {
            super('ellipse', Object.assign({
                'rx': radiusX,
                'ry': radiusY
            }, att));
        };
    };
    class Circle extends MatrixBase {
        constructor(radius = 10, att = {}) {
            super('circle', Object.assign({
                'r': radius
            }, att));
        };
    };
    class Path extends MatrixBase {
        constructor(points = 'M 100 100 L 300 100 L 200 300 z', att = {}) {
            super('path', Object.assign({
                'd': points
            }, att));
        };
    };
    class Line extends MatrixBase {
        constructor(x1 = 0, y1 = 0, x2 = 10, y2 = 0, w = 1, att = {}) {
            super('line', Object.assign({
                'x1': x1,
                'x2': x2,
                'y1': y1,
                'y2': y2,
                'stroke-width': w,
                'stroke': 'black'
            }, att));
        };
    };
    class Rect extends MatrixBase {
        constructor(w, h, att = {}) {
            super('rect', Object.assign({
                'width': w,
                'height': h
            }, att));
        };
    };
    class ClipPath extends MatrixBase {
        constructor(mask, att = {}) {
            super('clipPath', att);
            if (mask) {
                if (Array.isArray(mask)) {
                    mask.map(item => this.element.appendChild(item.element || item));
                } else {
                    this.element.appendChild(mask.element);
                };
            };
            this.context && this.context.definitions.appendChild(this.element);
            this.isDefinition = undefined;
        };
        setParent(svgE) {
            this.parent = svgE;
            this.context = svgE.context;
            this.context.definitions.appendChild(this.element);
            return this;
        };
        clipElement(svgE) {
            (svgE.element || svgE).setAttributeNS(null, 'clip-path', 'url(#' + this.element.id + ')');
            return this;
        };
        addClipElement(svgE) {
            this.element.appendChild(svgB.element || svgE);
            return this;
        };
        addClipElements(svgs) {
            svgs.map(item => this.element.appendChild(item.element || item));
        };
        removeClipElement(svgB) {
            this.element.removeChild(svgB.shape || svgB);
            return this;
        };
    };
    return {
        //Renderer:
        createSVGRenderer: getSVGCanvas,
        //Shapes:
        shapes: {
            path: (p, att) => { return new Path(p, att) },
            circle: (r, att) => { return new Circle(r, att) },
            ellipse: (rx, ry, att) => { return new Ellipse(rx, ry, att) },
            rectangle: (w, h, att) => { return new Rect(w, h, att) },
            polygon: (p, att) => { return new Polygon(p, att) },
            //Others:
            image: (src, att) => { return new Image(src, att) },
            symbol: (svg, att) => { return new Symbol(svg, att) },
            clipPath: (id, mask, att) => { return new ClipPath(id, mask, att) },
            group: (el, att) => { return new Group(el, att) },
            //Lines:
            line: (x1, y1, x2, y2, w, att) => { return new Line(x1, y1, x2, y2, w, att) },
            polyline: (p, att) => { return new Polyline(p, att) },
            //Text:
            text: (str, att) => { return new Text(str, att) },
            textPath: (srt, path, att) => { return new TextPath(srt, path, att) },
            //Constructors
            fromSymbol: (id, att) => { return new Use(id, att) }
        }
    };
})();
