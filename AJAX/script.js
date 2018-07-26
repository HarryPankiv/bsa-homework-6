var inviteButton = document.getElementById("inviteButton");
var inviteName = document.getElementById("inviteName");
var inviteNick = document.getElementById("inviteNick");
var inviteForm = document.getElementById("inviteform");
var ULasideUsers = document.getElementById("users-name-list");
var headerChatTitle = document.getElementById("header-chat-title");
var textMessageFooter = document.getElementById("text-message-footer");
var buttonMessageFooter = document.getElementById("button-message-footer");
var mainWrapperMessages = document.getElementById("main-wrapper-messages");
var mainWrapperChat = document.getElementById("main-wrapper-chat");
var contentMessage = mainWrapperMessages.getElementsByClassName("message-content");
var headerNameUser;

var nameUser = "User name";
var newUser;

inviteButton.addEventListener("click", function() {
    if(inviteName.value != "" && inviteNick.value != "") {
        
        newUser = {
            name: inviteName.value,
            nickname: inviteNick.value
        }

        inviteName.value = "";
        inviteNick.value = "";

        ajaxRequest({
            method: 'POST',
            url: '/users',
            data: newUser
        })

        headerChatTitle.innerHTML = `You successfully joined in chat  <span id="headerName">${newUser.nickname}</span`;
        headerNameUser = document.getElementById("headerName");
        inviteForm.style.display = "none";
        mainWrapperChat.style.display = "grid";       
        setTimeout(function() {
            getUsers();
            getMessages();
        }, 1);
        setInterval(function() {
            getUsers();
            getMessages();
        }, 4000)
    } else {
        alert("You have empty name or nickname fields");
    }
    
});

buttonMessageFooter.addEventListener("click", function() {
    newMessage = {
        name: newUser.name,
        nickname: newUser.nickname,
        text: textMessageFooter.value,
        time: new Date()
    }
    textMessageFooter.value = "";
    ajaxRequest({
        method: 'POST',
        url: '/messages',
        data: newMessage
    })
});

var ajaxRequest = function(options) {
    let url = options.url || '/';
    let method = options.method || 'GET';
    let callback = options.callback || function () { };
    let data = options.data || {};
    let xmlHttp = new XMLHttpRequest();

    xmlHttp.open(method, url, true);
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.send(JSON.stringify(data));

    xmlHttp.onreadystatechange = () => {
      if (xmlHttp.status == 200 && xmlHttp.readyState === 4) {
        callback(xmlHttp.responseText);
      } 
    };
  };


var getUsers = function() {
    ajaxRequest({
        url: '/users',
        method: 'GET',
        callback: (users) => {
          users = JSON.parse(users);
          console.log(ULasideUsers);
          ULasideUsers.innerHTML = '';
          for (var i in users) {
            if (users.hasOwnProperty(i)) {
              var el = document.createElement("li");
              if(users[i].nickname == newUser.nickname) {
                el.innerHTML = `<i class="fa fa-user-circle-o" style='color: blue;'></i> ${users[i].nickname}`	   
              } else {
                el.innerHTML = `<i class="fa fa-user-circle-o"></i> ${users[i].nickname}`	         
              }
              ULasideUsers.appendChild(el); 
            }
          }
        }
      });
}

var displayMessages = function(msg) {

    var namePlace = document.createElement("p");
    namePlace.className = "nick-name-message";
    namePlace.innerText = `${msg.name}(@${msg.nickname})`;

    var timePlace = document.createElement("p");
    timePlace.className = "time-sent-message";

    let date = new Date(msg.time);

    var mm = date.getMonth(); 
    var dd = date.getDate();
    var hh = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();

    var mS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']; 

    timePlace.innerText = `${[  (hh>9 ? '' : '0') + hh + 'h', 
                                (min>9 ? '' : '0') + min + 'm', 
                                (sec>9 ? '' : '0') + sec + 's',
                                (dd>9 ? '' : '0') + dd,
                                mS[+((mm>9 ? '' : '0') + mm)],
                                date.getFullYear()
                             ].join(',')}`;

    var textPlace = document.createElement("p");
    var str =  msg.text;
                    
    if(str.indexOf(`@${newUser.nickname} `) != -1) {
        textPlace.className = "message-user-text message-user-text-regex";
    } else {
        textPlace.className = "message-user-text";
    }
    textPlace.innerText = msg.text;

    var wrapperMessage = document.createElement("div");
    if(msg.nickname == newUser.nickname) {
        wrapperMessage.className = "message-content current-user";
    } else {
        wrapperMessage.className = "message-content other-user";
    }
    wrapperMessage.appendChild(namePlace);
    wrapperMessage.appendChild(timePlace);
    wrapperMessage.appendChild(textPlace);
    mainWrapperMessages.appendChild(wrapperMessage);
}

var getMessages =  function() {
    ajaxRequest({
        url: '/messages',
        method: 'GET',
        callback: (messages) => {
          messages = JSON.parse(messages);
          console.log(mainWrapperMessages);
          mainWrapperMessages.innerHTML = '';
          for (var i in messages) {
            if (messages.hasOwnProperty(i)) {
                displayMessages(messages[i]);
            }
          }
        }
      });
}
