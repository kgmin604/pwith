import "bootstrap/dist/css/bootstrap.min.css";
import "./community-content.css";
import "../../App.css";
import React, { useState, useEffect } from 'react';
import { Form, Nav, Stack, Button, Table } from "react-bootstrap";
import axios from "axios";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

function CommunityContent() {

    let [type, setType] = useState('책'); // 책 또는 강의

    const [pages, setPages] = useState([]); // 임시
    const [selectBookPage, setSelectBookPage] = useState(1);
    const [selectLecturePage, setSelectLecturePage] = useState(1);
    const [category, setCategory] = useState(null);
    const [bookIsNext, setBookIsNext] = useState(true)
    const [lectureIsNext, setLectureIsNext] = useState(true)

    const [bookList, setBookList] = useState([])
    const [lectureList, setLectureList] = useState([])

    useEffect(() => {
        axios({
            method: "GET",
            url: "/community/contents/book",
            params: {
                page: selectBookPage,
                category: category
            }
        })
            .then(function (response) {
                const data = response.data.data
                setBookList((prev) => [...prev, ...data.book])
                setBookIsNext(data.isNext)
            })
            .catch(function (error) {
            });
    }, [selectBookPage]);
    useEffect(() => {
        axios({
            method: "GET",
            url: "/community/contents/lecture",
            params: {
                page: selectLecturePage,
                category: category
            }
        })
            .then(function (response) {
                const data = response.data.data
                setLectureList((prev) => [...prev, ...data.lecture])
                setLectureIsNext(data.isNext)
            })
            .catch(function (error) {
            });
    }, [selectLecturePage]);
    const moreBook = () => {
        setSelectBookPage(selectBookPage + 1)
    }
    const moreLecture = () => {
        setSelectLecturePage(selectLecturePage + 1)

    }
    return (
        <>
            <div class="row">
                <div class="col-md-3 category-area">
                    <Category />
                </div>
                <div class="col-md-9 content-area">
                    <div className="header">
                        <h3
                            className={type === '책' ? "selected" : "non-selected"}
                            onClick={(e) => { e.stopPropagation(); setType('책'); }}
                        >책</h3>
                        <h3>|</h3>
                        <h3
                            className={type === '강의' ? "selected" : "non-selected"}
                            onClick={(e) => { e.stopPropagation(); setType('강의'); }}
                        >인터넷 강의</h3>
                    </div>
                    <div className="body">
                        <div className="items">
                            {
                                type === '책' && <div><div>{bookList.map((item, i) => (
                                    <div
                                        key={i}
                                        className="content-card"
                                        onClick={(e) => { e.stopPropagation(); window.open(item.link, '_blank') }}
                                    >
                                        <img src={item.image} />
                                        <h5>{item.title}</h5>
                                        <div className="tags">
                                            {<span
                                                className="tag"
                                            >{item.second_category}</span>
                                            }
                                        </div>

                                    </div>
                                ))}</div>
                                    {bookIsNext && <div className="more-button" onClick={moreBook}>더보기</div>}
                                </div>

                            }

                            {type === '강의' && <div><div>{lectureList.map((item, i) => (
                                <div
                                    key={i}
                                    className="content-card"
                                    onClick={(e) => { e.stopPropagation(); window.open(item.link, '_blank') }}
                                >
                                    <img src={item.image} />
                                    <h5>{item.title}</h5>
                                    <div className="tags">
                                        {<span
                                            className="tag"
                                        >{item.second_category}</span>
                                        }
                                    </div>
                                </div>
                            ))}
                            </div>
                                {lectureIsNext && <div className="more-button" onClick={moreLecture}>더보기</div>}
                            </div>}
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

function Category() {//카테고리
    return (
        <>
            <h5>학습 콘텐츠</h5>
            <hr style={{ width: '60%', margin: '0 auto' }} />
            <Nav defaultActiveKey="#" className="flex-column">
                <Nav.Link href="#"><div style={{ color: '#282c34' }}>네트워크/해킹/보안</div></Nav.Link>
                <Nav.Link href="#"><div style={{ color: '#282c34' }}>게임</div></Nav.Link>
                <Nav.Link href="#"><div style={{ color: '#282c34' }}>모바일 프로그래밍</div></Nav.Link>
                <Nav.Link href="#"><div style={{ color: '#282c34' }}>웹사이트</div></Nav.Link>
                <Nav.Link href="#"><div style={{ color: '#282c34' }}>컴퓨터공학</div></Nav.Link>
                <Nav.Link href="#"><div style={{ color: '#282c34' }}>컴퓨터수험서</div></Nav.Link>
                <Nav.Link href="#"><div style={{ color: '#282c34' }}>프로그래밍 언어</div></Nav.Link>
                <Nav.Link href="#"><div style={{ color: '#282c34' }}>OS/데이터베이스</div></Nav.Link>
            </Nav>
        </>
    );
}

export default CommunityContent;