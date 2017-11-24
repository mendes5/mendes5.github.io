
//Template para um botão de canal.
DOMRenderer.registerTemplate('channelItem')
    `<div id="CHANNEL_NAME" class="channelItem" onclick=Channels.openChannel("CHANNEL_NAME")>
    <img class="chanIcon" src='./img/channel_icon.svg' />
    <p id="CHANNEL_NAME.messageCount" class="newMessageCount">0</p>
    <p id="CHANNEL_NAME.name"class="channelNameInList">CHANNEL_NAME</p>
</div>`

//Template para um frame de comentario de chat.
DOMRenderer.registerTemplate('chatItem')
    `<div class="chatItem">
    <img class="profilePic" src=_IMAGE_LOCATION />
    <p class="userName">_USER_NAME</p>
    <img class="messageSeparator" src="./img/message_header_separator.svg" />
    <p class="publicationDate">_POST_TIME</p>
    <p class="messageBody">
        _MESSAGE_BODY
    </p>
</div>`

//O objetivo deste modulo é centralizar todas as funções relacionadas a canais.

const Channels = (_ => {

    //Teplates nesessarios:
    const channelTemplate = DOMRenderer.getTemplate('channelItem')
    const chatTemplate = DOMRenderer.getTemplate('chatItem')

    //Guarda referencias de todos os canais criados, o canal aberto
    //e tem funções para distribuir mensagens entre os canais quando
    //chegarem.
    const ChannelStateManager = {

        channels: {},

        $selectedChannelLabel: undefined,
        queue: {
            lenght: 0,
            itens: {},  //{java:[{msg},{msg}], go:[{msg}]}
            add(chan = '', str = '') {
                this.itens[chan] = str
                this.lenght += 1
            },
            drain() {

                //Isto reconstroi as mensagens na queue para que agora tenham 
                //os dados do usuario que agora está registrado
                Object.keys(this.itens).map(key => {
                    this.itens[key].forEach((v, i) => {
                        this.itens[key][i].userProfilePic = Users.me.avatar
                        this.itens[key][i].senderName = Users.me.name
                    })
                })


                if (this.length) {
                    if (!TESTING_ENABLED) {



                    } else {
                        ChannelStateManager.updateChannels(this.itens)  //Agora podemos enviar como se fossem mensagens normais
                        this.itens = {}
                        this.length = 0
                    }
                }
            },
        },
        renderer: new DOMRenderer.FixedRendererTarget('#channelsMenu'),

        $currentOpen: N$('initial'),
        $channelNameDisplay: N$('channelNameDisplay'),
        $chatWrapper: N$('chatWrapper'),

        //Registra um novo canal.
        registerChannel(chan = {}) {
            if (this.channels[chan.name]) {
                console.log(`The channel ${id} was aleardy registered.`)
                return
            }
            const channel = new Channel(chan)
            this.channels[chan.name] = channel
            document.body.appendChild(channel.getView())

            return channel
        },

        registerChannelList(list = []) {
            list.map(c => this.registerChannel(c))
        },

        //Escreve as mensagens nos canais certos.
        updateChannels(newData = {}) {
            const channelNames = Object.keys(newData)
            for (let i = 0; i < channelNames.length; i++) {
                const channelName = channelNames[i]
                if (newData[channelName].length === 0) {
                    continue
                } else {
                    this.channels[channelName].processData(newData[channelName])
                }
            }
        },

        //Faz com que as conversas de um canal aparecam na tela.
        openChannel(str) {
            this.$channelNameDisplay.innerText = '#' + str
            const chatView = this.channels[str].getView()
            this.$currentOpen.style.setProperty('opacity', 0)
            this.$currentOpen.style.setProperty('z-index', 0)
            this.$selectedChannelLabel && this.$selectedChannelLabel.classList.remove('selected')
            this.$selectedChannelLabel = this.channels[str].$channelLabel
            this.channels[str].$channelLabel.classList.add('selected')
            this.$currentOpen = chatView
            this.$currentOpen.style.setProperty('opacity', 1)
            this.$currentOpen.style.setProperty('z-index', 999999)//Isto parece errado

        },

        getChannel(name = "") {
            return this.channels[name]
        },

        //WARN: Seria melhor pegar o nome do canal de alguma fonte mais confialvel
        //do que `innerText`, além disso temos que retirar a '#' que fina no nome. 
        //porque é de se esperar que esses metodos funcionem de alguma forma mais 
        //complicada e 'bug-free'.
        getOpenChannelName() {
            if (this.$channelNameDisplay.innerText[0] === '#') {
                return this.$channelNameDisplay.innerText.slice(1)  //A '#' é o primeiro caractere
            } else {
                return this.$channelNameDisplay.innerText
            }
        },
        theOpenChannelIsValid() {
            return !(this.getOpenChannelName() === "Select an channel to begin...")
        },
        //Envia uma mensagem para um canal especifico
        async dispatchMessageToChannel(str, channel) {
            if (!TESTING_ENABLED) {
                //Caso o request falhe o propio modulo `Integration`
                //irá perguntar ao usuario se ele deseja reenviar
                const myComment = Integration.sendMessageToChannel(str, this.getOpenChannelId() )
                if(myComment.sucess){
                    this.updateChannels(myComment)
                }
            } else {
                this.updateChannels({
                    [channel]: [
                        {
                            userProfilePic: Users.me.avatar,
                            senderName: Users.me.name,
                            date: u.getTime(),
                            msgBody: str,
                        }
                    ]
                })
            }
        },

        //Envia uma nova mensagem para o canal aberto.
        //Adiciona itens a uma queue se o user não estiver registrado ou o modulo de 
        //Integração não foi carregado completamente. 
        //A minha ideia é guardar todas as mensagens que o usuario tentou enviar em
        //uma fila e então drena-la atualizando os objetos
        dispatchMessage(str) {
            const currentChannel = this.getOpenChannelName()
            if (!Users.currentUserIsRegistered || !Integration.loaded) {
                this.queue.add(currentChannel, {
                    userProfilePic: 'user-not-logged-in',
                    senderName: 'user-not-logged-in',
                    date: u.getTime(),
                    msgBody: str,
                })
                console.error('Cannot send message.\n' + !Integration.loaded ? 'The application in not completelly initialized' : 'The user is not registered')
                return false
            }
            this.dispatchMessageToChannel(str, currentChannel)
            return true
        },

        drainQueue() {
            this.queue.drain()
        },

        getAllChannelsIds() {
            return Object.values(Channels.channels).map(e => e.id)
        },

        getChannelByID(id) {
            const channels = Object.values(this.channels)
            return channels.filter(e => e.id === id)[0]
        },
        getOpenChannelId(){
            return this.channels[this.getOpenChannelName()].id
        }
        
    }

    //Quando se instancia um canal, ele já vem com uma div de
    //chat, um contador de novas mensagens e um `FixedRendererTarget`
    //para escrever as mensagens.
    class Channel {
        constructor(chan = {}) {

            ChannelStateManager.renderer.renderTemplate(channelTemplate, { CHANNEL_NAME: chan.name })
            this.id = chan.id
            this.name = chan.name
            this.newMessagesCount = 0
            this.$channelLabel = N$(chan.name + '.name')
            this.$newMessagesLabel = N$(chan.name + '.messageCount')
            this.$chatArea = Channel.createChatArea(chan.name)
            this.renderer = new DOMRenderer.FixedRendererTarget(this.$chatArea)
        }

        //Cria uma div, a que sera usada pelo `FixedRendererTarget`.
        static createChatArea(id = "") {
            const cdiv = document.createElement('div')
            cdiv.className = "chatArea"
            cdiv.id = id
            return cdiv
        }

        //Escreve o HTML apartir de uma lista de mensagens.
        processData(newData = []) {
            newData.map(d => {
                this.renderer.renderTemplate(chatTemplate, {
                    _IMAGE_LOCATION: d.userProfilePic,
                    _USER_NAME: d.senderName,
                    _POST_TIME: d.date,
                    _MESSAGE_BODY: d.msgBody,
                })
            })

            if (!(ChannelStateManager.$currentOpen.id === this.renderer.renderTarget.id)) {
                this.$newMessagesLabel.innerText = '+' + (this.newMessagesCount += newData.length);
            }
        }

        //Retorna o elemento HTML de ondeas mensagens estão
        //sendo escritas.
        getView() {
            this.$newMessagesLabel.innerText = this.newMessagesCount = 0;
            return this.renderer.renderTarget
        }
    }

    return {
        openChannel,
        updateChannels,
        registerChannel,
        $chatWrapper,
        $currentOpen,
        getChannel
    } = ChannelStateManager

}) ()

