import "bootstrap/dist/css/bootstrap.min.css";
import "./community.css";
import "../study/study.css"
import "../../App.css";
import React, { useState, useEffect } from 'react';
import { Form, Nav, Stack, Button, Table } from "react-bootstrap";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

function CommunityQna(props) {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const [postList, setPostList] = useState([]);
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
            url: "/community/qna/main",
            params: {
                page: selectPage
            }
        })
            .then(function (response) {
                setPostList(response.data.data.posts);
                setTotalPage(response.data.data.num);
                if (!isLoad) { // 맨 처음 한번만 실행
                    if (response.data.num > 5) {
                        const tmp = Array.from({ length: 5 }, (_, index) => index + 1);
                        setPages(tmp);
                        setDisabled2(false); // 페이지 이동 가능
                    }
                    else {
                        const tmp = Array.from({ length: response.data.num }, (_, index) => index + 1);
                        setPages(tmp);
                    }
                    setIsLoad(true);
                }
            })
            .catch(function (error) {
            });
    }, [selectPage]);

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
        <div className="CommunityQna">
            <div class="row">
                <div class="col-md-3">
                    {Category()}
                </div>
                <div class="col-md-6 Board">
                    <Stack direction="horizontal" gap={3} style={{ padding: "5px" }}>
                        <Form.Control className="me-auto" placeholder="궁금한 것이 무엇인가요?" />
                        <Button variant="blue">🔍</Button>
                        <div className="vr" />
                        <Button
                            variant="blue"
                            disabled={isDisabled}
                            onClick={() => { navigate("../community/qna/create"); }}
                        >
                            New
                        </Button>

                    </Stack>

                    <div className="posts-area">
                        <div className="post-item" style={{ 'height': '40px' }}>
                            <strong className=" post-comm">No.</strong>
                            <strong className=" post-title">제목</strong>
                            <strong className=" post-writer">글쓴이</strong>
                            <strong className=" post-comm">작성일</strong>
                            <strong className=" post-comm">좋아요</strong>
                            <strong className=" post-comm">조회수</strong>
                        </div>
                        <hr style={{ 'width': '100%', "margin": '5px auto' }} />
                        {postList?.length === 0 ? <div style={{ 'margin': '20px 0' }}>검색 결과가 없습니다.</div> :
                            postList?.map((post, i) => {
                                return (
                                    <div
                                        className="post-item hover-effect"
                                        key={i}
                                        onClick={(e) => { e.stopPropagation(); navigate(`../community/qna/${post.id}`) }}
                                    >
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
                </div>
            </div>
        </div>
    );
}

function Category() {//카테고리
    return <>

        <h5>QnA</h5>
        <hr style={{ width: '60%', margin: '0 auto' }} />
        <Nav defaultActiveKey="#" className="flex-column">
            <Nav.Link href="#"><div style={{ color: '#282c34' }}>웹개발</div></Nav.Link>
            <Nav.Link href="#"><div style={{ color: '#282c34' }}>모바일 앱 개발</div></Nav.Link>
            <Nav.Link href="#"><div style={{ color: '#282c34' }}>게임 개발</div></Nav.Link>
            <Nav.Link href="#"><div style={{ color: '#282c34' }}>프로그래밍 언어</div></Nav.Link>
            <Nav.Link href="#"><div style={{ color: '#282c34' }}>알고리즘 · 자료구조</div></Nav.Link>
            <Nav.Link href="#"><div style={{ color: '#282c34' }}>데이터베이스</div></Nav.Link>
            <Nav.Link href="#"><div style={{ color: '#282c34' }}>자격증</div></Nav.Link>
            <Nav.Link href="#"><div style={{ color: '#282c34' }}>개발 도구</div></Nav.Link>
            <Nav.Link href="#"><div style={{ color: '#282c34' }}>데이터 사이언스</div></Nav.Link>
            <Nav.Link href="#"><div style={{ color: '#282c34' }}>데스크톱 앱 개발</div></Nav.Link>
            <Nav.Link href="#"><div style={{ color: '#282c34' }}>교양 · 기타</div></Nav.Link>
        </Nav>
    </>

}

export default CommunityQna;