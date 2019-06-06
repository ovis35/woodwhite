var Terminal = Terminal || function(cmdLineContainer, outputContainer, config) {
  // needed vars
  var cmdLine = document.querySelector(cmdLineContainer);
  var output = document.querySelector(outputContainer);

  var fs = null;
  var cwd = null;
  var history = [];
  var histpos = 0;
  var histtemp = 0;

  window.addEventListener('click', function(e) {
    cmdLine.focus();
  }, false);

  cmdLine.addEventListener('click', inputTextClick, false);
  cmdLine.addEventListener('keydown', historyHandler, false);
  cmdLine.addEventListener('keydown', processNewCommand, false);

  // Helper functions
  function inputTextClick(e) {
    this.value = this.value;
  }

  function historyHandler(e) {
    if (history.length) {
      if (e.keyCode == 38 || e.keyCode == 40) {
        if (history[histpos]) {
          history[histpos] = this.value;
        } else {
          histtemp = this.value;
        }
      }

      if (e.keyCode == 38) { // up
        histpos--;
        if (histpos < 0) {
          histpos = 0;
        }
      } else if (e.keyCode == 40) { // down
        histpos++;
        if (histpos > history_.length) {
          histpos = history_.length;
        }
      }

      if (e.keyCode == 38 || e.keyCode == 40) {
        this.value = history[histpos] ? history[histpos] : histtemp;
        this.value = this.value; // Sets cursor to end of input.
      }
    }
  }

  function processNewCommand(e) {
    const CMDS = config.cmds;

    if (e.keyCode == 9) { // tab
      e.preventDefault();
      // Implement tab suggest.
    } else if (e.keyCode == 13) { // enter
      // Save shell history.
      if (this.value) {
        history[history.length] = this.value;
        histpos = history.length;
      }

      // Duplicate current input and append to output section.
      var line = this.parentNode.parentNode.cloneNode(true);
      line.removeAttribute('id')
      line.classList.add('line');
      var input = line.querySelector('input.cmdline');
      input.autofocus = false;
      input.readOnly = true;
      output.appendChild(line);
      var cmd = this.value.trim().split(' ')[0].toLowerCase();

      if (!(cmd in config.commands) && cmd != '') cmd = "default";

      var argString = this.value.replace(cmd, "").trim();
      output_(config.commands[cmd](argString));

      window.scrollTo(0, getDocHeight());
      this.value = ''; // Clear/setup line for next input.
    }
  }

  //
  function output_(html) {
    if (html === undefined) return;
    output.insertAdjacentHTML('beforeEnd', '<p>' + html + '</p>');
  }

  // Cross-browser impl to get document's height.
  function getDocHeight() {
    var d = document;
    return Math.max(
        Math.max(d.body.scrollHeight, d.documentElement.scrollHeight),
        Math.max(d.body.offsetHeight, d.documentElement.offsetHeight),
        Math.max(d.body.clientHeight, d.documentElement.clientHeight)
      );
    }

  // add custom attributes here. Refer to "this.<custom-attribute>" later via term.<custom-attribute>
  this.user = "guest";
  this.prompt = config.prompt.replace("user", this.user);
  this.loggedIn = 0; // no. 1 is admin

  // add custom functions here
  this.init = () => {
    output_('<h1 style="letter-spacing: 3px">Wood White</h1><h5 style="letter-spacing: 35px; margin-top: -10px">木白數碼創意</h5><p style="margin-top: 30px;font-size: 5px">' + new Date() + '</p><p>需要協助嗎? 輸入 \'help\' 取得更多資訊！</p>');
    $('.prompt').html(this.prompt);
  }

  this.login = (user, pw) => {
    if (user === "admin" && pw === "50990371") {
      this.prompt = config.prompt.replace("user", user);
      $('.prompt').html(this.prompt);
      output_("登入成功！Hi~  "+user);
    } else {
      output_("帳密錯誤！");
    }
  }

  this.logout = () => {
    this.prompt = config.prompt.replace("user", "guest");
    $('.prompt').html(this.prompt);
    output_("Logged out");
  }
};
