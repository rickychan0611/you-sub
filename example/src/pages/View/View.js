import React, { useEffect, useState } from 'react'
import ElectronBrowserView, { removeViews } from '../../../../lib/ElectronBrowserView'
import { useHistory } from "react-router-dom";

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';

import { db, auth } from "../../../../firebaseApp";

let view;

// URL we want to toggle between
const View = () => {
  let history = useHistory();

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

    <div style={{ margin: 50 }}>
      <Box display="flex" justifyContent="flex-end">
          <Button style={{ margin: 8 }} variant="contained" color="primary" 
          onClick={() => {history.push('/')}}>Submit</Button><br />
        </Box>
      <Typography style={{ marginLeft: 8, marginBottom: 40, textAlign: 'center', fontSize: 30, fontWeight: "bold" }} gutterBottom>
        Step 2: Login your youtube account
        </Typography>
      <Paper elevation={3} style={{ padding: 50, paddingRight: 60, marginBottom: 20 }}>
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
                height: 600,
              }}
              disablewebsecurity={true}
            />
          }
      </Paper>
    </div>
  )
}



export default View
