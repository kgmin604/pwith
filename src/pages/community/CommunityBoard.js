import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./community.css";
import "./community-main.css";
import "../../App.css";
import "../pwithmain/main.css";
import React, { useEffect, useState } from 'react';
import { Form, Nav, Stack, Button, Table } from "react-bootstrap";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useLoginStore } from "../auth/CheckLogin";

function CommunityBoard() {
    let navigate = useNavigate();

    const dummy = [
        { 'title': '로딩중...', 'date': '0000-00-00', 'url': 0 },
        { 'title': '로딩중...', 'date': '0000-00-00', 'url': 0 },
        { 'title': '로딩중...', 'date': '0000-00-00', 'url': 0 }
    ]

    let [itList, setItList] = useState(dummy);
    let [qnaList, setQnaList] = useState(dummy);
    let [contentList, setContentList] = useState(dummy);
    const {checkLogin}=useLoginStore()

    useEffect(() => {
        const init = async () => {
            try {
                await checkLogin()
                getComunityBoard()
            } catch (e) { }
        }
        init()
    }, [])

    const getComunityBoard=()=>{
        axios({
            method: "GET",
            url: "/community"
        })
            .then(function (response) {
                setItList(response.data.data.news);
                setQnaList(response.data.data.qna);
                setContentList(response.data.data.contents);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <div className="CommunityBoard">
            <div className="category">
                <div className="header">
                    <h2>최신 IT 뉴스</h2>
                    <span onClick={() => navigate("../it")}>(+)</span>
                </div>
                <div className="body">
                    {
                        itList.map((it, i) => {
                            return (
                                <p
                                    className="item"
                                    onClick={(e) => { e.stopPropagation(); window.open(`${it['url']}`, '_blank'); }}
                                >
                                    <h3>{it['title']}</h3>
                                    <div>{it['date']}</div>
                                </p>
                            );
                        })
                    }
                </div>
            </div>
            <div className="category">
                <div className="header">
                    <h2>QnA</h2>
                    <span onClick={() => navigate("../qna/main")}>(+)</span>
                </div>
                <div className="body">
                    {
                        qnaList.map((it, i) => {
                            return (
                                <p
                                    className="item"
                                    onClick={(e) => { e.stopPropagation(); navigate(`../qna/${it['postId']}`) }}
                                >
                                    <h3>{it['title']}</h3>
                                    <div>{it['date']}</div>
                                </p>
                            );
                        })
                    }
                </div>
            </div>
            <div className="category">
                <div className="header">
                    <h2>학습 콘텐츠</h2>
                    <span onClick={() => navigate("../content")}>(+)</span>
                </div>
                <div className="body">
                    {
                        contentList.map((it, i) => {
                            return (
                                <p
                                    className="item"
                                    onClick={(e) => { e.stopPropagation(); window.open(`${it['url']}`, '_blank'); }}
                                >
                                    <h3>{it['title']}</h3>
                                    <div>{it['date']}</div>
                                </p>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
}

export default CommunityBoard;