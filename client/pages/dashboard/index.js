import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { useSocket } from '../../providers/Socket'
import Cookies from 'js-cookie'
import { openToast, errorToast } from '../../redux/toastReducer';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

function Dashboard() {
  const dispatch = useDispatch()
  const router = useRouter()
  const [auth, setAuth] = useState({
    token: "",
    user: null
  })
  const { token, user } = auth
  const socket = useSocket()
  const [roomId, setRoomId] = useState("")

  useEffect(() => {
    setAuth(JSON.parse(Cookies.get('auth')))
  }, [])

  const joinRoomHandler = () => {
    socket.emit("join-room", roomId, user, (req) => {
      console.log(req)
    })
    router.push(`/dashboard/meet/${roomId}`)
  }

  const newMeetingHandler = () => {
    socket.emit('create-new-meeting', user, (req) => {
      console.log(req.roomId)
      if (req.status) {
        // router.push(`/dashboard/meet/${req.roomId}`)
      }
    })
  }
  return (
    <Layout title="Dashboard" className="flex flex-col justify-start items-center">
      <div className='flex flex-col border-2 rounded p-10 w-[400px] gap-5 mt-10'>
        <input onChange={(e) => setRoomId(e.target.value)} placeholder='Enter Room Code' className='outline-none h-[40px] px-3 border rounded-md' />
        <button onClick={joinRoomHandler} className='bg-btn h-12 px-2 py-2 rounded text-white font-bold hover:bg-btnHover transition'>Enter Room</button>
      </div>
      <button onClick={newMeetingHandler} className='bg-btn h-12 py-2 rounded text-white font-bold hover:bg-btnHover transition mt-10 px-10'>Start a new meeting</button>
    </Layout>
  )
}

export default Dashboard