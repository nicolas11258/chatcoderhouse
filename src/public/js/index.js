const socket = io();
socket.emit('message', 'Hola, esto es un mensaje desde el front');

socket.on('messageLogs', data => {
    let log = document.getElementById('messageLogs');
    let messages = '';
    data.forEach(message => {
        if (message.user && message.message){
            messages = `${messages} ${message.user} dice: ${message.message} </br>`;
        }
    });
    log.innerHTML = messages;
});

socket.on('userConnected', userName => {
    Swal.fire({
        text: `${userName} se ha unido al chat`,
        toast: true,
        position: 'top-right'
    })
})

let user;
let chatBox = document.getElementById('chatBox');

chatBox.addEventListener('keyup', evt => {
    if(evt.key === 'Enter'){
        if(chatBox.value.trim().length > 0){
            socket.emit('message', {
                user:user, 
                message: chatBox.value
            });
            chatBox.value = '';
        }
    }
});


Swal.fire({
    title: 'Identificate',
    input: 'text',
    text: 'Ingresa tu nombre para identificarte',
    inputValidator: (value)=>{
        if(!value){
            return 'Debes ingresar un nombre de usuario para continuar';
        }
    },
    allowOutsideClick: false
}).then((result)=>{
    user = result.value;
    socket.emit('auth', user);
})

