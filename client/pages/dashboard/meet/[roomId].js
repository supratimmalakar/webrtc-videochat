import React, { useEffect, useState, useRef } from 'react'
import Layout from '../../../components/Layout'
import { useSocket } from '../../../providers/Socket'
import Cookies from 'js-cookie'
import { openToast, errorToast } from '../../../redux/toastReducer';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';


function MeetRoom() {

    const [peer, setPeer] = useState(null)
    const { user } = useSelector(state => state.auth)
    const remoteVideoRef = useRef(null);
    const currentUserVideoRef = useRef(null);
    const router = useRouter();
    const socket = useSocket();
    const dispatch = useDispatch()
    const [roomMembers, setRoomMembers] = useState([])

    useEffect(() => {
        if (!router.isReady) return;
        socket.emit('get-room-clients', router.query.roomId, (users) => {
            setRoomMembers(users);
        })
    }, [router.isReady])

    useEffect(() => {
        var getUserMedia = navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia || navigator.mediaDevices.mozGetUserMedia;
        import("peerjs").then(({ default: Peer }) => {
            const peer = new Peer(user.id);
            setPeer(peer)
            peer.on('call', (call) => {
                console.log("Incoming call")
                getUserMedia({ video: true, audio: true }).then((mediaStream) => {
                    currentUserVideoRef.current.srcObject = mediaStream;
                    currentUserVideoRef.current.play();
                    call.answer(mediaStream)
                    call.on('stream', function (remoteStream) {
                        remoteVideoRef.current.srcObject = remoteStream
                        remoteVideoRef.current.play();
                    });
                });
            })
        })

    }, [])




    socket.on('user-joined', (user) => {
        dispatch(openToast({
            message: user.username + " joined the room",
            severity: "success"
        }))
        socket.emit('get-room-clients', router.query.roomId, (users) => {
            setRoomMembers(users)
        })
        var getUserMedia = navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia || navigator.mediaDevices.mozGetUserMedia;
        getUserMedia({ video: true, audio: true }).then((mediaStream) => {
            console.log("2")
            currentUserVideoRef.current.srcObject = mediaStream;
            currentUserVideoRef.current.play();

            const call = peer.call(user.id, mediaStream)

            call.on('stream', (remoteStream) => {
                remoteVideoRef.current.srcObject = remoteStream
                remoteVideoRef.current.play();
            });
        });

    })

    socket.on('user-left', (user) => {
        dispatch(openToast({
            message: user.username + " left the meet",
            severity: "success"
        }))
        socket.emit('get-room-clients', router.query.roomId, (users) => {
            setRoomMembers(users)
        })
    })

    return (
        <Layout title={`Meet/${router.query.roomId}`} className="flex flex-col justify-start items-center">
            {roomMembers.length > 0 && roomMembers.map((member, index) => {
                return (
                    <h1 key={index}>{member.username}</h1>
                )
            })}
            <div>
                <video ref={currentUserVideoRef} />
            </div>
            <div>
                <video ref={remoteVideoRef} />
            </div>
        </Layout>
    )
}

export default MeetRoom