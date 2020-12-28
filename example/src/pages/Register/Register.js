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
const Register = () => {

  const email = "r883@gmail.com"
  const password = "111111"
  const nickname = "Ricrick"
  const channelUrl = "https://www.youtube.com/channel/UCOmHUn--16B90oW2L6FRR3A?" + "?sub_confirmation=1"
  const videoUrl1 = "https://www.youtube.com/watch?v=DQHhLBJJtoE"
  const videoUrl2 = "https://www.youtube.com/watch?v=DQHhLBJJtoE"
  const videoUrl3 = "https://www.youtube.com/watch?v=DQHhLBJJtoE"

  const onChange = () => {

  }
  
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
          videoUrl1,
          videoUrl2,
          videoUrl3,
        })
      })
  }

  return (

    <div style={{ margin: 50}}>
              <Typography style={{ marginLeft: 8, marginBottom: 40, textAlign: 'center', fontSize: 30, fontWeight: "bold"}}  gutterBottom>Step 1: Register</Typography>
          <Paper elevation={3} style={{ padding: 50, paddingRight: 60, marginBottom: 20 }}>
            <form noValidate autoComplete="off">
              <TextField style={{ margin: 8 }} variant="outlined" label="Your E-mail" />
              <TextField style={{ margin: 8 }} variant="outlined" label="Password" />
              <TextField style={{ margin: 8 }} variant="outlined" label="Confirm Password" />
              <TextField style={{ margin: 8 }} variant="outlined" label="Your nickname " />
              <TextField style={{ margin: 8 }} variant="outlined" label="Your Youtube channel URL" fullWidth 
              helperText="How to find the URL? 1. On youtube's website, click on your profile picture. 2. Click on 'Your channel' 3. Copy and paste the url from the address bar"/>
              <TextField style={{ margin: 8 }} variant="outlined" label="Your Video's URL #1" fullWidth />
              <TextField style={{ margin: 8 }} variant="outlined" label="Your Video's URL #2" fullWidth />
              <TextField style={{ margin: 8 }} variant="outlined" label="Your Video's URL #3" fullWidth 
              helperText="The videos that you want people to watch. They will be fed randomly to each person."/>
            </form>
            <Button style={{ margin: 8 }} variant="contained" color="primary" onClick={() => onSubmit()}>Submit</Button><br />
          </Paper>

    </div>
  )
}



export default Register
