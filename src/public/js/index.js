const socket = io()
const chatbox = document.getElementById('chatbox')
let user = sessionStorage.getItem('user')|| ''

if(!user){
    Swal.fire({
        title: 'Auth',
        input: 'text',
        text: 'Set username',
        inputValidator: value=>{
            return !value.trim() && 'Please. Insert your username'
        },
        allowOutsideClick: false
    }).then(result =>{
        user = result.value
        document.getElementById('username').innerHTML = user
        sessionStorage.setItem("user", user)
        socket.emit('new', user)
    })
}else{
    document.getElementById('username').innerHTML = user
    sessionStorage.setItem("user", user)
    socket.emit('new', user)
}

chatbox.addEventListener('keyup', e =>{
    if(e.key === 'Enter'){
        const message = chatbox.value.trim()
        if(message.length > 0){
            socket.emit('message', {
                user,
                message
            })
            chatbox.value = ''
        }
    }
})

socket.on('logs', data=>{
    const divLogs = document.getElementById('logs')
    let messages = ''
    data.forEach(message => {
        messages = `<p><i>${message.user}: </i> ${message.message}</p>` + messages
        
    });
    divLogs.innerHTML = messages
})