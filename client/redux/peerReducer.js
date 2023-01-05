import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    peer : null,
    peerId: null
}

export const peerSlice = createSlice({
    name: 'peer',
    initialState,
    reducers: {
       setPeer : (state, action) => {
        state.peer = action.payload
       },
       setPeerId: (state, action) => {
        state.peerId = action.payload
       }
    }
})

export const { setPeer, setPeerId } = peerSlice.actions

export default peerSlice.reducer