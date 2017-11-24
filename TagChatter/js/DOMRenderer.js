
//Um modulo simples para geração dinamica de elementos HTML
//apartir de strings. (este modulo vai acabar se fundindo 
//com o utils.js)

const DOMRenderer = (_ => {

    //Este é um `Node` que iremos usar para criar os elementos.
    const nodeBuilder = document.createElement('div')

    //Este é o `Node` em que vamos adicionar os elementos.
    let renderTarget = undefined

    //Troca o `renderTarget` baseado em um selector.
    function setRenderTarget(selector) {
        renderTarget = document.querySelector(selector)
    }

    //Adiciona um novo `Node` para o `renderTarget`.
    function appendToTarget(element) {
        if (renderTarget != undefined && renderTarget != null) {
            return renderTarget.appendChild(element)
        } else {
            return false
        }
    }

    //Toma uma string como argumento e retorna um `Node`.
    function renderString(str = "<p>Hello World</p>") {
        nodeBuilder.innerHTML = str
        const element = nodeBuilder.children[0].cloneNode(true)
        nodeBuilder.innerHTML = ""
        return element
    }

    //Toma uma string como argumento e adiciona o elemento
    //rederizado ao `renderTarget`.
    function renderToTarget(str) {
        const renderedElement = renderString(str)
        return appendToTarget(renderedElement)
    }

    //Apenas troca placeholders pelos valores do `map`.
    function processTemplateAndMap(str = "", map = {}) {
        const keys = Object.keys(map)
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            //NOTE: Como os nomes das chaves no objeto `map` irão
            //virar RegExps não é possivel criar placeholders como $field.
            str = str.replace(new RegExp(key, 'g'), map[key])
        }
        return str
    }

    //A string do argumento deve ter alguns placeholders que 
    //serão trocados pelos valores do objeto map. No final 
    //o resultado será adicionado ao `renderTarget`.
    function renderTemplate(str = "", map = {}) {
        const result = processTemplateAndMap(str, map)
        return renderToTarget(result)
    }

    //O mesmo que a função acima, com a diferença de que 
    //nesta trocamos o `renderTarget` sempre.
    function renderTemplateToTarget(str = "", map = {}, target = "") {
        setRenderTarget(target)
        return renderTemplate(str, map)
    }

    //Gera os elementos HTML apartir de uma string e adiciona
    // o resultado ao elemento com o seletor compativel com o
    // parametro `target`.
    function renderStringToTarget(str = "", target = "") {
        setRenderTarget(target)
        const element = renderString(str)
        return appendToTarget(element)
    }

    //Adiciona o novo elemento direto no `element`
    function renderStringToElement(str = "", element) {
        const renderedElement = renderString(str)
        element.appendChild(renderedElement)
        return element
    }

    //A mesma coisa, porem com suporte para templates
    function renderTemplateToElement(str = "", map = {}, element) {
        const htmlString = processTemplateAndMap(str, map)
        const renderedElement = renderString(str)
        element.appendChild(renderedElement)
        return element
    }

    //Quando não queremos trocar de `renderTarget`.
    class FixedRendererTarget {
        constructor(element = "") {
            if (element instanceof HTMLElement) {
                this.renderTarget = element;
            } else {
                this.renderTarget = document.querySelector(element)
            }
            this.elementFindFalied = this.renderTarget === null
            this._selector = element
        }

        //Talvez tenha sido invocado com o documento não carregado.
        tryAgain() {
            this.renderTarget = document.querySelector(this._selector)
            this.elementFindFalied = this.renderTarget === null
            return this.elementFindFalied
        }
        //Transforma uma string em HTML e adiciona ao `renderTarget`.
        render(str = "<p>empty<p>") {
            const element = renderString(str)
            return this.appendToTarget(element)
        }
        //O nosso target nunca será `undefined` então não dá pra reutilizar
        //a função na linha 19.
        appendToTarget(element) {
            return this.renderTarget != null ? this.renderTarget.appendChild(element) : false
        }
        //Transforma um template com placeholders em HTML e
        // adiciona ao `renderTarget`.
        renderTemplate(str, map) {
            const htmlString = processTemplateAndMap(str, map)
            return this.render(htmlString)
        }
        //Caso seja necessario.
        changeRenderTarget(element = "") {
            if (element instanceof HTMLElement) {
                this.renderTarget = element;
            } else {
                this.renderTarget = document.querySelector(element)
            }
        }
    }

    const templates = {}

    const registerTemplate = (name = "") => str => templates[name] = str[0]

    const getTemplate = (name = "") => templates[name]

    //Caso você queira um render target rapido
    const getAbsoluteContainer = (w = 10, h = 10) => {
        const div = document.createElement('div')
        div.id = '__' + u.UUID()
        css[div.id] = `
            position: absolute;
            width: ${w}px;
            height: ${h}px;
        `
        div.appendToDocument = e => document.body.appendChild(div)
        div.appendToElement = e => e.appendChild(div)
        div.addClass = e => div.classList.add(e)
        div.removeClass = e => div.classList.remove(e)
        return div
    }

    //Expor estas funções para o objeto `DOMRenderer`.
    return {
        renderTarget,
        renderString,
        setRenderTarget,
        renderTemplate,
        renderToTarget,
        renderTemplateToTarget,
        renderStringToTarget,
        appendToTarget,
        templates,
        registerTemplate,
        getTemplate,
        FixedRendererTarget,
        getAbsoluteContainer,
        renderStringToElement,
        renderTemplateToElement,
    }

})()