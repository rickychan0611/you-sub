import React, { useEffect, useState, useContext } from 'react'
import ElectronBrowserView from '../../../../lib/ElectronBrowserView'
import SetInterval from 'set-interval'
import firebase from 'firebase/app'
import { useHistory } from "react-router-dom";
import { db, auth } from "../../../../firebaseApp";
import { resolve } from 'path'
import { Context } from '../../context/Context';
import moment from "moment";
import congrat from '../../assets/congrat.jpg';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Icon from '@material-ui/core/Icon';
import { Divider } from '@material-ui/core';
import { start } from 'repl';

const delay = require('delay');

const preload = resolve('./example/src/preload.js')

var ipcMain = require("electron").remote.ipcMain;
var electronOpenLinkInBrowser = require("electron-open-link-in-browser");
const { shell } = require('electron');

let view;
// URL we want to toggle between
const View = () => {
  let history = useHistory();
  const { user, setUser, onlineUsers, admin } = useContext(Context)

  const urls = [
    'https://www.youtube.com/channel/UCpqk_tJt2AvGcQm22oQwdtQ?sub_confirmation=1',
    'https://www.youtube.com/channel/UCOmHUn--16B90oW2L6FRR3A?sub_confirmation=1'
  ]

  const [url, setUrl] = useState(0)

  // const [filteredUsers, setFilteredUsers] = useState([])
  const [stop, setStop] = useState(true)
  const [subing, setSubing] = useState(false)
  const [counter, setCounter] = useState(0)
  const [attached, setAttached] = useState(false)
  const [devTools, setDevTools] = useState(false)
  const [toggleView, setToggleView] = useState(true)
  const [youtubeLogedIn, setYoutubeLogedIn] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [urlToPlay, setUrlToPlay] = useState("https://www.youtube.com/")

  const switchURL = () => {
    setAttached(false)
    setUrl(prev => {
      if (prev + 1 >= urls.length) {
        return 0
      } else {
        return prev + 1
      }
    })
  }

  ipcMain.on('youtubelogin', function (event, value) {
    if (value === "youtubeLogedIn") {
      setYoutubeLogedIn(true)
    }
    else setYoutubeLogedIn(false)
  });

  ipcMain.on('subscribed', function (event, value) {
    if (value === "subscribed") {
      setSubscribed(true)
      console.log("ipc subscribed done")
    }
  });

  const stopWatch = () => {
    setCounter(prev => {
      // console.log(prev - 1000)
      return prev - 1000
    })
  }

  useEffect(() => {
    setUser(prev => prev)
  }, [user])
  ///<---------auto task--------->///


  const autoWatch = (userToWatch) => {
    console.log("autoWatch now, run promise")
    console.log(userToWatch)
    return new Promise(async (resolve, reject) => {
      setSubscribed(false)
      setCounter(5000)
      setSubing(false)

      SetInterval.start(stopWatch, 1000, 'stopWatch')

      //TODO. choose video
      //ToDo. exclude played video. store uid in played list. check b4 playing?

      db.ref('users/' + user.uid + '/played/' + userToWatch.uid).update({ uid: userToWatch.uid })
      setUrlToPlay(userToWatch.videoUrl1) //play video
      await delay(5000) // video play time TODO. set 4mins

      setUrlToPlay(userToWatch.channelUrl) //subscribe channel
      if (userToWatch.uid !== user.uid) {
        db.ref('users/' + userToWatch.uid).update({ views: firebase.database.ServerValue.increment(1) })
      }

      setSubing(true) //change sub text
      setCounter(8000) //subscribe channel time 8sec
      await delay(8000)

      console.log("Done!!!!!!!!!! autoWatch")
      resolve()
    })
  }

  const repeatPlaying = async () => {
    console.log("again")
    SetInterval.clear('stopWatch')
    setCounter(0)
    console.log("start repeating")
    await delay(2000)
    console.log("repeating now")
    startPlaying(user.views)
  }

  const startPlaying = async (views) => {

    let snapviews = await db.ref('users/' + user.uid + "/views").once('value').then((snapshot) => snapshot.val())
    console.log("snapviews", snapviews)

    let onlineUsers = await db.ref('onlineUsers/').once('value').then((snapshot) => snapshot.val())
    onlineUsers = onlineUsers && Object.values(onlineUsers)
    console.log("onlineUsers", onlineUsers)

    let playedUsers = await db.ref('users/' + user.uid + "/played").once('value').then((snapshot) => snapshot.val())
    playedUsers = playedUsers && Object.values(playedUsers)

    console.log("playedUsers", playedUsers)

    // let filteredUsers = []
    // if (playedUsers && playedUsers[0]) {

    //   online

    //   // let tempArr
    //   // onlineUsers.map(onlineUser=>{
    //   //   console.log("On ",onlineUser.uid)
    //   //   playedUsers.map(playedUser=>{
    //   //     console.log("PL ", playedUser.uid)
    //   //     if
    //   //   })
    //   // })


    //   filteredUsers = onlineUsers.filter(onlineUser => !playedUsers.includes((user)=>user.uid === onlineUser.uid))
    //   console.log("filteredUsers", filteredUsers)
    // }
    // else {
    //   // filteredUsers = onlineUsers
    // }

    let random = 0;
    let check = true
    let i = 1;
    // find if now playing id is not in played list
    await new Promise((resolve, reject) => { 

      while (i <= onlineUsers.length && check === true) { 
        random = Math.floor(Math.random() * (onlineUsers.length))
        if (!playedUsers){
          check = false
          resolve()
        }

        else if (onlineUsers[random].uid !== user.uid) { //is it urself?
          let arr = playedUsers.map(user => { //find the id
            if (user.uid === onlineUsers[random].uid) {
              return 1 
            }
          })
          check = arr.includes(1) //can't found it, loop break, id ok
          i++
        }  
      }
      resolve()
    })

    // check is false = all user in played list
    if (check){
      console.log("All video has been watched, watching old video")
    }
    else {
      console.log("watching a NEW video")
    }


    // console.log("random", random)
    // console.log("onlineUsers", onlineUsers[random])
    // console.log("filteredUsers", filteredUsers[random])

    if (snapviews < admin.v0_1_0.maxViews) {
      // console.log("go to autoWatch")
      // console.log(filteredUsers.length === 1 ? "ONEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE" : "!!!!!!!ONLINE")
      autoWatch(onlineUsers[random])
        .then(() => { repeatPlaying() })
    }
  }

  const stopPlaying = () => {
    window.location.reload(false);
  }


  useEffect(() => {
    if (attached) {
      setSubscribed(false)
      // console.log(view)
      view.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.130 Safari/537.36 Edg/78.0.100.0")
      console.log(view.getUserAgent())
    }
  }, [attached])

  // const getFilteredUsers = () => {
  //   console.log("playedUsers", playedUsers)
  //   setFilteredUsers([])
  //   let tempArr = []
  //   let onlineUids = []
  //   if (playedUsers[0] && onlineUsers[0]) {
  //     tempArr = onlineUsers.filter(onlineUser => !playedUsers.includes(onlineUser.uid));
  //     console.log(tempArr)
  //     setFilteredUsers(tempArr)
  //   }
  //   else if (!playedUsers[0]) {
  //     setFilteredUsers(onlineUsers)
  //   }
  //   console.log("filteredUsers", filteredUsers)
  // }

  // useEffect(() => {
  //   getFilteredUsers()
  // }, [onlineUsers])


  let myviews;
  // stop all played
  useEffect(() => {
    console.log("userEffect", user.views)
    myviews = user.views
  }, [user.views])



  const timer = (counter) => {
    return moment.utc(counter).format('mm:ss');
  }

  const level = (level) => {
    // 👑💎🥇⭐️

    if (level === 0) {
      return "🙂 "
    }

    else if (level === 1) {
      return "⭐️ "
    }

    else if (level === 2) {
      return "💎 "
    }

    else if (level === 3) {
      return "👑 "
    }

    else {
      return "🙂 "
    }

  }

  return (

    <div style={{ margin: 50 }}>
      {/* {JSON.stringify(filteredUsers.map(item => item.uid))}<br /> */}
      <Button variant="contained" color="primary" onClick={() => setDevTools(!devTools)}>Toggle DevTools</Button><br />
      <Button variant="contained" color="primary" onClick={() => switchURL()}>Switch URL</Button><br />

      <Button variant="contained" color="primary" onClick={() => setToggleView(!toggleView)}>tdoggleView</Button><br />

      <Box display="flex" justifyContent="flex-end">
        <Button style={{ margin: 8 }} variant="contained" color="primary"
          onClick={() => {
            auth.signOut().then(function () {
              // Sign-out successful.
              history.push('/')
            }).catch(function (error) {
              // An error happened.
            });
          }}>Sign Out</Button><br />
      </Box>
      <div style={{ marginLeft: 8, marginBottom: 40, textAlign: 'center', fontSize: 30, fontWeight: "bold" }} >

        <Box style={{ color: "grey", marginBottom: 40 }}>
          <span style={{ fontSize: 20, }}>You've got
        <span style={{ fontSize: 24, color: "#f75a4f" }}> {user.views} </span>
        subscribers and counting!</span>
        </Box>

        {/* //FREE */}
        {user.views < (admin.v0_1_0 ? admin.v0_1_0.maxViews : 0) && <>

          {youtubeLogedIn ?
            // {/* {true ? */ }
            <>
            { stop?<>
                < Box style={{ color: "grey" }}>
                  Ready...
                <Button
            style={{ margin: 10, backgroundColor: "#2cbf2c", color: "white", fontWeight: "bold" }}
            variant="contained"
            endIcon={<Icon fontSize="large">play_arrow</Icon>}
            fontSize="large"
            onClick={() => {
              setStop(prev => !prev)
              startPlaying(user.views)
            }}
          >
            Start
               </Button>
        </Box>
              </>
                :
      <>
        <Box style={{ color: "grey" }}>
          {subing ? "Subscribing " : "Next Video in "} {timer(counter)}
          <Button
            style={{ margin: 10, backgroundColor: "red", color: "white", fontWeight: "bold" }}
            variant="contained"
            endIcon={<Icon fontSize="large">stop</Icon>}
            fontSize="large"
            onClick={() => { stopPlaying() }}
          >
            Stop
                  </Button>
        </Box>
      </>
              }
            </>
            :
<>
  {
    // FREE Version
    // !user.views > (admin.v0_1_0 ? admin.v0_1_0.maxViews : 0) &&
    <div>
      Please login to your youtube account below <br />
      <div style={{ color: "grey" }}>
        Waiting...
            </div>
    </div>
  }
</>
          }

        </>
        }

      </div >
  <Grid container container
    // direction="row"
    // justify="center"
    // alignItems="flex-start"
    style={{ flexGlow: 1 }} spacing={2}>

    <Grid item xs={10}
    >
      <Paper elevation={3} style={{
        minHeight: 600, padding: 30, paddingRight: 60, marginBottom: 20,
      }}>

        {/* //FREE */}
        {user.views >= (admin.v0_1_0 ? admin.v0_1_0.maxViews : 0) ?
          <div style={{ color: "grey", marginLeft: 8, marginBottom: 40, textAlign: 'center', fontSize: 20, fontWeight: "bold" }} >

            <img src={congrat} style={{ width: "80%", height: "auto" }} /><br />
                YEAH! You have reached 100 subscribers!<br /> <br />
                 However, the free trial is now over.<br /> <br />
            <br /> <br />
                To continue to reach 1000 subscribers, <br /> <br />
            <span
              style={{ color: "#7aa7f0", cursor: "pointer" }}
              onClick={(event) => {
                event.preventDefault();
                shell.openExternal("https://www.facebook.com");
              }}
            // onClick={electronOpenLinkInBrowser.bind(this)}
            >
              download the full version.😄😎
                  </span>
          </div> :
          <>
            {toggleView &&
              <ElectronBrowserView
                src={urlToPlay}
                className="browser"
                preload={preload}
                // Keep instance reference so we can execute methods
                ref={(viewRef) => {
                  view = viewRef
                }}
                devtools={devTools}
                onDidAttach={() => {
                  setAttached(true)
                  console.log("BrowserView attached");
                }}
                onUpdateTargetUrl={() => {
                  // console.log("Updating url");
                  // setAttached(false)
                }}
                onDidFinishLoad={() => {
                  // setAttached(true)
                  // console.log("Updated url");
                }}
                style={{
                  height: 600,
                }}
                disablewebsecurity={true}
              />
            }
          </>}
      </Paper>
    </Grid>

    <Grid item xs={2}>
      <Paper elevation={3} style={{ paddingTop: 5, marginBottom: 20, minHeight: 690, }}>
        <h4 style={{ textAlign: "center" }}>
          Online Buddies({onlineUsers.length})
              <div style={{ fontSize: 12, marginTop: 10 }}>
            🙂=Free <br />
              ⭐️=Pro<br />
              💎=VIP<br />
              👑=KING<br />
          </div>
        </h4>
        <Divider />
        <List component="nav" style={{ padding: 10 }}>
          {onlineUsers && onlineUsers.map((item) => {
            return (
              <ListItemText key={item.uid} primary={level(item.level) + item.nickname} />
            )
          })}
        </List>
      </Paper>
    </Grid>

  </Grid>
    </div >
  )
}


export default View
