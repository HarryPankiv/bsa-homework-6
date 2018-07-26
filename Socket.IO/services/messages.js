messages = [];


module.exports = {
    messages: messages,
    addMessage: (msg)=>{
        messages.push(msg);
        if(messages.length > 100){
            messages.shift();
        };
    }
}