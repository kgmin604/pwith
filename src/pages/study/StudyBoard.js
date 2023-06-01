import "bootstrap/dist/css/bootstrap.min.css";
import "./study.css";
import "../../App.css";
import React, { useState, useEffect } from 'react';
import { Form, Nav, Stack, Button, Table, Accordion } from "react-bootstrap";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import SplitButton from 'react-bootstrap/SplitButton';

import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { loginUser } from "../../store";

function StudyBoard(props) {
    let navigate = useNavigate();

    let user = useSelector((state) => state.user);
    let dispatch = useDispatch();
    let studyPostList = useSelector((state) => state.studyPostList);

    const [view, setView] = useState("글제목");

    return (<div className="Board">
        <Stack direction="horizontal" gap={3} style={{ padding: "5px" }}>
            <div>
                {
                    view==='제목'?
                    <DropdownButton
                    id="dropdown-button-dark-example2"
                    variant="blue"
                    title="글제목"
                    className="mt-2"
                    >
                    <Dropdown.Item href="#/action-1">글제목</Dropdown.Item>
                    <Dropdown.Item href="#/action-2" onClick={()=>{setView("글쓴이")}}>글쓴이</Dropdown.Item>
                </DropdownButton>:
                <DropdownButton
                id="dropdown-button-dark-example2"
                variant="blue"
                title="글쓴이"
                className="mt-2"
                >
                <Dropdown.Item href="#/action-1" onClick={()=>{setView("글제목")}}>글제목</Dropdown.Item>
                    <Dropdown.Item href="#/action-2" >글쓴이</Dropdown.Item>
                </DropdownButton>
                }
                
            </div>
            <Form.Control className="me-auto" placeholder="원하는 스터디를 찾아보세요!" />
            <Button variant="blue">🔍</Button>
            <div className="vr" />
            {user.id === "" ? null :
                (<div>

                    <Nav.Link onClick={() => { navigate("../create"); }}>
                        <Button variant="blue"
                        >New</Button>
                    </Nav.Link>
                </div>)}

        </Stack>

        <Table bordered hover>
            <thead>
                <tr>
                    <th>no.</th>
                    <th colSpan={2}>글제목</th>
                    <th>조회수</th>
                    <th>날짜</th>
                    <th>인원</th>
                    <th>글쓴이</th>
                </tr>
            </thead>
            <tbody>

                {studyPostList.map(function (row, index) {
                    return (
                        <tr className="postCol" key={row[0]} onClick={() => navigate(`../${index + 1}`)}>
                            <td>{row[0]}</td>
                            <td colSpan={2}>{row[1]}</td>
                            <td>{row[6]}</td>
                            <td>{row[3]}</td>
                            <td>{row[8]}</td>
                            <td>{row[2]}</td>
                        </tr>
                    );
                }
                )}
            </tbody>
        </Table>
    </div>);
}

export default StudyBoard;