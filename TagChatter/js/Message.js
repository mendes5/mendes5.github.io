//O módulo que eu pensei que seria o maior, acabou ficando um dos menores.

//É tão pequeno que nem vai ter um namespace!

//Vamos tentar resumir mais
(_ => {

    //Pega input de texto e o botão enviar
    const [msgTextInput, btnSend]  = [N$('textInput'), N$('btnSend')]

    //Testa se o canal e valido e se tem texto, limpa o texto e envia a mentsagem
    const sendMessage = e => Channels.theOpenChannelIsValid() && msgTextInput.value && Channels.dispatchMessage(msgTextInput.value) | (msgTextInput.value = "")
        
    //E isso acontece quando apertar o botão de enviar... 
    btnSend.onclick = sendMessage
    
    //E se apertarem enter.
    window.addEventListener('keydown', e => e.keyCode === 13 && sendMessage())
})()

//Uma coisa que eu não entendi até agora.
//Porque o server parecia enviar mensagens com fotos 
//de perfil e nomes de usuario que éram diferentes 
//depois de certos intervalos de tempo?

//Talvez para limpar mensagens que enviamos ou coisa assim...
