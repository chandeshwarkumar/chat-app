const socket = io()
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#sendLocation')
const $messages = document.querySelector('#messages')
var innerMsg

window.onload = function() {
    innerMsg = document.getElementsByClassName('inner-message')
}
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMsgTemplate = document.querySelector('#locationMsg-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    const $newMessage = $messages.lastElementChild
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
    const visibleHeight = $messages.offsetHeight
    const containerHeight = $messages.scrollHeight
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (Math.round(containerHeight - newMessageHeight - 1) <= Math.round(scrollOffset)) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    if (message.username.toLowerCase() === username.toLowerCase()) {
        innerMsg = document.getElementsByClassName('inner-message')
        const $newMessage = $messages.lastElementChild
        $newMessage.classList.add("sameUser")
        f = innerMsg[innerMsg.length - 1]
        f.setAttribute('style', 'background-color: #7C5CBF; color:#fff')
        para = f.children
        spans = para[0].children
        spans[1].style.color = '#fff'

    } else {
        const $newMessage = $messages.lastElementChild
        $newMessage.classList.add("other-user")
            //innerMsg.lastElementChild.classList.add("other-user-inner-msg")
    }
    autoscroll()
})

socket.on('locationMsg', (locationObject) => {
    const html = Mustache.render(locationMsgTemplate, {
        username: locationObject.username,
        url: locationObject.text,
        createdAt: moment(locationObject.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    if (locationObject.username.toLowerCase() === username.toLowerCase()) {
        innerMsg = document.getElementsByClassName('inner-message')
        const $newMessage = $messages.lastElementChild
        $newMessage.classList.add("sameUser")
        f = innerMsg[innerMsg.length - 1]
        f.setAttribute('style', 'background-color: #7C5CBF; color:#fff')
        para = f.children
        para[1].children[0].setAttribute('style', 'color: #fff !important')
        spans = para[0].children
        spans[1].style.color = '#fff'

    } else {
        const $newMessage = $messages.lastElementChild
        $newMessage.classList.add("other-user")
            //innerMsg.lastElementChild.classList.add("other-user-inner-msg")
    }
    autoscroll()
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', 'disabled')
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if (error) {
            return console.log(error)
        }
    })
})

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('geolocation is not supported by your browser')
    }
    $sendLocationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (status) => {
            $sendLocationButton.removeAttribute('disabled')
            console.log(status)
        })
    })

})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})