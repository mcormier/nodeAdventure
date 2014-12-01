
 // Cursor animation toggler
 // ---------------------------------------------------------------------
  function toggleCursorVisibility() {
    var elem = $('cursor');
    var opacity = elem.style.opacity;
    if ( opacity == 1 ) {
      elem.style.opacity = 0;
    } else {
      elem.style.opacity = 1;
    }
  }

    // HTML Display 
    // -------------------------------------------------------------------------------------
    function htmlForString(command) { return command.replace(/ /g, "&nbsp;"); }
    function addBlankLIneToMonitor() { addDivWithText('&nbsp;'); }

    function addDivWithText(msg) {
       var display = $("workarea");
       var div = document.createElement("div");
       div.className = "text_response";

       // Only convert blank lines or else word wrap won't work
       if (!msg.replace(/\s/g, "").length) {
         div.innerHTML = htmlForString(msg);
       } else {
         div.innerHTML = msg;
       }
       display.appendChild(div);
    }

    function addTextToMonitor(msg) {
        var lines = msg.split("\n");
        for (var i = 0; i < lines.length; i++ ) {
          addDivWithText(lines[i]);
        }
    }

    // Simple version for now
    function scrollToBottom () {
       var display = $("workarea");
       display.scrollTop += display.scrollHeight;
    }


 
    // Keyboard input
    // ---------------------------------------------------------------------
    // Got the majority of the idea from here.  Doesn't support left and rig
    // which would make things a little more complicated.
    //
    // http://stackoverflow.com/questions/3758023/how-to-use-this-square-cur
    //
    // Could push this into an editor class
    function captureKeyInput(e) {
      var input_elem = $("cmd_input");

      // Firefox uses charChode.  Webkit (Safari/Chrome) uses keyCode.
      var key = e.keyCode ? e.keyCode : e.charCode;
      console.log("-->" + key);
      console.log(e);

      if ( typeof e.preventDefault != "undefined" ) {
      //  console.log("found preventDefault");
        e.preventDefault();
        e.returnValue = false;
        cancelBubble = true;
        e.stopImmediatePropagation();
        e.bubbles = false;
      } 

      // Handle control characters first
      if (key == 13 ) {
        handleEnter(e);
        return false;
      }

      // Handle deletes
      if (key == 8 ) { 
        command_string = command_string.substring(0,command_string.length-1)
        input_elem.innerHTML = htmlForString(command_string);
        e.preventDefault();
        return false; 
      }

      command_string = command_string + String.fromCharCode(key);

      input_elem.innerHTML = htmlForString(command_string);
      return false;
    }


    function keyDownHandler(e) {
      var key = e.keyCode ? e.keyCode : e.charCode;

      // Fix for Chrome MAC delete key causes page to navigate back
      if (key == 8 ) {
        if( ! PPUtils.isFirefox() ) {
          captureKeyInput(e);
        }
        e.bubbles = false;
      } 

      if (key == 32 && PPUtils.isFirefox() ) {
        e.bubbles = false;
      } 

    } 


    function handleEnter(e) {
      var key = e.keyCode ? e.keyCode : e.charCode;

      if (key == 13 ) {
        addBlankLIneToMonitor();
        addTextToMonitor('> ' + command_string);
        socket.emit('command', command_string);
        $("cmd_input").innerHTML='';
        command_string = '';
      }
    }


  // Web socket functions
  // ---------------------------------------------------------------------
  function getWebSocket(local) {
    if (local) {
      console.log("Running in local test mode");
      return io.connect('http://127.0.0.1:8080');
    } 

    return  io.connect('http://nodejs-catts.rhcloud.com:8000');
  }

  function displayHandler (msg) {
       addBlankLIneToMonitor();
       addTextToMonitor(msg.description);

       if ( msg.items.length == 1 ) { 
         addBlankLIneToMonitor();
         addTextToMonitor("There is a " + msg.items[0] + " here" );
       }

       if ( msg.items.length > 1 ) { 
         addBlankLIneToMonitor();
         addTextToMonitor("The following items are here:");
         addTextToMonitor(msg.items.join(", "));
       }

       if ( msg.exits.length > 0 ) { 
         addBlankLIneToMonitor();
         for ( var i = 0; i < msg.exits.length; i++ ) {
           var name = msg.exits[i].name;
           var join_word = " a ";
           // Hack to support one word location  in darksecret versus CATSS
           // versus longer descriptions with the
           if ( name.toLowerCase().indexOf('the') == 0 ) {
             join_word = "";
           } 

           addTextToMonitor("To the " + msg.exits[i].direction +
                              " you see " + join_word + name + "." );
         }
       }
 
       scrollToBottom();
  }

 function errorMsgHandler(msg) {
   addBlankLIneToMonitor();
   addTextToMonitor(msg);
   scrollToBottom();
 }

 function displayMsgHandler(msg) {
   addBlankLIneToMonitor();
   addTextToMonitor(msg);
   scrollToBottom();
 }



