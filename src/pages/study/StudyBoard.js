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

    const [searchType, setSearchType] = useState(0);
    const [searchData, setSearchData] = useState(null);

    const searchStudy = () => {
        axios({
            method: "GET",
            url: `/study/main`,
            params: {
                type: searchType,
                value: inputValue
            }
        })
            .then(function (response) {
                console.log(response);
                console.log(searchType);
                console.log(inputValue);
                navigate(`/study/main?type=${searchType}&value=${inputValue}`);
            })
            .catch(function (error) {
                console.log(error);
                //alert("글을 불러오지 못했습니다.");
            });

    };

    useEffect(() => {
        console.log(studyPostList)
    }, [studyPostList])




    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(inputValue);
        searchStudy();
    };



    return (<div className="Board">
        <Stack direction="horizontal" gap={3} style={{ padding: "5px" }}>
            <div>
                {
                    searchType === 0 ?
                        <DropdownButton
                            id="dropdown-button-dark-example2"
                            variant="blue"
                            title="글제목"
                            className="mt-2"
                        >
                            <Dropdown.Item>글제목</Dropdown.Item>
                            <Dropdown.Item onClick={() => { setSearchType(1) }}>글쓴이</Dropdown.Item>
                        </DropdownButton> :
                        <DropdownButton
                            id="dropdown-button-dark-example2"
                            variant="blue"
                            title="글쓴이"
                            className="mt-2"
                        >
                            <Dropdown.Item onClick={() => { setSearchType(0) }}>글제목</Dropdown.Item>
                            <Dropdown.Item >글쓴이</Dropdown.Item>
                        </DropdownButton>
                }

            </div>
            <Form onSubmit={handleSubmit}>
                <Form.Control
                    className="me-auto"
                    placeholder="원하는 스터디를 찾아보세요!"
                    value={inputValue}
                    onChange={handleInputChange}
                    style={{ width: '400px' }}
                />
            </Form>
            <Button variant="blue" type="submit" onClick={() => searchStudy()}>🔍</Button>


            <div className="vr" />
            {user.id === "" ? null :
                (<div>

                    <Nav.Link onClick={() => { navigate("../create"); }}>
                        <Button variant="blue"
                        >New</Button>
                    </Nav.Link>
                </div>)}

        </Stack>

        {searchData === null ? (<Table bordered hover>
            <thead>
                <tr>
                    <th>no.</th>
                    <th colSpan={2}>글제목</th>
                    <th>글쓴이</th>
                    <th>좋아요</th>
                    <th>날짜</th>
                    <th>조회수</th>
                </tr>
            </thead>
            <tbody>
                {studyPostList.map(function (post, index) {
                    return (
                        <tr className="postCol" key={post.id} onClick={() => navigate(`../${post.id}`)}>
                            <td>{post.id}</td>
                            <td colSpan={2}>{post.title}</td>
                            <td>{post.writer}</td>
                            <td>{post.like}</td>
                            <td>{post.date}</td>
                            <td>{post.views}</td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
        ) : (<Table bordered hover>
            <thead>
                <tr>
                    <th>no.</th>
                    <th colSpan={2}>글제목</th>
                    <th>조회수</th>
                    <th>날짜</th>
                    <th>좋아요</th>
                    <th>글쓴이</th>
                </tr>
            </thead>
            <tbody>
                {searchData.map((item) => (
                    <tr className="postCol" key={item.id} onClick={() => navigate(`../${item.id}`)}>
                        <td>{item.id}</td>
                        <td colSpan={2}>{item.title}</td>
                        <td>{item.views}</td>
                        <td>{item.date}</td>
                        <td>{item.likes}</td>
                        <td>{item.writer}</td>
                    </tr>
                ))}
            </tbody>
        </Table>)}



    </div>);
}

export default StudyBoard;