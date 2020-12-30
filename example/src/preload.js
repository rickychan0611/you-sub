// Simply preload script used in one of the example webviews
let youtubeAvatar;
let button;
var ipcRenderer = require('electron').ipcRenderer;
require('events').EventEmitter.defaultMaxListeners = Infinity;

window.onload = () => {
  setTimeout(() => {
    youtubeAvatar = document.getElementById("avatar-btn");
    console.log('window onload', youtubeAvatar)
    ipcRenderer.send('youtubelogin', youtubeAvatar !== null ? "youtubeLogedIn" : "not logged in");
  }, 1500)

  setTimeout(() => {
    button = document.getElementById("confirm-button");
    console.log(button, "This loads no problem!");
    button.click()
    ipcRenderer.send('subscribed', "subscribed");
  }, 2500)

};

