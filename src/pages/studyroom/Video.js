import React, { useEffect, useRef } from 'react';
import "./liveroom.css";

const Video = ({ user,clickedUser, stream, muted }) => {
    const ref = useRef(null);
    useEffect(() => {
        if (ref.current) ref.current.srcObject = stream;
    }, [stream])
const isClickedUser=user?.id===clickedUser?.id

const defaultStyle={
    width: 150,
    height: 150,
    margin: 5,
    backgroundColor: 'black',
}
const clickedStyle={
    ...defaultStyle,
    borderWidth:5,
    borderColor:'rgba(0, 134, 255, 1)'
}
    return (
        <div >
            <video ref={ref}
                style={(user&&isClickedUser&&clickedUser?.id)?clickedStyle:defaultStyle}
                muted={muted} autoPlay />
            <div className='user-name'>{user.name}</div>
        </div>
    );
};
export default Video;