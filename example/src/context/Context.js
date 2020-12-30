import React, { createContext, useState, useEffect } from 'react'
import { db, auth } from "../../../firebaseApp"
import firebase from "firebase/app";
import { useHistory, Link } from "react-router-dom";
import settings from 'electron-settings';

export const Context = createContext()

const ContextProvider = ({ children }) => {
  const [user, setUser] = useState({})
  const [onlineUsers, setOnlineUsers] = useState([])
  let history = useHistory();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log(user.uid)

        db.ref('users/' + user.uid).once('value').then((snapshot) => {
          setUser(snapshot.val())

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

  return (
    <Context.Provider
      value={
        {
          user, setUser,
          onlineUsers, setOnlineUsers
        }
      }
    >
      {children}
    </Context.Provider>
  )
}

export default ContextProvider