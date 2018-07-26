let name = ""; //TODO
let nickname = ""; //TODO
let user;
const send = document.getElementById("send");
const msgData = document.getElementById("msg-data");


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

  $.ajax({
    type: "POST",
    url: "http://localhost:1428/api/user/",
    data: JSON.stringify(user),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (data) {
      console.log(data);
    }
  });



  setInterval(function () {

    $.ajax({
      type: "GET",
      url: "http://localhost:1428/api/user",
      success: function (usrs) {
          clearUsers();
          showUsers(usrs);
      }
    });

        $.ajax({
      type: "GET",
      url: "http://localhost:1428/api/message",
      success: function (msgs) {
        clearMessages();
        showMessages(msgs);
      }
    });

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
    $.ajax({
    type: "POST",
    url: "http://localhost:1428/api/message/",
    data: JSON.stringify(msg),
    contentType: "application/json; charset=utf-8",
    dataType: "json"
  });
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


