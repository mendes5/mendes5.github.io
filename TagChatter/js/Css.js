
//Um modulo simples para lidar com css de elementos facilmente.
//Documentação no final do arquivo.

const css = new Proxy({}, {
    get(obj, key) {
        const elements = document.querySelectorAll(key)
        if (elements.length === 0) 
            return false
        if (elements.length === 1) 
            return elements[0]
        return elements
    },
    set(_, key, value) {
        if (key === '_') {
            const styleSheet = document.createElement('style')
            styleSheet.innerHTML = value;
            document.head.appendChild(styleSheet)
            return 
        }
        const cssProps = value
            .split(';')
            .map(str => str.split(/:/g))
            .map(arr => arr.map(str => str.trim()))
            .filter(arr => arr.length === 2)
            .map(arr => ({ key: arr[0], value: arr[1] }))
        const elements = document.querySelectorAll(key)
        elements.forEach(element =>
            cssProps.map(cssProp =>
                element.style.setProperty(cssProp.key, cssProp.value)
            )
        )
        return elements
    }
})

/*

###Obtenção e Testes de elementos:

``` const test = css['.chatArea'] ```

 * Irá retornar uma `NodeList` se varios elementos são compativeis
com o seletor '.chatArea'.

 * Irá retornar apenas um `HTMLElement` caso apenas um elemento seja
compativel com o seletor '.chatArea'.

 * Irá retornar `false` caso nenhum elemento seja compativel com
o seletor '.chatArea'.



###Trocando estilos de elementos:

``` css['.chatArea'] = 'background: red' ```

 * Troca a cor de fundo de todos os elementos compativeis com o 
seletor '.chatArea' para vermelho. Ele tambem sempre retorna uma
`NodeList` com os elementos modificados.

Isto funciona mesmo com varias propiedades:

```
css['.userName'] = `
    font-size: 20px;
    margin-top: 30px;
`
```

###Criando folhas de estilo:

```
css._ = `
.channelsMenu, .usersMenu{
    overflow-y: scroll;
}
.channelItem{
    cursor: pointer;
    border: 1px solid rgba(146, 147, 150, 0.05);;
    border-radius: 8px;
    transition: 500ms;    
}
.channelItem:hover{
    border: 1px solid rgba(146, 147, 150, 1);   
}
.channelItem:active{
    border: 1px solid rgba(80, 255, 80, 1);   
}`
```

Este metodo depende da propiedade das `template literals` poderem chamar funções.
*/