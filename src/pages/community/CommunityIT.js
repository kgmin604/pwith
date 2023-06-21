import "bootstrap/dist/css/bootstrap.min.css";
import "./community.css";
import "../../App.css";
import React, { useState, useEffect } from 'react';
import { Form, Nav, Stack, Button, Table } from "react-bootstrap";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { updateITNewsList, updateiTNewsList } from "../../store.js";

function CommunityIT() {
    let navigate = useNavigate();


    const [itList, setItList] = useState([]);
    useEffect(() => {
        const updateITNews = () => {
            axios({
                method: "GET",
                url: "/community/it",
            })
                .then(function (response) {
                    setItList(response.data);
                })
                .catch(function (error) {
                });
        };

        updateITNews();
    }, []);

    // const itList = [
    //     {
    //         'newsId': 1,
    //         'title': "대기업-스타트업 “한국형 기업규제 개선을” 한목소리 호소",
    //         'content': "뉴스 내용",
    //         'img': "https://dimg.donga.com/a/200/113/95/2/wps/NEWS/IMAGE/2023/06/15/119773870.1.jpg",
    //         'url': "https://www.donga.com/news/Economy/article/all/20230615/119773873/1"
    //     },
    //     {
    //         'newsId': 2,
    //         'title': "5개종목 줄줄이 하한가 폭락… ‘제2 SG사태’ 우려",
    //         'content': "뉴스 내용",
    //         'img': "https://dimg.donga.com/a/200/113/95/2/wps/NEWS/IMAGE/2023/06/14/119768871.2.jpg",
    //         'url': "https://www.donga.com/news/Economy/article/all/20230615/119773873/1"
    //     },
    //     {
    //         'newsId': 3,
    //         'title': "닥터헬기 비행-비보잉 ‘합동 퍼포먼스’… 저물녘엔 ‘불멍’ 휴식 [2023 서울헬스쇼] ",
    //         'content': "뉴스 내용",
    //         'img': "https://dimg.donga.com/a/200/113/95/2/wps/NEWS/IMAGE/2023/06/15/119768401.10.jpg",
    //         'url': "https://www.donga.com/news/Economy/article/all/20230615/119773873/1"
    //     },
    //     {
    //         'newsId': 4,
    //         'title': "폐그물 재활용 내장재 적용 전기차 EV9 선보여 [2023 서울헬스쇼]",
    //         'content': "뉴스 내용",
    //         'img': "https://dimg.donga.com/a/200/113/95/2/wps/NEWS/IMAGE/2023/06/15/119768417.8.jpg",
    //         'url': "https://www.donga.com/news/Economy/article/all/20230615/119773873/1"
    //     },
    // ]

    return (
        <div className="CommunityIT">
            <Stack direction="horizontal" gap={3} style={{ padding: "5px" }}>
                <Form.Control className="me-auto" placeholder="IT 소식을 검색해보세요!" />
                <Button variant="blue">🔍</Button>
            </Stack>
            <hr/>
            <Stack gap={3}>
                {
                    itList.map((item) => {
                        return (
                            <div key={item.newsId} className="align" onClick={() => window.open(item.url, '_blank')}>
                            <img src={item.img}></img>
                            <div>
                            <div className="title">{item.title}</div>
                            <div className="summit">{item.content}</div>
                            {/* <div>{item.date}</div> 날짜 아직 안 받아옴 */}
                            </div>
                          </div>
                        );
                      })
                }
            </Stack>
            <Button onClick={() => console.log(itList)}>불러온데이터 콘솔</Button>
        </div>
    );
}

export default CommunityIT;