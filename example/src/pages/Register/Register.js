import React, { useState } from 'react'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHistory } from "react-router-dom";
import passwordValidator from 'password-validator';

import { db, auth } from "../../../../firebaseApp";
var validator = require("email-validator");

var schema = new passwordValidator();
schema
  .is().min(6)                                    // Minimum length 8
  .is().max(100)                                  // Maximum length 100
  .has().uppercase()                              // Must have uppercase letters
  .has().lowercase()                              // Must have lowercase letters
  .has().digits(2)                                // Must have at least 2 digits
  .has().not().spaces()                           // Should not have spaces

// URL we want to toggle between
const Register = () => {
  let history = useHistory();

  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
    nickname: "",
    channelUrl: "",
    videoUrl1: "",
    videoUrl2: "",
    videoUrl3: "",
    views: 0
    // email: "3f4433m1@gmail.com",
    // password: "111111",
    // confirmPassword: "111111",
    // nickname: "yooMan",
    // channelUrl: "https://www.youtube.com/channel/UCOmHUn--16B90oW2L6FRR3A",
    // videoUrl1: "https://www.youtube.com/watch?v=iS5jqXWECbI",
    // videoUrl2: "https://www.youtube.com/watch?v=8usxs5F8CG0",
    // videoUrl3: "https://www.youtube.com/watch?v=DQHhLBJJtoE",
  })

  const [err, setErr] = useState({})
  const [loading, setLoading] = useState(false)

  // const email = "dda22383@gmail.com"
  // const password = "111111"
  // const nickname = "Ricrick"
  // const channelUrl = "https://www.youtube.com/channel/UCOmHUn--16B90oW2L6FRR3A" + "?sub_confirmation=1"
  // const videoUrl1 = "https://www.youtube.com/watch?v=DQHhLBJJtoE"
  // const videoUrl2 = "https://www.youtube.com/watch?v=DQHhLBJJtoE"
  // const videoUrl3 = "https://www.youtube.com/watch?v=DQHhLBJJtoE"

  const handleChange = (name, value) => {
    if (name === "channelUrl") {
      setUserInfo(prev => ({ ...prev, "channelUrl": value + "?sub_confirmation=1" }))
    }
    else setUserInfo(prev => ({ ...prev, [name]: value }))
    console.log(userInfo)
  }

  const onSubmit = () => {
    setErr({})
    // history.push("/view");

    let validate = new Promise((resolve, reject) => {
      if (!validator.validate(userInfo.email)) {
        setErr(prev => ({ ...prev, email: "Not a valid email address" }))
        reject()
      }

      if (!userInfo.email) {
        setErr(prev => ({ ...prev, email: "Required" }))
        reject()
      }
      if (!userInfo.password) {
        setErr(prev => ({ ...prev, password: "Required" }))
        reject()
      }
      if (!userInfo.nickname) {
        setErr(prev => ({ ...prev, nickname: "Required" }))
        reject()
      }
      if (!userInfo.channelUrl) {
        setErr(prev => ({ ...prev, channelUrl: "Required" }))
        reject()
      }
      if (!userInfo.videoUrl1) {
        setErr(prev => ({ ...prev, videoUrl1: "Required" }))
        reject()
      }
      if (!schema.validate(userInfo.password)) {
        setErr(prev => ({ ...prev, password: "Must be at least 6 characters with 1 uppercase letter and 2 digits" }))
        reject()
      }
      if (userInfo.password !== userInfo.confirmPassword) {
        setErr(prev => ({ ...prev, confirmPassword: "Password confirmation doesn't match Password" }))
        reject()
      }
      else resolve()
    })


    validate.then(() => {
      
      setLoading(true)
      auth.createUserWithEmailAndPassword(userInfo.email, userInfo.password)
        .then((doc) => {
          console.log(doc.user.uid)
          db.ref('users/' + doc.user.uid).update({ uid: doc.user.uid, ...userInfo })
            .then(() => {
              console.log("Done")
              setLoading(false)
              history.push("/view");
            })
        })
        .catch((err) => {
          console.log(err)
          setErr(prev => ({ ...prev, email: err.message }))
          setLoading(false)
        })
    })
    .catch((err) => {
      console.log(err)
      // setErr(prev => ({ ...prev, email: err }))
      setLoading(false)
    })

    validate.catch(() => {
      setLoading(false)
      console.log(err)
      // history.push("/view");
    })
  }

  return (

    <div style={{ margin: 50 }}>
      <Typography style={{ marginLeft: 8, marginBottom: 40, textAlign: 'center', fontSize: 30, fontWeight: "bold" }} gutterBottom>Step 1: Register</Typography>
      <Paper elevation={3} style={{ padding: 50, paddingRight: 60, marginBottom: 20 }}>
        <form noValidate autoComplete="off">
          <TextField style={{ margin: 8 }} variant="outlined" label="Your E-mail" fullWidth required
            onChange={(event) => { handleChange('email', event.target.value) }}
            helperText={err.email} error={err.email && true}
          />
          <TextField style={{ margin: 8 }} variant="outlined" label="Password" fullWidth required
            onChange={(event) => { handleChange('password', event.target.value) }}
            helperText={err.password} error={err.password && true}
          />
          <TextField style={{ margin: 8 }} variant="outlined" label="Confirm Password" fullWidth required
            onChange={(event) => { handleChange('confirmPassword', event.target.value) }}
            helperText={err.confirmPassword} error={err.confirmPassword && true}
          />
          <TextField style={{ margin: 8 }} variant="outlined" label="Your nickname " fullWidth required
            onChange={(event) => { handleChange('nickname', event.target.value) }}
            helperText={err.nickname} error={err.nickname && true}
          />
          <TextField style={{ margin: 8 }} variant="outlined" label="Your Youtube channel URL" fullWidth required
            onChange={(event) => { handleChange('channelUrl', event.target.value) }}
            helperText={err.channelUrl} error={err.channelUrl && true}
          />
          <br />
          <div style={{ fontSize: 12, paddingLeft: 15, marginBottom: 10, color: "grey" }}>
            Where to find your channel URL? <br />
             1.On youtube's website, click on your profile picture. 2.Click on "Your channel" 3.Copy and paste the url from the address bar of your browser</div>

          <TextField style={{ margin: 8 }} variant="outlined" label="Your Video's URL #1" fullWidth required
            onChange={(event) => { handleChange('videoUrl1', event.target.value) }}
            helperText={err.videoUrl1} error={err.videoUrl1 && true}
          />
          <TextField style={{ margin: 8 }} variant="outlined" label="Your Video's URL #2" fullWidth
            onChange={(event) => { handleChange('videoUrl2', event.target.value) }}
            helperText={err.videoUrl2} error={err.videoUrl2 && true}
          />
          <TextField style={{ margin: 8 }} variant="outlined" label="Your Video's URL #3" fullWidth
            onChange={(event) => { handleChange('videoUrl3', event.target.value) }}
            helperText={err.videoUrl3} error={err.videoUrl3 && true}
          />
          <br />
          <div style={{ fontSize: 12, paddingLeft: 15, marginBottom: 30, color: "grey" }}>
            These are the videos that you want to boost views. They will be fed to subscribers randomly.
          </div>
        </form>
        <Box display="flex" justifyContent="flex-end">
          <Button startIcon={loading && <CircularProgress color="inherit" size={14} />} style={{ margin: 8 }} variant="contained" color="primary" onClick={() => onSubmit()}>Submit</Button><br />
        </Box>
      </Paper>

    </div>
  )
}



export default Register
