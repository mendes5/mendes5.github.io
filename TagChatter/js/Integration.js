//O objetivo deste modulo e substituir o Testing.js, para chamar as funcoes
//dos modulos Channels.js, Users.js direto com informacoes da REST API.

//Primeiro precizamos de um meio para falar com o usuario.
const Msg = (e => {

    //Coisas do tipo criar uma caixa de erro flutuante com
    //um botão parece bem simples, mas acaba pedindo mais 
    //codigo do que se espera.

    //Todo este codigo é só para uma função que abre uma caixa de
    //dialogo com uma mensagem e retorna true ou false


    const $otherError = DOMRenderer.getAbsoluteContainer()
    $otherError.appendToDocument()

    const $messageQueryContainer = DOMRenderer.getAbsoluteContainer()
    $messageQueryContainer.appendToDocument()

    $otherError.addClass('popup')
    $messageQueryContainer.addClass('popup')

    css._ = `
    .popup{
        border: 2px solid #ff8787;
        position: absolute;
        transform: translate(-50%, -800%);
        left: 50%;
        top: 50%;
        z-index: 999999999999999999999999;
        border-radius: 10px;
        width: 500px;
        background: #ffdbdb;
        box-shadow: 0px 9px 28px -9px black;
        transition: 600ms;
    }
    .popup.active{
        transform: translate(-50%, -50%);
    }
    .messageThatFalied{
        margin-left: 5%;
        margin-right: 5%;
        border: 1px solid #ff7d7d;
        padding: 10px;
        height: 63px;
        overflow-y: scroll;
        background: #fff
    }
    .errBtn{
        border: 1px solid #ff9292;
        border-radius: 5px;
        padding: 5px;
        box-sizing: border-box;
        background: #ffa1a1;
        cursor: pointer;
        margin-bottom: 17px;
        margin-top: 26px;
        width: 35px;
    }
    #errYes{
        margin-left:30%;
        float: left;
    }
    #errNo{
        margin-right:30%;        
        float: right;
    }
    `


    //Que nem no React, todo o conteudo deve estar dentro de 
    //um elemento
    DOMRenderer.renderStringToElement(`
    <div>
        <center>
            <p class="errorMessage" id="errDesc"></p>
            <p class="messageThatFalied" id="messageThatFalied"></p>
            Try to send again?
            <div id="errYes" class="errBtn">Yes</div>
            <div id="errNo" class="errBtn">No</div>
        </center>
    </div>`, $messageQueryContainer)


    async function showMessageFaliedError(msg, reazon) {
        $messageQueryContainer.addClass('active')
        N$('messageThatFalied').innerText = msg
        N$('errDesc').innerText = 'Falied to send the message: ' + reazon
        return new Promise((res, rej) => {
            N$('errYes').onclick = e => {
                $messageQueryContainer.removeClass('active')
                res(true)
            }
            N$('errNo').onclick = e => {
                $messageQueryContainer.removeClass('active')
                res(false)
            }
        })
    }



    DOMRenderer.renderStringToElement(`
    <div>
        <center>
            <p class="errorMessage" id="errDesc2"></p>
            <div style="float:left; margin-left:30%" id="errYes2" class="errBtn"></div>
            <div style="float:right; margin-right:30%" id="errNo2" class="errBtn"></div>
        </center>
    </div>`, $otherError)

    async function showErrorMessage(msg, txtbtn1, txtbtn2) {
        $otherError.addClass('active')
        N$('errDesc2').innerText = msg

        const btn1 = N$('errYes2')
        btn1.innerText = txtbtn1
        const btn2 = N$('errNo2')
        btn2.innerText = txtbtn2

        return new Promise((res, rej) => {
            btn1.onclick = e => {
                $otherError.removeClass('active')
                res(true)
            }
            btn2.onclick = e => {
                $otherError.removeClass('active')
                res(false)
            }
        })
    }

    const onlineIndicator = N$('onlineIndicator')

    const stayOnline = e => onlineIndicator.style.setProperty('background', '#0f0')
    const stayOffline = e => onlineIndicator.style.setProperty('background', '#f00')
    const stayWorking = e => onlineIndicator.style.setProperty('background', 'yellow')  //Não sei amarelo em hex  

    return {
        showErrorMessage,
        showMessageFaliedError,
        stayOnline,
        stayOffline,
        stayWorking,
    }
})()


