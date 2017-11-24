
//Este modulo Cria e gerencia os 3 paineis da pagina.

//Já que não tem nada pra por em uma api publica,
//este módulo não terá um namespace.
(_ => {

    //Seria legal que eles usassem o DOMRenderer, más esta biblioteca
    //não existia ainda, e eu gostei deste código.
    class Pannel {
        constructor(idSelector = "") {
            this.element = N$(idSelector)
        }
        update(pId) {
            if (pId === this.element.id || this.isActive()) {
                this.toggle()
            }
        }
        isActive() {
            return this.element.classList.contains("whenActive")
        }
        toggle() {
            this.element.classList.toggle("whenActive")
        }

    }

    const buttons = [
        'btnChannels',
        'btnUsers',
        'btnConfig',
    ].map(e => N$(e))

    const pannelsIDs = [
        'channelsMenu',
        'usersMenu',
        'configMenu',
    ]

    buttons.forEach(e => e.onclick = event => updatePannels(event))
    buttons.forEach((e, i) => e.referencesPannel = pannelsIDs[i])

    const pannels = pannelsIDs.map(e => new Pannel(e))

    function updatePannels(event) {
        const pannelId = event.path[0].referencesPannel
        pannels.forEach(e => e.update(pannelId))
    }

})()