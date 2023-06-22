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

    let [studyPostList,setStudyPostList] = useState([]);

    const [searchType, setSearchType] = useState(0);

    let [totalPage, setTotalPage] = useState(1);
    let [selectPage, setSelectPage] = useState(1);
    let [pages, setPages] = useState([]); // 임시

    let [disabled1, setDisabled1] = useState(true);
    let [disabled2, setDisabled2] = useState(true);

    let [isLoad, setIsLoad ] = useState(false);

    useEffect(() => {
        axios({
            method: "GET",
            url: "/study/main",
            params: {
                page: selectPage
            }
          })
            .then(function (response) {
                setStudyPostList(response.data.posts);
                setTotalPage(response.data.num);

                if(!isLoad){ // 맨 처음 한번만 실행
                    if(response.data.num > 5){ 
                        const tmp = Array.from({ length: 5 }, (_, index) => index + 1);
                        setPages(tmp);
                        setDisabled2(false); // 페이지 이동 가능
                    }
                    else{
                        const tmp = Array.from({ length: response.data.num }, (_, index) => index + 1);
                        setPages(tmp);
                    }
                    setIsLoad(true);
                }
            })
            .catch(function (error) {
              console.log(error);
            });
    }, [selectPage]);

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

    /*
    useEffect(() => {
        console.log(studyPostList)
    }, [studyPostList])
    */

    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(inputValue);
        searchStudy();
    };


    function controlPages(type){
        if(type===-1){
            const startPage = pages[0];
            const tmp = Array.from({ length: 5 }, (_, index) => startPage - 5 + index);
            setPages(tmp);
            setSelectPage(tmp[0]);
            setDisabled2(false); // > 클릭 가능

            if(startPage===6){
                setDisabled1(true); // < 클릭 불가
            }
        }
        else if(type===1){
            if(pages[4]+5<=totalPage){ // 페이지 5개 display 가능
                const tmp = Array.from({ length: 5 }, (_, index) => pages[index] + 5);
                setPages(tmp);
                setSelectPage(tmp[0]);
                if(pages[4]+5===totalPage){
                    setDisabled2(true); // > 클릭 불가
                }
            }
            else{   // 페이지 5개 dispaly 불가능
                const num = totalPage-pages[4];
                const tmp = Array.from({ length: num }, (_, index) => pages[index] + 5);
                setPages(tmp);
                setSelectPage(tmp[0]);
                setDisabled2(true); // > 클릭 불가
            }
            setDisabled1(false); // < 클릭 가능
        }
    }

    return (
    <div className="Board">
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
        
        <div className="posts-area">
        {
            studyPostList===null ? null:
            <>
            <div className="post-item" style={{ 'height':'40px' }}>
                <strong className=" post-comm">No.</strong>
                <strong className=" post-title">제목</strong>
                <strong className=" post-writer">글쓴이</strong>
                <strong className=" post-comm">작성일</strong>
                <strong className=" post-comm">좋아요</strong>
                <strong className=" post-comm">조회수</strong>
            </div>
            <hr style={{ 'width': '100%', "margin": '5px auto' }} />
            {
            studyPostList.map((post,i)=>{
                return(
                    <div className = "post-item hover-effect" key={i}>
                        <span className=" post-comm">{post.id}</span>
                        <span className=" post-title">{post.title}</span>
                        <span className=" post-writer">{post.writer}</span>
                        <span className=" post-comm">{post.curDate}</span>
                        <span className=" post-comm">{post.likes}</span>
                        <span className=" post-comm">{post.views}</span>
                    </div>
                );
            })}
            <hr style={{ 'width': '100%', "margin": '5px auto' }} />
            </>
        }
        
        </div>
        
        <div className='pagination'>
            <span className="pages">
                <button disabled={disabled1} className="control-page" onClick={(e)=>{e.stopPropagation(); controlPages(-1);}}>
                    {'<'}
                </button>
                {
                    pages.map((page,i)=>{
                        return(
                            <span 
                                key={i} 
                                className={`page${selectPage === page ? ' selected' : ' non-selected'}`}
                                onClick={(e)=>{e.stopPropagation(); setSelectPage(page);}}
                            >
                                {page}
                            </span>
                        );
                    })
                }
                <button disabled={disabled2} className="control-page" onClick={(e)=>{e.stopPropagation(); controlPages(1);}}>
                    {'>'}
                </button>
            </span>
        </div>

    </div>);
}

export default StudyBoard;