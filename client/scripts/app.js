// YOUR CODE HERE:

var app = {
  roomNames: [],
  displayRoom:null,

  init: function () {
    $('.chatForm').submit(function(e){
      e.preventDefault();
      app.send(e);
    });

    $('.rooms').on('change', function (e) {
      console.log(e.target.selectedIndex);
      var room = e.target.selectedIndex;
      var roomVal = e.target[room].value;

      if (this.displayRoom !== roomVal) {
        this.displayRoom = roomVal;
      } 
      if (room === 0) {
        this.displayRoom = null;
      }
      console.log('new room set at : ', this.displayRoom);
    });

    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        // ref data.results
        // array of chats
        for(var i=0; i < data.results.length; i++) {
          app.getRoomNames(data.results[i]);
        }
        app.displayRooms(app.roomNames);
      },
      error: function (data) {
        console.error("major fail brah");
      }
    });
  },

  getRoomNames:function(data) {
    if(this.roomNames.indexOf(data.roomname) === -1) {
      this.roomNames.push(data.roomname);
    }
  },

  displayRooms: function (array) {
    this.roomNames = _.filter(array, function (item) {
      return typeof item === 'string' && item.length < 20;
    });
    var allRooms = _.map(this.roomNames, function (room) {
      return $('<option></option>').text(room);
    });
    $('.rooms').append(allRooms);
  },
  
  send: function (e) {
    var message = {
      username: window.location.search.replace('?username=', ''),
      text: e.target[0].value,
      roomname: "<script>alert('TEHEHE')</script>"
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

  fetch: function () {
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        // ref data.results
        // array of chats
        app.printChat(data.results);
        //console.dir(data);
      },
      error: function (data) {
        console.error("major fail brah");
      }
    });
  },

  printChat: function (chatArr) {
    for (var i = 0; i < chatArr.length; i++) {
      var chat = chatArr[i];
      var $chat = $('<div class="chat"></div>');
      var $userName = $('<p class="username"></p>');
      var $message = $('<p class="message"></p>');
      $userName.append(document.createTextNode(chat.username));
      $message.append(document.createTextNode(chat.text));
      $chat.append($userName);
      $chat.append($message);
      if (!this.displayRoom) {
        $("#chats").prepend($chat);
      }
      
    }
  }

};

setInterval(app.fetch, 5000);

// var message = {
//   username: 'shawndrost',
//   text: 'trololo',
//   roomname: '4chan'
// };