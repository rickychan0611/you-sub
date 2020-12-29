import React, { createContext, useState, useEffect } from 'react'
import { db, auth } from "../../../firebaseApp"
import firebase from "firebase/app";

export const Context = createContext()

const ContextProvider = ({ children }) => {
  const [user, setUser] = useState({})
  const [onlineUsers, setOnlineUsers] = useState([])

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
        })
      }
      else {
        console.log("Not logged in")
      }
    })
  }, [])

  useEffect(() => {
    const online = db.ref('onlineUsers/')
    online.on('value', (snapshot) => {
      setOnlineUsers(snapshot.val());
      console.log(snapshot.val())
    });
  }, [user])

  return (
    <Context.Provider
      value={
        {
          user,
          onlineUsers, setOnlineUsers
        }
      }
    >
      {children}
    </Context.Provider>
  )
}

export default ContextProvider