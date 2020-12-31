import React, { createContext, useState, useEffect } from 'react'
import { db, auth } from "../../../firebaseApp"
import firebase from "firebase/app";
import { useHistory, Link } from "react-router-dom";
import settings from 'electron-settings';
import Parser from 'html-react-parser';

import Modal from '@material-ui/core/Modal';
const { shell } = require('electron');

export const Context = createContext()

const ContextProvider = ({ children }) => {
  const [user, setUser] = useState({})
  const [playedUsers, setPlayedUsers] = useState({})
  const [onlineUsers, setOnlineUsers] = useState([])
  const [admin, setAdmin] = useState({})
  const [active, setActive] = useState(true)

  let history = useHistory();

  useEffect(() => {

    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log(user.uid)

        db.ref('users/' + user.uid).on('value', (snapshot) => {
          setUser(snapshot.val())
          console.log(snapshot.val())
          if (snapshot.val().played) {
            setPlayedUsers(Object.keys(snapshot.val().played))
          }
          else setPlayedUsers([])

          var onlineUsersRef = db.ref('onlineUsers/' + user.uid)
          var connectedRef = db.ref('.info/connected');

          connectedRef.on('value', function (snap) {
            if (snap.val() === true) {
              //When connected, set data to onlineUsers
              onlineUsersRef.set(snapshot.val())

              // When I disconnect, remove this device
              onlineUsersRef.onDisconnect().remove();
            }
          });

          history.push('/view')
        })
      }
      else {
        console.log("Not logged in")
        history.push('/')
      }
    })
  }, [])

  useEffect(() => {
    let userArr;
    const online = db.ref('onlineUsers/')
    online.on('value', (snapshot) => {
      if (snapshot.val()) {
        userArr = Object.values(snapshot.val())
        setOnlineUsers(userArr);
        console.log(userArr)
      }
    });
  }, [])

  useEffect(() => {
    db.ref("admin").on("value", (snapshot) => {
      setAdmin(snapshot.val())
      setActive(snapshot.val().v0_1_0.active)
    })
  }, [])


  const body = (
    <div style={{
      position: 'absolute',
      top: `50%`,
      left: `50%`,
      transform: `translate(-50%, -50%)`,
      width: 500,
      backgroundColor: "white",
      boxShadow: 10,
      padding: 50
    }}>
      <h2>Message</h2>
      <p>
        {admin.v0_1_0 &&
          <div>{Parser(admin.v0_1_0.message)}</div>
        }
        <br/>
        <div
          style={{ color: "#7aa7f0", cursor: "pointer" }}
          onClick={(event) => {
            event.preventDefault();
            shell.openExternal("https://www.facebook.com");
          }}
        >
          
          Visit here for more information.
         </div>
      </p>
    </div>
  );

  return (
    <Context.Provider
      value={
        {
          user, setUser,
          onlineUsers, setOnlineUsers,
          playedUsers, setPlayedUsers
        }
      }
    >
      {/* admin modal */}
      <Modal
        open={!active}
      // onClose={handleClose}
      >
        {body}
      </Modal>

      {active && children}
    </Context.Provider>
  )
}

export default ContextProvider