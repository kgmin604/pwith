import React, { useEffect, useRef } from 'react';
import "./liveroom.css";

const Video = ({ email, stream, muted }) => {
    const ref = useRef(null);
    useEffect(() => {
        if (ref.current) ref.current.srcObject = stream;
    }, [stream])


    return (
        <div>
            <video ref={ref}
                style={{
                    width: 150,
                    height: 150,
                    margin: 5,
                    backgroundColor: 'black',
                }}
                muted={muted} autoPlay />
            <div className='user-name'>{email}</div>
        </div>
    );
};
export default Video;