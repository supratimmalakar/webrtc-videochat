import React, { useMemo, createContext } from 'react'
import { io } from 'socket.io-client'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setPeer, setPeerId } from '../redux/peerReducer'
import { setUser } from '../redux/authReducer'
import { useRouter } from 'next/router'

const SocketContext = createContext(null)

export const useSocket = () => {
    return React.useContext(SocketContext)
}

export const SocketProvider = (props) => {
    const router = useRouter()
    const dispatch = useDispatch()
    const [auth, setAuth] = useState({
        token: "",
        user: null
    })
    const { token, user } = auth
    useEffect(() => {
        if (!Cookies.get('auth')) return;
        setAuth(JSON.parse(Cookies.get('auth')))
    }, [router.pathname])

    useEffect(() => {
        if (!auth.user) return;
        import("peerjs").then(({ default: Peer }) => {
            const peer = new Peer(user.id);
            dispatch(setPeer(peer))
            peer.on('open', id => {
                console.log("id", id)
                dispatch(setPeerId(id));
            })
        })
        dispatch(setUser(auth.user))
    }, [auth.user])
    const socket = useMemo(() => io('http://localhost:4001'), [])
    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    )
}