import React, { useMemo, createContext } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext(null)

export const useSocket = () => {
    return React.useContext(SocketContext)
}

export const SocketProvider = (props) => {
    const socket = useMemo(() => io('http://localhost:4001'), [])
    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    )
}