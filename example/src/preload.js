// Simply preload script used in one of the example webviews
let youtubeAvatar;

window.onload = () => {
  setTimeout(() => {
    youtubeAvatar = document.getElementById("avatar-btn");
    console.log('window onload', youtubeAvatar)
    var ipcRenderer = require('electron').ipcRenderer;
    ipcRenderer.send('query', youtubeAvatar !== null ? "youtubeLogedIn" : "no");
  }, [1200])
};
 
