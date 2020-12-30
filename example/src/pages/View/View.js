import React, { useEffect, useState, useContext } from 'react'
import ElectronBrowserView from '../../../../lib/ElectronBrowserView'
import SetInterval from 'set-interval'
import firebase from 'firebase/app'
import { useHistory } from "react-router-dom";
import { db, auth } from "../../../../firebaseApp";
import { resolve } from 'path'
import { Context } from '../../context/Context';
import moment from "moment";

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

let view;
// URL we want to toggle between
const View = () => {
  let history = useHistory();
  const { user, onlineUsers, playedUsers } = useContext(Context)

  const urls = [
    'https://www.youtube.com/channel/UCpqk_tJt2AvGcQm22oQwdtQ?sub_confirmation=1',
    'https://www.youtube.com/channel/UCOmHUn--16B90oW2L6FRR3A?sub_confirmation=1'
  ]

  const [url, setUrl] = useState(0)

  const [filteredUsers, setFilteredUsers] = useState([])
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

  ///<---------auto task--------->///

  const startPlaying = async () => {
    if (filteredUsers && filteredUsers[0]) {
      let run = new Promise(async (resolve, reject) => {
        let random = Math.floor(Math.random() * (filteredUsers.length))

        setSubscribed(false)
        setCounter(5000)
        setSubing(false)

        SetInterval.start(stopWatch, 1000, 'stopWatch')

        //TODO. choose video
        //ToDo. exclude played video. store uid in played list. check b4 playing?
        console.log("playedUsers", playedUsers)
        console.log("random id", filteredUsers[random].uid)

        db.ref('users/' + user.uid + '/played/' + filteredUsers[random].uid).update({ uid: filteredUsers[random].uid })
        setUrlToPlay(filteredUsers[random].videoUrl1) //play video

        await delay(5000) // video play time TODO. set 4mins

        setUrlToPlay(filteredUsers[random].channelUrl) //subscribe channel
        db.ref('users/' + filteredUsers[random].uid).update({ views: firebase.database.ServerValue.increment(1) })

        setSubing(true) //change sub text
        setCounter(8000) //subscribe channel time 8sec
        await delay(8000)

        resolve()
      })

      run.then(() => {
        again()
      })
    }
    else {
      window.location.reload(false);
    }
  }

  const again = () => {
    console.log("stop", stop)
    if (stop || !filteredUsers[0]) {
      startPlaying()
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

  useEffect(() => {
    console.log("playedUsers", playedUsers)
    setFilteredUsers([])
    let tempArr = []
    let onlineUids = []
    if (playedUsers[0] && onlineUsers[0]) {
      tempArr = onlineUsers.filter(onlineUser => !playedUsers.includes(onlineUser.uid));
      console.log(tempArr)
      setFilteredUsers(tempArr)
    }
    else if (!playedUsers[0]) {
      setFilteredUsers(onlineUsers)
    }
    console.log(filteredUsers)
  }, [onlineUsers])

  // stop will all played
  // useEffect(() => { 
  //   if (!filteredUsers || !filteredUsers[0] && !stop) {
  //     window.location.reload(false);
  //   }
  // }, [filteredUsers])

  const timer = (counter) => {
    return moment.utc(counter).format('mm:ss');
  }

  return (

    <div style={{ margin: 50 }}>
      {JSON.stringify(filteredUsers.map(item => item.uid))}<br />
      <Button variant="contained" color="primary" onClick={() => setDevTools(!devTools)}>Toggle DevTools</Button><br />
      <Button variant="contained" color="primary" onClick={() => switchURL()}>Switch URL</Button><br />
      <Button variant="contained" color="primary" onClick={() => setToggleView(!toggleView)}>toggleView</Button><br />

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
        <span style={{fontSize: 20, }}>You've got 
        <span style={{fontSize: 24, color: "#f75a4f"}}> {user.views} </span> 
        subscribers, up and counting!</span>
      </Box>

        {youtubeLogedIn ?

          <>
            {stop ? <>
              <Box style={{ color: "grey" }}>
                Ready...
                <Button
                  style={{ margin: 10, backgroundColor: "#2cbf2c", color: "white", fontWeight: "bold" }}
                  variant="contained"
                  endIcon={<Icon fontSize="large">play_arrow</Icon>}
                  fontSize="large"
                  onClick={() => {
                    setStop(prev => !prev)
                    startPlaying()
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
          <div>
            Please login to your youtube account below <br />
            <div style={{ color: "grey" }}>
              Waiting...
            </div>
          </div>
        }
      </div>
      <Grid container style={{ flexGlow: 1 }} spacing={2}>

        <Grid item xs={10}>
          <Paper elevation={3} style={{ padding: 50, paddingRight: 60, marginBottom: 20 }}>
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
          </Paper>
        </Grid>

        <Grid item xs={2}>
          <Paper elevation={3} style={{ paddingTop: 5, marginBottom: 20, height: 620, }}>
            <h4 style={{ textAlign: "center" }}>
              Online Buddies({onlineUsers.length})
            </h4>
            <Divider />
            <List component="nav" style={{ padding: 10 }}>
              {onlineUsers && onlineUsers.map((item) => {
                return (
                  <ListItemText key={item.uid} primary={item.nickname} />
                )
              })}
            </List>
          </Paper>
        </Grid>

      </Grid>
    </div>
  )
}



export default View
