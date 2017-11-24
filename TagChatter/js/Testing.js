//Cria comentarios, canais e usuarios falsos.
//Bom para testes.
const Testing = (_ => {

    //Channels

    const TestChannels = [
        "Ruby",
        "Javascript",
        "Lua",
        "Node",
        "Go",
        "Java",
        "Perl",
        "ActionScript",
        "Python",
    ]

    function generateBizarrousChannels() {
        u.array(u.randInt(5)).map(e => u.randWords).map(e => Channels.registerChannel(s))
    }


    const randPictures = [
        './img/profilepix.png'
    ]

    const createSigleChatPacket = e => ({
        userProfilePic: u.randItemOf(randPictures),
        senderName: u.randWords(10),
        date: u.getTime(),
        msgBody: u.randWords(500)
    })

    const createChatDataPayload = e => {
        const payload = {}
        TestChannels.map(s => payload[s] = u.array(u.randInt(10)).map(e => createSigleChatPacket()))
        return payload
    }

    const createSizedDataPayload = e => {
        const payload = {}
        TestChannels.map(s => payload[s] = u.array(u.randInt(10)).map(e => createSigleChatPacket()))
        return payload
    }

    function randomlyGenerateComments() {
        Channels.updateChannels(createChatDataPayload())
    }

    //Users
    const names = [
        'Cold Meson_06',
        'FuckerFlicker75',
        'TheOldMan',
        'Poodiepie',
        'BlueDude62',
        'FullMetal_67',
        'Wheatley_555'
    ]

    const userFactory = e => ({
        avatar: u.randItemOf(randPictures),
        name: u.randItemOf(u.randWords(30)),
        id: u.UUID(),
    })

    const buildArrayOfUsers = e => u.array(names.length).map(e => userFactory())

    const buildSizedArrayOfUsers = e => u.array(e).map(e => userFactory())

    const registerFakeUsers = e => Users.registerUserList(buildArrayOfUsers())

    const registerRandAmountOfFakeUsers = e => Users.registerUserList(buildSizedArrayOfUsers(e))


    const options = {
        channel: {
            wordMaxLenght: 8,
            minTimeout: 1000,
            maxTimeout: 3000,
        },
        users: {
            maxSpawnAmount: 8,
            minSpawnAmount: 1,
            minTimeout: 1000,
            maxTimeout: 3000,
        },
        comments: {
            minTimeout: 1000,
            maxTimeout: 3000,
        }
    }


    let spawningChannels = false

    function spawnNextChannel() {
        if (spawningChannels) {
            const newChannelName = u.randWords(options.channel.wordMaxLenght)
            TestChannels.push(newChannelName)
            Channels.registerChannel(newChannelName)
            u.callAfter(spawnNextComment, u.randIntBetw(options.channel.minTimeout, options.channel.maxTimeout))
        }
    }

    function toggleNewChannels() {
        spawningChannels = !spawningChannels
        if (spawningChannels) {
            spawnNextChannel()
            console.warn('Initializing channel random spawn logic.')
        } else {
            console.info('Disabling channel random spawn logic.')
        }
    }

    let spawningNewUsers = false

    function spawnNextUser() {
        if (spawningNewUsers) {
            Users.registerUserList(registerRandAmountOfFakeUsers(u.randIntBetw(options.users.minSpawnAmount, options.users.maxSpawnAmount)))
            u.callAfter(spawnNextUser, u.randIntBetw(options.users.minSpawnTimeout, options.users.maxSpawnTimeout))
        }
    }

    function toggleNewUsers() {
        spawningNewUsers = !spawningNewUsers
        if (spawningNewUsers) {
            spawnNextUser()
            console.warn('Initializing user random spawn logic.')
        } else {
            console.info('Disabling user random spawn logic.')
        }
    }


    function spawnNextComment() {
        if (spawningNewComments) {
            Channels.updateChannels(createChatDataPayload())
            u.callAfter(spawnNextComment, u.randIntBetw(options.comments.minTimeout, options.comments.maxTimeout))
        }
    }

    function toggleFakeComments() {
        spawningNewComments = !spawningNewComments
        if (spawningNewComments) {
            spawnNextComment()
            console.warn('Initializing random fake comment spawn logic.')
        } else {
            console.info('Disabling random fake comment spawn logic.')
        }
    }

    function stopAll() {
        spawningNewComments = false
        spawningChannels = false
        spawningNewUsers = false
    }


    return {
        randomlyGenerateComments,
        registerFakeUsers,
        generateBizarrousChannels,
        toggleNewUsers,
        toggleFakeComments,
        toggleNewChannels,
        stopAll,
        options,
        doAllTests() {
            TestChannels.map(s => Channels.registerChannel(s))
            registerFakeUsers()
            Channels.updateChannels(createChatDataPayload())
        }
    }

})()
