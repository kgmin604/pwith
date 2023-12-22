import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const WebSocketContext = createContext();

const baseUrl='localhost'

export function useWebSocket(namespace) {
    const globalSocket = useContext(WebSocketContext);

    if (!globalSocket) {
        throw new Error('SocketContext가 제공되지 않았습니다.');
    }

    return globalSocket[namespace];
}
export function WebSocketProvider({ children }) {
    const [sockets, setSockets] = useState({});

    useEffect(() => {
        // 각 네임스페이스에 대한 WebSocket 연결을 설정 및 관리
        const studyReady = io(`http://${baseUrl}:5000/study-ready`, {
            cors: {
                origin: "*",
            },
            autoConnect: false,
        });
        const mentoringReady = io(`http://${baseUrl}:5000/mentoring-ready`, {
            cors: {
                origin: "*",
            },
            autoConnect: false,
        });
        const studyLive = io(`http://${baseUrl}:5000/study-live`, {
            cors: {
                origin: "*",
            },
            autoConnect: false,
        });
        const mentoringLive = io(`http://${baseUrl}:5000/mentoring-live`, {
            cors: {
                origin: "*",
            },
            autoConnect: false,
        });

        setSockets({
            studyReady,
            mentoringReady,
            studyLive,
            mentoringLive
        });

        // 컴포넌트가 언마운트될 때 연결 해제
        return () => {
            studyReady.disconnect();
            mentoringReady.disconnect();
            studyLive.disconnect();
            mentoringLive.disconnect();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={sockets}>{children}</WebSocketContext.Provider>
    );
}