//Depois precisamos de funções
//para tratar as respostas do server


const miniUtils = {

    //Converte uma lista de comentarios do formato que o servidor usa
    //para o formato que esta aplicação usa.
    convertToMyFormat(data = {}) {

        //Primeiro, eu referencio os canais pelo seus nomes ao invés 
        //de seus id, o porque disto está em comentarios_sobre_o_projeto.md
        const result = {}
        const channelsIDs = Object.keys(data)
        const channelsName = channelsIDs.map(a => Channels.getChannelByID(a).name)
        channelsName.map(n => result[n] = [])

        //Segundo para gerar um comentario eu só quero estas informações:
        //{avatar string, senderName string, sendDate string, messageBody string }
        channelsIDs.map(id => {
            data[id].map(comm => {
                result[Channels.getChannelByID(id).name].push({
                    userProfilePic: comm.author.avatar,
                    senderName: comm.author.name,
                    date: this.transformDate(comm.created_at),
                    msgBody: comm.content,
                })
            })
        })

        return result
    },

    //Transforma um `new Date().toJSON()` para '<horas>:<minutos>'
    transformDate(str = "") {
        const [date, time] = str.split('T')
        const [hours, minutes, seconds] = time.split(':')
        return hours + ':' + minutes
    }
}

//Agroa sim
//Todo o código para lidar com a conexão com o servidor está aqui.

let Integration = { loaded: false };

