
//Foi mal pelos pessimos temas!
//Não sou bom com cores.

const Themes = (_ => {

    DOMRenderer.registerTemplate('colorTemplate')
        `<div class="themeSelector" onclick=Themes.changeThemeTo('THEME_ID')>
            <div class="colorDisplay" style="background:C1;"></div>
            <div class="colorDisplay" style="background:C2;"></div>
            <div class="colorDisplay" style="background:C3;"></div>
            <div class="colorDisplay" style="background:C4;"></div>
        </div>`

    const colorTemplate = DOMRenderer.getTemplate('colorTemplate')

    DOMRenderer.setRenderTarget('.configMenu')

    //Por isto gostei de css variables.
    //Só não repara nos nomes das variaveis.
    //Dar nomes foi a parte dificil do projeto.
    //Talvez o DOMRenderer poderia se chamar Flarks.js ou Isfizler.js
    const themeLib = [
        `
     --pannel-bg-off:                rgb(0, 0,0);    
    --pannel-bg-on:                 rgb(250, 250, 250);
    --company-name-border-btm:      rgb(101, 143, 151);
    --scrollbar-thumb-color:        rgba(146, 152, 150, 1);
    --scrollbar-track-color:        rgb(42, 45, 52);;
    --sidebar-bg-color:             rgb(37, 39, 46);
    --ln3:                          rgb(43, 45, 53);
    --ln2:                          rgb(41, 43, 51);
    --ln1:                          rgb(36, 35,43);
    --bottom-bar-color:             rgb(239, 239, 239);
    /*Core de ui*/
    --standard-light:               rgb(23, 23, 23);
    --standard-hight:               #333;
    --standard-medium:              rgba(40, 45, 48, 1);
    --standar-dark:                 #ddd;
    --standard-gray:                rgba(146, 147, 150, 0.05);
    --white:                        #000;
    --green:                        rgb(0, 255, 150);
`, `
    --pannel-bg-off:                rgb(0, 0,0);    
    --pannel-bg-on:                 rgb(42, 45, 52);
    --company-name-border-btm:      rgb(41, 43, 51);
    --scrollbar-thumb-color:        rgba(146, 147, 150, 1);
    --scrollbar-track-color:        rgb(42, 45, 52);;
    --sidebar-bg-color:             rgb(37, 39, 46);
    --ln3:                          rgb(43, 45, 53);
    --ln2:                          rgb(41, 43, 51);
    --ln1:                          rgb(36, 35,43);
    --bottom-bar-color:             rgb(239, 239, 239);
    /*Core de ui*/
    --standard-light:               rgb(247, 247, 247);
    --standard-hight:               #ccc;
    --standard-medium:              rgba(146, 147, 150, 1);
    --standar-dark:                 rgb(73, 73, 73);
    --standard-gray:                rgba(146, 147, 150, 0.05);
    --white:                        #fff;
    --green:                        rgb(100, 255, 100);
`, /*Este ultimo tem apenas valores aleatorios*/`
    /*Partes importantes */
    --pannel-bg-off:                rgb(100, 100,0);    
    --pannel-bg-on:                 rgb(42, 45, 152);
    --company-name-border-btm:      rgb(41, 3, 151);
    --scrollbar-thumb-color:        rgba(146, 147, 150, 1);
    --sidebar-bg-color:             rgb(37, 39, 146);
    --ln3:                          rgb(43, 45, 3);
    --ln2:                          rgb(41, 43, 1);
    --ln1:                          rgb(36, 35,3);
    --bottom-bar-color:             rgb(239, 39, 239);
    /*Core de ui*/
    --standard-light:               rgb(247, 247, 247);
    --standard-hight:               #ccc;
    --standard-medium:              rgba(146, 147, 150, 1);
    --standar-dark:                 rgb(73, 73, 73);
    --standard-gray:                rgba(146, 147, 150, 0.05);
    --white:                        #fff;
    --green:                        rgb(100, 255, 100);
`]

    function changeThemeTo(i) {
        console.log(i)
        //O melhor módulo que já fiz
        css[':root'] = themeLib[i]
    }

    DOMRenderer.renderTemplate(colorTemplate, { C1: 'rgb(42, 45, 52)', C2: '#333', C3: '#ddd', THEME_ID: 0 })
    DOMRenderer.renderTemplate(colorTemplate, { C1: 'rgba(146, 147, 150, 1)', C2: 'rgb(37, 39, 46)', C3: 'rgb(37, 39, 146)', THEME_ID: 1 })
    DOMRenderer.renderTemplate(colorTemplate, { C1: '#009', C2: '#005', C3: '#004', THEME_ID: 2 })

    return { changeThemeTo }
})()
