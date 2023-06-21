import "bootstrap/dist/css/bootstrap.min.css";
import "./community.css";
import "./community-main.css";
import "../../App.css";
import "../pwithmain/main.css";
import React, { useState } from 'react';
import { Form, Nav, Stack, Button, Table } from "react-bootstrap";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

function CommunityBoard(){
    let navigate = useNavigate();

    const dummy = [
        {'title': '로딩중...', 'date':'0000-00-00', 'url':0},
        {'title': '로딩중...', 'date':'0000-00-00', 'url':0},
        {'title': '로딩중...', 'date':'0000-00-00', 'url':0}
    ]
    const dummy2 = [
        {'title': '로딩중...', 'date':'0000-00-00', 'postId':1},
        {'title': '로딩중...', 'date':'0000-00-00', 'postId':1},
        {'title': '로딩중...', 'date':'0000-00-00', 'postId':1}
    ]
    const dummy3 = [
        {'title': '로딩중...', 'date':'0000-00-00', 'url':0},
        {'title': '로딩중...', 'date':'0000-00-00', 'url':0},
        {'title': '로딩중...', 'date':'0000-00-00', 'url':0}
    ]

    let [itList, setItList] = useState(dummy);
    let [qnaList, setQnaList] = useState(dummy2);
    let [contentList, setContentList] = useState(dummy3);

    return(
        <div className="CommunityBoard">
            <div className="category">
                <div className="header">
                    <h2>최신 IT 뉴스</h2>
                    <span onClick={() => navigate("../it")}>(+)</span>
                </div>
                <div className="body">
                    <p className="item">
                        <h3>{it['title']}</h3>
                        <div>{it['date']}</div>
                    </p>
                </div>
            </div>

            <Table bordered hover >
                <thead>
                    <tr>
                        <th colSpan={3} className="posting-header" >
                            <div className="tableHead">
                                <div>최신 IT 뉴스</div>
                                <span onClick={() => navigate("../it")}>(+)</span>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody className="it-list">
                {
                    itList.map((it,i)=>{
                        return (
                            <tr className="item" key={i}>
                                <td>{it['title']}</td>
                                <td>{it['date']}</td>
                            </tr>
                        );
                    })
                }
                </tbody>
                    </Table>

                    <Table bordered hover >
                        <thead>
                            <tr>
                                <th colSpan={3} className="posting-header">
                                    <div className="tableHead">
                                        <div>컨텐츠</div>
                                        <span onClick={() => navigate("../bootcamp")}>(+)</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>글제목입니다</td>
                                <td>날짜</td>
                            </tr>
                            <tr>
                                <td>글제목입니다</td>
                                <td>날짜</td>
                            </tr>
                            <tr>
                                <td>글제목입니다</td>
                                <td>날짜</td>
                            </tr>
                        </tbody>
                    </Table>

                    <Table bordered hover >
                        <thead>
                        <tr>
                                <th colSpan={3} className="posting-header">

                                    <div className="tableHead" >
                                        <div>QnA</div>
                                        <span onClick={() => navigate("../qna")}>(+)</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>글제목입니다</td>
                                <td>날짜</td>
                            </tr>
                            <tr>
                                <td>글제목입니다</td>
                                <td>날짜</td>
                            </tr>
                            <tr>
                                <td>글제목입니다</td>
                                <td>날짜</td>
                            </tr>
                        </tbody>
                    </Table>
        </div>
    );
}

export default CommunityBoard;