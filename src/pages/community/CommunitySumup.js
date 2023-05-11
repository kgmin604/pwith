import "bootstrap/dist/css/bootstrap.min.css";
import "./community.css";
import "../../App.css";
import React, { useState } from 'react';
import { Form, Nav, Stack, Button, Table } from "react-bootstrap";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

function CommunitySumup(){
    let navigate=useNavigate();

    return(
        <div className="CommunitySumup">
            <Table bordered hover >
                        <thead>
                            <tr >
                                <th colSpan={3} style={{'backgroundColor':'#98AFCA', 'color':'white'}} >
                                    <div className="tableHead">
                                        <div >IT 뉴스</div>
                                        <span onClick={() => navigate("../it")}>더보기 +</span>
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
                                <th colSpan={3} style={{'backgroundColor':'#98AFCA', 'color':'white'}}>
                                    <div className="tableHead">
                                        <div>부트캠프 후기</div>
                                        <span onClick={() => navigate("../bootcamp")}>더보기 +</span>
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
                                <th colSpan={3} style={{'backgroundColor':'#98AFCA', 'color':'white'}}>

                                    <div className="tableHead" >
                                        <div>QnA</div>
                                        <span onClick={() => navigate("../qna")}>더보기 +</span>
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

export default CommunitySumup;