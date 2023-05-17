import "bootstrap/dist/css/bootstrap.min.css";
import "./community.css";
import "../../App.css";
import "../pwithmain/main.css";
import React, { useState } from 'react';
import { Form, Nav, Stack, Button, Table } from "react-bootstrap";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

function CommunityBoard(){
    let navigate=useNavigate();

    return(
        <div className="CommunityBoard">
            <Table bordered hover >
                        <thead>
                            <tr >
                                <th colSpan={3} className="posting-header" >
                                    <div className="tableHead">
                                        <div >최신 IT 뉴스</div>
                                        <span onClick={() => navigate("../it")}>(+)</span>
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
                                    <div className="tableHead">
                                        <div>부트캠프 후기</div>
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