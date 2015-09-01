// YOUR CODE HERE:

var app = {
  roomNames: [],
  displayRoom:null,
  friends:[],
  dropPress: false,
  server: 'https://api.parse.com/1/classes/chatterbox',
  init: function () {
    $('.chatForm').submit(function(e){
      e.preventDefault();
      app.send({
        username:window.location.search.replace('?username=', ''),
        text:e.target[1].value,
        roomname:'room'
      });
    });

    $('.rooms').on('change', function (e) {

      var room = e.target.selectedIndex;
      var roomVal = e.target[room].value;
      if (app.displayRoom !== roomVal) {
        app.displayRoom = roomVal;
      } 
      if (room === 0) {
        app.displayRoom = null;
      }
      $('#chats').text('');
      app.dropPress = true;
      app.fetch();
    });

    $('#chats').on('click', '.username', function(e){
      var friend = e.target.textContent;
      if(app.friends.indexOf(friend) === -1) {
        app.friends.push(friend);
      }
      console.log('friends', app.friends);
    });

    app.fetch();
  },

  getRoomNames:function(data) {
    if(data && this.roomNames.indexOf(data.roomname) === -1) {
      this.roomNames.push(data.roomname);
      this.displayRooms(data);
    }
  },
  // displayRooms --> appends room names to dropdown
  displayRooms: function (array) {
    // $('.rooms').text('');
    var allRooms = $('<option></option>').text(array.roomname);
    $('.rooms').append(allRooms);
  },
  
  send: function (e) {
    
    var message = {
      username: e.username,//window.location.search.replace('?username=', ''),
      text: e.text,
      roomname: e.roomname
    };
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(message),
      success: function (data) {
        console.log("shabang");
      },
      error: function (data) {
        console.log('You dun did sumthin wrong boy');
      }
    });
  },

  filterByRoom: function (chats) {
    if(!app.displayRoom) {
      return chats;
    }
    var filtered = chats.filter(function(ch) {
      return app.displayRoom === ch.roomname;
    });
    return filtered;
  },

  fetch: function () {
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        var res = data.results;
        for(var i=0; i < res.length; i++) {
          app.getRoomNames(res[i]);
          app.printChat(res[i]);
        }      
      },
      error: function (data) {
        console.error("major fail brah");
      }
    });
  },

  printChat: function (chatArr) {
    //$('#chats').text('');
    //var validChats = app.filterByRoom(chatArr);
    if(app.displayRoom && chatArr.roomname !== app.displayRoom) {
      return;
    }
    if (chatArr.roomname && chatArr.text && chatArr.username) {
      var chat = chatArr;
      var $chat = $('<div class="chat"></div>');
      var $userName = $('<p class="username"></p>');
      var $message = $('<p class="message"></p>');
      var $room = $('<p></p>');
      $room.append(document.createTextNode(chat.roomname));
      $userName.append(document.createTextNode(chat.username));
      $message.append(document.createTextNode(chat.text));
      $chat.append($userName);
      $chat.append($message);
      $chat.append($room); 
      if (!app.dropPress) {
        $("#chats").prepend($chat);
      } else {
        app.dropPress = false;
        $("#chats").hide().prepend($chat).fadeIn(600);
      }
    }    
  }
};
setInterval(app.fetch, 4000);