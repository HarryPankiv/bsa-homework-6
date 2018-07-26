let name = ""; //TODO
let nickname = ""; //TODO
let user;
const send = document.getElementById("send");
const msgData = document.getElementById("msg-data");

let usrs, msgs;
/*
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
*/


window.onload = () => {
  $('#inf').hide();
  $('#myModal').modal('show');
};


window.onbeforeunload = () => {
  if (user.id) {
    socket.emit("delete user", user.id);
  }
};



$('#myModal').on('hidden.bs.modal', function (e) {
  if (name || nickname) return;
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
  user = {
    time: new Date(),
    name: name,
    nickname: nickname,
    id: guid()
  };
  document.title = user.name + " | My Chat";

  sendAJAX("POST", "http://localhost:1428/api/user/", user, function(){});



  setInterval(function () {

    let msgs, usrs;
    usrs = sendAJAX("GET", "http://localhost:1428/api/user/", {}, usersService);

    function usersService(data) {
      if(data){
      clearUsers();
      showUsers(data);
      }
    };

    msgs = sendAJAX("GET", "http://localhost:1428/api/message/", {}, messageService);

    function messageService(data) {
      if(data){
      clearMessages();
      showMessages(data);
      }
    };

  }, 100);
}






send.addEventListener("click", () => {
  if (!msgData.value) return;
  console.log("added msg");
  msg = {
    date: new Date,
    id: guid(),
    from_id: user.id,
    from_name: user.name,
    data: msgData.value,
  }
  msgData.value = "";
  sendAJAX("POST", "http://localhost:1428/api/message/", msg, function(){});
})



$("#msg-data").keyup(function (event) {
  if (event.keyCode == 13) {
    $("#send").click();
  }
});



function clearMessages() {
  const messages = document.getElementById('messages');
  messages.innerHTML = "";
};


function clearUsers() {
  const users = document.getElementById('users');
  users.innerHTML = "";
};



function showMessages(msgs) {
  const messages = document.getElementById('messages');
if(!msgs)return;
  for (let i = 0; i < msgs.length; i++) {
    const message = document.createElement('li');
    if (msgs[i].data.indexOf("@" + user.nickname) == 0) {
      message.setAttribute("class", "message-blue message list-group-item");
    } else {
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


    messages.appendChild(message);
  };


};



function showUsers(usrs) {
  if(!usrs)return;
  const users = document.getElementById('users');
  for (let i = 0; i < usrs.length; i++) {
    const usr = document.createElement('li');

    usr.setAttribute("class", "user list-group-item");

    const who = document.createElement('div');
    let t = usrs[i].name + "@" + usrs[i].nickname;
    if (t.length > 31) {
      who.innerHTML = t.slice(0, 28) + "...";
    } else {
      who.innerHTML = t;
    }
    usr.appendChild(who);


    users.appendChild(usr);
  };

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


function sendAJAX(method, url, js_data, callback) {

  var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance 
  xmlhttp.open(method, url);
  if (method == 'POST') {
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(js_data));
  } else {
    xmlhttp.send();
  }

  xmlhttp.onreadystatechange = function () {

    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      callback(JSON.parse(xmlhttp.responseText));
    }
  }

}