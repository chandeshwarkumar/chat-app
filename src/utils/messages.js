const generateMessage = (username, text, sameUser = false) => {
    return {
        username,
        text,
        createdAt: new Date().getTime(),
        sameUser
    }
}

module.exports = {
    generateMessage
}