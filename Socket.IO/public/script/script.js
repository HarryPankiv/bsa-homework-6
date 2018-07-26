const socket = io('http://localhost');
let name = "";
let nickname = "";
let user;
const send = document.getElementById("send");
const msgData = document.getElementById("msg-data");

socket.on("users", (u) => {
  clearUsers();
  showUsers(u);
});


socket.on("info", (data) => {
  let who = data[0];
  let what = data[1]?" joined the chat" : " left the chat";
  showAlert(who + what);
});



socket.on("messages", (data)=>{
  clearMessages();
  showMessages(data[0], data[1]);
});



window.onload = () => {
   $('#inf').hide();
  $('#myModal').modal('show');
};


window.onbeforeunload = () => {
 if(user.id){
   socket.emit("delete user", user.id);
 }
};



$('#myModal').on('hidden.bs.modal', function (e) {
  if(name || nickname) return;
  getUserInfo();
console.log(user.id);
});


function getUserInfo() {
  name = document.getElementById("name").value;
  nickname = document.getElementById("nickname").value;
  if (!name) {
      name = "User " + getRandomInt(10000, 99999).toString();
  }
  if (!nickname) {
      nickname = "stranger" + getRandomInt(10000, 99999).toString();
  }
  user =  {
    time: new Date(),
    name: name,
    nickname: nickname,
    id: guid(),
    user_status: 1
  };
  setTimeout((id)=>{
   socket.emit("update status", user.id); 
  }, 60000);
  document.title = user.name + " | My Chat";

  socket.emit("init", user);
}






send.addEventListener("click", ()=>{
  if(!msgData.value) return;
  console.log("added msg");
  msg = {
    date: new Date,
    id: guid(),
    from_id: user.id,
    from_name: user.name,
    data: msgData.value,
    typing: false
  }
  msgData.value = "";
  user.typing = false;
  socket.emit("client typing", user);
  socket.emit("send message", msg);
})


$("#msg-data").keyup(function(event){
    if(event.keyCode == 13){
        $("#send").click();
    }else{
      if(!msgData.value && user.typing){
        user.typing = false;
        socket.emit("client typing", user);
      }
      if(msgData.value && !user.typing){
        user.typing = true;
        socket.emit("client typing", user);
      }
      
    }
});



function clearMessages(){
  const messages = document.getElementById('messages');
  messages.innerHTML = "";
};


function clearUsers(){
  const users = document.getElementById('users');
  users.innerHTML = "";
};



function showMessages(msgs, usrs){
  console.log(msgs, usrs, "SH");
  const messages = document.getElementById('messages');
  
  for(let i = 0; i < msgs.length; i++){
    const message = document.createElement('li');
    if(msgs[i].data.indexOf("@" + user.nickname) == 0){
  message.setAttribute("class", "message-blue message list-group-item");
    }else{
    message.setAttribute("class", "message list-group-item");
    }
    const msgFrom = document.createElement('p');
    msgFrom.setAttribute("class", "message-name");
    msgFrom.innerHTML = msgs[i].from_name;
    message.appendChild(msgFrom);

    const msgBody = document.createElement('div');
    msgBody.setAttribute("class", "message-body");
    msgBody.innerHTML = msgs[i].data;
    message.appendChild(msgBody);

    const msgDate = document.createElement('div');
    msgDate.setAttribute("class", "message-time");
    let date = new Date(msgs[i].date);
    msgDate.innerHTML = date.getHours().toString() + ":" + date.getMinutes().toString() + ":" + date.getSeconds().toString();
    message.appendChild(msgDate);

    messages.appendChild(message);
  };
  messages.innerHTML += '<div id="typing"></div>';
  
  addWhoTyping(usrs);
};



function showUsers(usrs){
  const users = document.getElementById('users');
  for(let i = 0; i < usrs.length; i++){
    const usr = document.createElement('li');

    usr.setAttribute("class", "user list-group-item");

    const who = document.createElement('div');
    let t = usrs[i].name + "@" + usrs[i].nickname;
    if(t.length > 31){
    who.innerHTML = t.slice(0, 28) + "...";
    }else{
    who.innerHTML = t;
    }
    usr.appendChild(who);

    const status = document.createElement('div');
    if(usrs[i].user_status == 1){
    status.setAttribute("class", "stat-ja");
    status.innerHTML = "Just appeared";
    }
    if(usrs[i].user_status == 2){
    status.setAttribute("class", "stat-on");
    status.innerHTML = "Online";
    }
        if(usrs[i].user_status == 0){
    status.setAttribute("class", "stat-off");
    status.innerHTML = "Offline";
    }
    usr.appendChild(status);

    users.appendChild(usr);
  };
  
};

function addWhoTyping(usrs){
  const whoTyping = document.getElementById('typing');
  let typing = [];
  for(let i = 0; i < usrs.length; i++){
    if(usrs[i].typing && usrs[i].id != user.id){
      typing.push(usrs[i].name);
    }
  }
  if(typing.length > 0){
      let verb = typing.length == 1 ? " is ": " are ";
  whoTyping.innerHTML = typing.join(", ") + verb + "typing...";
  }else{
    whoTyping.innerHTML = "";
  }
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};


function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
};




function showAlert(msg){
  
  $("#inf").text(msg);
 $('#inf').show();
 setTimeout(()=>{
 $('#inf').hide();
 }, 3000);

};


