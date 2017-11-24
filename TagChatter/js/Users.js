//Este modulo apenas cuida de adicionar os usuarios
//a lista conforme eles aparecem.
//Alem de lidar com o `currentUser`

DOMRenderer.registerTemplate('userTemplate')
    `<div class="userItem">
    <img class="userItemPicture" src=IMAGE_LOCATION />
    <p class="userNameInList">USER_NAME</p><br>
    <p class="lastSeen">Last Seen LAST_ACTIVE</p>
</div>
`

//Santa poluição do objeto `window`! Porêm este modulo ficou bem em um objeto.
const userTemplate = DOMRenderer.getTemplate('userTemplate')

//Lanca erros se nessesario
function validateUser(userData = {}) {
    if (Users.getUserByID(userData.id)) {
        console.log(`The user ${userData.name} was aleardy registered.`)
        return false
    }
    if (!u.validateObject(userData, ['avatar', 'name', 'id'])) {
        console.error('Falied to register the user: ', userData, ' invalid object.')
        return false
    }
    return true
}

//Gerencia, Amarzena e Registra usuarios. 
const Users = {
    users: {},
    me: {},
    userListRenderer: new DOMRenderer.FixedRendererTarget('.usersMenu'),
    currentUserIsRegistered: false,
    registerUser(userData = {}) {
        if (!validateUser(userData)) {
            return
        }
        userData.lastActive = u.getTime()
        this.users[userData.id] = userData
        this.userListRenderer.renderTemplate(userTemplate, {
            IMAGE_LOCATION: userData.avatar,
            USER_NAME: userData.name,
            LAST_ACTIVE: userData.lastActive,
        })
    },
    registerCurrentUser(data) {
        const users = document.getElementsByClassName('currentUserPicturePlaceHolder')
        for (let i = 0; i < users.length; i++) {
            users.item(i).src = data.avatar
        }
        this.currentUserIsRegistered = true
        this.me = data
        Channels.drainQueue()   //Caso o usuario tenha de alguma forma conseguido escrever mesagens enquanto 
    },                          //ele não estava registrado, talvez o GET '/me' esteja demorando. 
    getUserByID(id = "") {
        return this.users[id]
    },
    registerUserList(usersData = []) {
        usersData.map(d => this.registerUser(d))
    }
}


