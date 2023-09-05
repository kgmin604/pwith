import "bootstrap/dist/css/bootstrap.min.css";
import "./study.css";
import "../../App.css";
import React, { useState, useEffect } from 'react';
import { Form, Stack, Button } from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { updateRecStudyList } from "../../store";

function StudyBoard(props) {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const studyCategory = useSelector((state) => state.studyCategory);
    const dispatch = useDispatch();
    const [studyPostList, setStudyPostList] = useState([]);
    const [searchType, setSearchType] = useState(0);
    const [totalPage, setTotalPage] = useState(1);
    const [selectPage, setSelectPage] = useState(1);
    const [pages, setPages] = useState([]); // 임시
    const [disabled1, setDisabled1] = useState(true);
    const [disabled2, setDisabled2] = useState(true);
    const [isLoad, setIsLoad] = useState(false);
    const [isDisabled, setIsDisabled] = useState(user.id === null);

    useEffect(() => {
        axios({
            method: "GET",
            url: "/study",
            params: {
                search: 0,
                page: selectPage,
                category: studyCategory
            }
        })
            .then(function (response) {
                setStudyPostList(response.data.data.posts);
                setTotalPage(response.data.data.num);
                dispatch(updateRecStudyList(response.data.data.rec));
                if (!isLoad) { // 맨 처음 한번만 실행
                    if (response.data.data.num > 5) {
                        const tmp = Array.from({ length: 5 }, (_, index) => index + 1);
                        setPages(tmp);
                        setDisabled2(false); // 페이지 이동 가능

                    }
                    else {
                        const tmp = Array.from({ length: response.data.data.num }, (_, index) => index + 1);
                        setPages(tmp);
                    }
                    setIsLoad(true);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [selectPage, studyCategory]);

    const searchStudy = () => {
        axios({
            method: "GET",
            url: `/study`,
            params: {
                search: 1,
                type: searchType, // 0: 제목 1: 글쓴이
                value: inputValue,
                page: 1
            }
        })
            .then(function (response) {
                setStudyPostList(response.data.data.posts);
                dispatch(updateRecStudyList(response.data.data.rec));
                if (response.data.data.num > 5) {
                    const tmp = Array.from({ length: 5 }, (_, index) => index + 1);
                    setPages(tmp);
                    setDisabled2(false); // 페이지 이동 가능
                }
                else {
                    const tmp = Array.from({ length: response.data.data.num }, (_, index) => index + 1);
                    setPages(tmp);
                }
            })
            .catch(function (error) {
                console.log(error);
            });

    };
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
        event.stopPropagation();
        setInputValue(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(inputValue);
        searchStudy();
    };


    function controlPages(type) {
        if (type === -1) {
            const startPage = pages[0];
            const tmp = Array.from({ length: 5 }, (_, index) => startPage - 5 + index);
            setPages(tmp);
            setSelectPage(tmp[0]);
            setDisabled2(false); // > 클릭 가능

            if (startPage === 6) {
                setDisabled1(true); // < 클릭 불가
            }
        }
        else if (type === 1) {
            if (pages[4] + 5 <= totalPage) { // 페이지 5개 display 가능
                const tmp = Array.from({ length: 5 }, (_, index) => pages[index] + 5);
                setPages(tmp);
                setSelectPage(tmp[0]);
                if (pages[4] + 5 === totalPage) {
                    setDisabled2(true); // > 클릭 불가
                }
            }
            else {   // 페이지 5개 dispaly 불가능
                const num = totalPage - pages[4];
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
                <div className="study-top">
                    {
                        searchType === 0 ?
                            <DropdownButton
                                id="dropdown-button-dark-example2"
                                variant="blue"
                                title="글제목"
                                className="mt-2 setting"
                            >
                                <Dropdown.Item>글제목</Dropdown.Item>
                                <Dropdown.Item onClick={() => { setSearchType(1) }}>글쓴이</Dropdown.Item>
                            </DropdownButton> :
                            <DropdownButton
                                id="dropdown-button-dark-example2"
                                variant="blue"
                                title="글쓴이"
                                className="mt-2 setting"
                            >
                                <Dropdown.Item onClick={() => { setSearchType(0) }}>글제목</Dropdown.Item>
                                <Dropdown.Item >글쓴이</Dropdown.Item>
                            </DropdownButton>
                    }
                    <Form onSubmit={handleSubmit} className="setting">
                        <Form.Control
                            className="me-auto"
                            placeholder="원하는 스터디를 찾아보세요!"
                            value={inputValue}
                            onChange={(e) => handleInputChange(e)}
                            style={{ width: '380px' }}
                        />
                    </Form>
                    <Button variant="blue" type="submit" onClick={() => searchStudy()}>🔍</Button>


                    <div className="vr" />
                    <Button
                        variant="blue"
                        disabled={isDisabled}
                        onClick={() => { navigate("../create"); }}
                    >
                        New
                    </Button>
                </div>
            </Stack>

            <div className="posts-area">
                {
                    studyPostList === null ? null :
                        <>
                            <div className="post-item" style={{ 'height': '40px' }}>
                                <strong className=" post-comm">No.</strong>
                                <strong className=" post-title">제목</strong>
                                <strong className=" post-writer">글쓴이</strong>
                                <strong className=" post-comm">작성일</strong>
                                <strong className=" post-comm">좋아요</strong>
                                <strong className=" post-comm">조회수</strong>
                            </div>
                            <hr style={{ 'width': '100%', "margin": '5px auto' }} />
                            {
                                studyPostList.length === 0 ? <div style={{ 'margin': '20px 0' }}>검색 결과가 없습니다.</div> :
                                    studyPostList.map((post, i) => {
                                        return (
                                            <div
                                                className="post-item hover-effect"
                                                key={i}
                                                onClick={(e) => { e.stopPropagation(); navigate(`../${post.studyId}`) }}
                                            >
                                                <span className=" post-comm">{post.id}</span>
                                                <span className=" post-title">{post.title}</span>
                                                <span className=" post-writer">{post.writerNick}</span>
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
                    <button disabled={disabled1} className="control-page" onClick={(e) => { e.stopPropagation(); controlPages(-1); }}>
                        {'<'}
                    </button>
                    {
                        pages.map((page, i) => {
                            return (
                                <span
                                    key={i}
                                    className={`page${selectPage === page ? ' selected' : ' non-selected'}`}
                                    onClick={(e) => { e.stopPropagation(); setSelectPage(page); }}
                                >
                                    {page}
                                </span>
                            );
                        })
                    }
                    <button disabled={disabled2} className="control-page" onClick={(e) => { e.stopPropagation(); controlPages(1); }}>
                        {'>'}
                    </button>
                </span>
            </div>

        </div>);
}

export default StudyBoard;