const tryToLoad = async _ => {

    Integration = { loaded: false }

    let sucess = true

    Msg.stayWorking()


    async function handleNetworkError(reason) {
        Msg.stayOffline()
        sucess = false
        const reload = await Msg.showErrorMessage(reason + ' Reload the page? ', 'Yes', 'No')
        if (reload) {
            //Não sei se isto fere o requisito de a aplicação ter que ter
            //Uma só pagina.
            //Só não me sinto nem um pouco bem fazendo isto.
            location.reload(true)
        } else {
            //Se te deixa mais feliz nós iremos tentar fazer isto denovo após 10 segundos.
            //E eu acho que isto me dá um ponto no quesito tratamento de erros.
            setTimeout(tryToLoad, 10000)
        }
    }


    //Primeiro passo, pegar o Nosso Usuario.
    const user = fetch("https://tagchatter.herokuapp.com/me").then(async m => {
        let meJoson = await m.json()
        Users.registerCurrentUser(meJoson)
    }).catch(e => {
        console.error(e)        
        handleNetworkError('Falied to log in, no connection with the server so the app cannot work.')
    })

    //Segundo, pegar os outros usuarios.
    const users = fetch('https://tagchatter.herokuapp.com/users').then(async o => {
        const otherUsers = await o.json()
        Users.registerUserList(otherUsers)
    }).catch(async e => {
        console.error(e)        
        handleNetworkError('Falied to load user list, no connection with the server so the app cannot work.')
    })

    //Depois, pegar os canais.
    const channels = fetch('https://tagchatter.herokuapp.com/channels').then(async c => {
        const channelsToRegister = await c.json()
        Channels.registerChannelList(channelsToRegister)
    }).catch(async e => {
        console.error(e)

        //Eu sei que tratamento de erros é um requisito do projeto
        //Até agora erros só aconteceram com net::ERR_CONECTION_RESET,
        // net::ERR_CONECTION_FALIED e net::ERR_NAME_NOT_RESOLVED
        //E não sei se há muito que podemos fazer nessas condições.

        handleNetworkError('Falied to load channel list, no connection with the server so the app cannot work.')
    })

    //O bom deste sistema e que os 3 requests são feitos em paralelo,
    //então um não espera o outro
    await Promise.all([user, users, channels])

    //Se isto for true, houve umm erro e o usuario decidiu não recarregar
    if (!sucess) {
        return
    }
    
    Msg.stayOnline()

    //Após termos pegado todos os canais ja podemos começar o loop principal de mensagens:
    let updateInterval = 3
    let messageShow = false

    //Em 38 Horas este código seria resonsável por transferir
    //mais de 1 Gb de internet.
    const fetchNewComments = async e => {
        const toLoad = {}
        Channels.getAllChannelsIds().map(id => {
            toLoad[id] = `https://tagchatter.herokuapp.com/channels/${id}/messages`
        })

        const channelsData = await u.loadAll(toLoad).catch(async e => {
            Msg.stayOffline()
            //Já que os requests vão falhar a cada 3 segundos
            //uma vez por canal é melhor impor limites.
            if (!messageShow) {
                const reload = await Msg.showErrorMessage('Falied to load fetch new comments, no connection with the server so the app cannot work,  maybe the problem solves itself if you wait, Reload the page?', 'Yes', 'No')
                console.error(e)
                messageShow = true
                //Além disso não sei o que acontece se chamarmos
                //`Msg.showErrorMessage` twice.
                setTimeout(e => messageShow = false, 8000)
                if (reload) {
                    location.reload(true)
                } else {
                    setTimeout(tryToLoad, 3000)
                }
            }
        })
        const comments = miniUtils.convertToMyFormat(channelsData)
        Channels.updateChannels(comments)

        //Eu adoraria usar 
        //u.callAfter(fetchNewComments, 1000)
        //aqui mas isto geraria um stack overflow em aluns dias
    }

    //E ai está o seu TagChatter.
    setInterval(fetchNewComments, updateInterval * 1000)


    //Não tão rapido, o o nosso querido usuario ainda não pode enviar mensagens.
    async function sendMessageToChannel(msg = '', channel = '') {

        const channelToSend = channel

        //Sempre quis fazer isto! nunca tive um server para testar.
        const serverResponse = await fetch(`https://tagchatter.herokuapp.com/channels/${channel}/messages?stable=false`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: msg,
                author_id: Users.me.id
            })
        })

        let sucess = false;
        let resend = false;
        //Este switch é só para mudar a forma de que vamos
        //perguntar ao usuario se ele quer que reenviemos a mensagem 
        switch (serverResponse.status) {
            case 400:
                resend = await Msg.showMessageFaliedError(msg, 'Aplication error, contact the developer about this: @ColdMeson_06')
                if (resend) {
                    //Por crivel que pareça, suspeito de que há uma possibilidade
                    //de que isto crie um stack overflow.
                    sendMessageToChannel(msg, channel)
                }
                break;
            case 200:
                sucess = true
                break;
            case 404:
                resend = await Msg.showMessageFaliedError(msg, 'Channel not found, contact the developer about this @ColdMeson_06')
                if (resend) {
                    sendMessageToChannel(msg, channel)
                }
                break;
            case 500:
                resend = await Msg.showMessageFaliedError(msg, 'Error in the server, contact the developer about this @ColdMeson_06')
                if (resend) {
                    sendMessageToChannel(msg, channel)
                }
                break;
            default:
                resend = await Msg.showMessageFaliedError(msg, 'Unknow error, contact the developer about this @ColdMeson_06')
                if (resend) {
                    sendMessageToChannel(msg, channel)
                }
                break;
        }

        if (!sucess) {
            return
        }
        const jsonResponse = await serverResponse.json()
        const result = miniUtils.convertToMyFormat({ [channelToSend]: [jsonResponse] })
        result.sucess = sucess
        return result
    }

    return {
        updateInterval,
        sendMessageToChannel,
        loaded: true
    }
    //Este modulo é assicrônio (acho que é assim em português). 
}

tryToLoad().then(r => Integration = r).catch(e => console.log('Falied to initialize the integration module.'))

