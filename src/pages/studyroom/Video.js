import React, { useEffect, useRef } from 'react';
import "./liveroom.css";

const Video = ({ name, stream, muted }) => {
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
            <div className='user-name'>{name}</div>
        </div>
    );
};
export default Video;