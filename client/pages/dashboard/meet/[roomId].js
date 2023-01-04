import React, { useEffect, useState } from 'react'
import Layout from '../../../components/Layout'
import { useSocket } from '../../../providers/Socket'
import Cookies from 'js-cookie'
import { openToast, errorToast } from '../../../redux/toastReducer';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

function MeetRoom() {
    const router = useRouter();
    const socket = useSocket();
    const dispatch = useDispatch()
    const [roomMembers, setRoomMembers] = useState([])
    useEffect(() => {
        if (!router.isReady) return;
        console.log("roomId ",router.query.roomId)
        socket.emit('get-room-clients', router.query.roomId ,(clients) => {
            console.log(clients)
            setRoomMembers(clients.users)
        })
    }, [router.isReady])

    socket.on('user-joined', (user) => {
        dispatch(openToast({
            message: user.username + " joined the room",
            severity: "success"
        }))
        socket.emit('get-room-clients', router.query.roomId, (clients) => {
            console.log(clients)
            setRoomMembers(clients.users)
        })
    })

    socket.on('user-left', (user) => {
        dispatch(openToast({
            message : user.username + " left the meet",
            severity : "success"
        }))
        socket.emit('get-room-clients', router.query.roomId, (clients) => {
            console.log(clients)
            setRoomMembers(clients.users)
        })
    })

  return (
      <Layout title={`meet/${router.query.roomId}`} className="flex flex-col justify-start items-center">
          {roomMembers.length > 0 && roomMembers.map((member, index) => {
            return (
                <div key={index}>
                    <h1>{member.username}</h1>
                </div>
            )
          })}
      </Layout>
  )
}

export default MeetRoom