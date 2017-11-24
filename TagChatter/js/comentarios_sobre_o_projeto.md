## Concluindo...

Gostaria de dizer que foi muito divertido para mim construir esta aplicação. Aprendi muito com ela, coisas tipo variaveis do tipo const conflitam com parametros, CSS variables deixam o codigo mais facil de escalar, e criar seu própio framework de UI não é tão dificil assim. além de botar em pratica coisas que eu estava louco pra começar a usar para algo util como a fetch api, CSS animations e async javascript.

Mesmo o projeto não estando 100% perfeito, fico muito feliz com o que consegui construir em dois dias. Ele tem vários problemas, posso listar alguns que percebi.

* O CSS poderia usar menos `calc` e `var` e ter suporte moblie.
* O código abaixo da linha 157 do modulo de Integração poderia se tornar uma mini-blibioteca mais completa
* O `DOMRenderer` poderia ter mais peformaçe (li algo sobre `DocumentFragment`).
* A forma como os Modulos javascript se comunicam é estranha de entender

E é claro há erros de português nos comentarios e variáveis com erros de inglês porém vai ser mais dificil corrigir isto do que dar suporte para moblie, `createChatDataPayload` talvez nem signifique o que eu ache que significa.

E o principal é o fato de ele começar a ter problemas de performance após mais de 300 mensagens em cada canal, eu não sei como o Twitter e o Facebook resolvem isto, talvez testando se os Elementos são visiveis e os removendo, mas acho que seria ainda pior.

O que mais me deixou aborrecido foi o fato de eu eu não ter internet quando comecei a desenvolder o projeto, então não pude testar os end points, logo tive que criar um modulo para lidar com a interface e um de integração para receber e enviar dados, como não sabia que os usuarios e os canais viriam com um id eu acabei os referenciando pelo seus nomes o que depois levou a problemas de escalabilidade.

Quando começei o projeto decidi não usar nenhuma biblioteca externa, usar apenas código escrito por mim (com exeção para umas 5 funções em Utils.js), e acho que me saí muito bem, principalmente em Pannels.js e DOMRenderer que foram os que mais me deixaram mais sastifeitos. O Css.js me impressionou sobre como o javascript pode permitir outras formas de sintaxe dentro da linguagem por exemplo `var e = css['.class']` para buscar elementos, `css['.class'] = 'color:red'` para trocar o css e `css._ = '.class{color:red}'` para crar uma folha de estilo, você me perdoe mas achei isto um máximo.

O Html da página me impressionou com o seu minusculo tamanho, enquanto o CSS está monstruosamente grande (não sei se isso é normal ou aceitavel) e provavelmente deveria ser dividido em mais arquivos.

Na parte de Javascript (que é minha especialidade) e tive o máximo de esforço para utilizar o paradigma da programação funcional e tentar deixar o máximo de funções privadas nos módulos para evitar problemas. No final tive pouca (quase zero, Users.js:14) poluição do objeto global, o que me agrada bastante pois da a sensação de o codigo ser mais encapsulado e menos propenso a erros.

Só gostaria de agradecer pelo entreterimento, pela experiencia ganha, (pelos servidores de teste) e principalmente por me incentivarem a contruir algo legal. Espero que tenham tido sucesso com a ideia do `Hiring-Whitout-Whiteboards`.