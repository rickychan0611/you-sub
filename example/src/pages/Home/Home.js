import React, { useEffect, useState } from 'react'
import ElectronBrowserView, { removeViews } from '../../../../lib/ElectronBrowserView'

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import { db, auth } from "../../../../firebaseApp";

let view;

// URL we want to toggle between
const Home = () => {

  const urls = [
    'https://www.youtube.com/channel/UCpqk_tJt2AvGcQm22oQwdtQ?sub_confirmation=1',
    'https://www.youtube.com/channel/UCOmHUn--16B90oW2L6FRR3A?sub_confirmation=1'
  ]

  const [url, setUrl] = useState(0)

  const [attached, setAttached] = useState(false)
  const [devTools, setDevTools] = useState(false)
  const [toggleView, setToggleView] = useState(true)

  const clickSub = (button) => {
    console.log(button, "This loads no problem!");
    setTimeout(() => {
      button.click()
    }, 2000)
  }

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

  const email = "ri331s3@gmail.com"
  const password = "111111"
  const nickname = "Ricrick"
  const channelUrl = "https://www.youtube.com/channel/UCOmHUn--16B90oW2L6FRR3A?" + "?sub_confirmation=1"
  const videoUrl = "https://www.youtube.com/watch?v=DQHhLBJJtoE"

  const onSubmit = () => {
    auth.createUserWithEmailAndPassword(email, password)
      .then((doc) => {
        console.log(doc.user.uid)
        db.ref('users/' + doc.user.uid).set({
          uid: doc.user.uid,
          email,
          password,
          nickname,
          channelUrl,
          videoUrl
        })
      })
  }

  useEffect(() => {
    if (attached) {
      console.log(view)
      view.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.130 Safari/537.36 Edg/78.0.100.0")
      console.log(view.getUserAgent())
      view.executeJavaScript(`
      let button = document.getElementById("confirm-button");
      console.log(button, "This loads no problem!");
      setTimeout(()=>{
        button.click()
      },2000)
    `)
    }
  }, [attached])

  // useEffect(()=>{
  //   return () => removeViews();
  // },[])

  return (

    <div style={{ margin: 25 }}>

      <Grid container spacing={3}>

        <Grid item xs={10}>
          <Typography variant="subtitle2" gutterBottom>
            1. Your buddies will play your video for 4 mins, then they will subscribe to your channel automatically. You will do the same.<br />
            2. You must keep this program open in order to keep yourself in the queue. You can minimize this window, it will still run in the background.<br />
            3. Videos are selected randomly from the queue.<br />
            4. You will probably get 4-10 subscribers in one hour. The more people online, the faster it gets.<br />
          </Typography>
          {/* <Button variant="contained" color="primary" onClick={() => setDevTools(!devTools)}>Toggle DevTools</Button><br />
          <Button variant="contained" color="primary" onClick={() => switchURL()}>Switch URL</Button><br />
          <Button variant="contained" color="primary" onClick={() => setToggleView(!toggleView)}>toggleView</Button><br /> */}
          <br /><br /><br />


          <Paper elevation={3} style={{ padding: 20, paddingRight: 30, marginBottom: 20 }}>
            <form noValidate autoComplete="off">
              <Typography style={{ marginLeft: 8 }} variant="subtitle2" gutterBottom>Register P2P Auto Subscriber</Typography>
              <TextField style={{ margin: 8 }} variant="outlined" label="Your E-mail" />
              <TextField style={{ margin: 8 }} variant="outlined" label="Password" />
              <TextField style={{ margin: 8 }} variant="outlined" label="Confirm Password" />
              <TextField style={{ margin: 8 }} variant="outlined" label="Your nickname " />
              <TextField style={{ margin: 8 }} variant="outlined" label="Your Youtube channel URL" fullWidth />
              <p style={{ marginLeft: 12, fontSize: 12 }}>How to find the URL? 1. Click on your profile picture. 2. Click on 'Your channel' 3. Copy / paste the url from the address bar</p>
              <TextField style={{ margin: 8 }} variant="outlined" label="Your Video's URL #1" fullWidth />
              <TextField style={{ margin: 8 }} variant="outlined" label="Your Video's URL #2" fullWidth />
              <TextField style={{ margin: 8 }} variant="outlined" label="Your Video's URL #3" fullWidth />
              <p style={{ marginLeft: 12, fontSize: 12 }}>The video that you want people to watch</p>
            </form>
            <Button style={{ margin: 8 }} variant="contained" color="primary" onClick={() => onSubmit()}>Submit</Button><br />
          </Paper>


          {toggleView &&
            <ElectronBrowserView
              className="browser"
              // Keep instance reference so we can execute methods
              ref={(viewRef) => {
                view = viewRef
              }}
              src={urls[url]}
              devtools={devTools}
              onDidFinishLoad={() => {
                setAttached(true)
                console.log("onDomReady");
              }}
              onDidAttach={() => {
                // setAttached(true)
                console.log("BrowserView attached");
              }}
              onUpdateTargetUrl={() => {
                console.log("Updated Target URL");
                setAttached(true)
              }}
              style={{
                width: 800,
                height: 400,
              }}
              disablewebsecurity={true}
            />
          }
        </Grid>

        <Grid item xs={2}>
          <h4>Online buddies</h4>
          <List component="nav" aria-label="secondary mailbox folders">
            <ListItemText primary="Trash" />
            <ListItemText primary="Spam" />
          </List>
        </Grid>

      </Grid>

    </div>
  )
}



export default Home
