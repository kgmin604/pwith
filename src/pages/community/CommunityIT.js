import "bootstrap/dist/css/bootstrap.min.css";
import "./community.css";
import "./community-it.css";
import "../../App.css";
import React, { useState, useEffect } from 'react';
import { Form, Nav, Stack, Button, Table } from "react-bootstrap";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { updateITNewsList, updateiTNewsList } from "../../store.js";

function CommunityIT() {
    let navigate = useNavigate();

    /* 현재 날짜 계산 */
    const currentDate = new Date();
    const y = currentDate.getFullYear();
    const m = String(currentDate.getMonth() + 1).padStart(2, '0');
    const d = String(currentDate.getDate()).padStart(2, '0');

    let [todayDate, setTodayDate] = useState(currentDate);
    let [selectDate, setSelectDate] = useState(`${y}${m}${d}`);
    let [totalPage, setTotalPage] = useState(1);
    let [selectPage, setSelectPage] = useState(1);

    const [itList, setItList] = useState([]);

    useEffect(() => {
        const updateITNews = () => {
          axios({
            method: "GET",
            url: "/community/it",
            params: {
              'page': `${selectPage}`,
              'date': `${selectDate}`
            }
          })
            .then(function (response) {
                //console.log(response.date.page);
                //setTotalPage(response.date.page);
                setItList(response.data.news);
            })
            .catch(function (error) {
              console.log("IT 뉴스 요청 에러");
              console.log(error);
            });
        };
      
        updateITNews();
    }, [selectDate, selectPage]);

    function controlDate(type){
        if(type==-1){ // < 버튼

        }
        else if(type==1){ // > 버튼

        }
    }

    return (
        <div className="CommunityIT">
            <Stack direction="horizontal" gap={3} style={{ padding: "5px" }}>
                <Form.Control className="me-auto" placeholder="IT 소식을 검색해보세요!" />
                <Button variant="blue">🔍</Button>
            </Stack>
            <hr/>

            <div className="selected-date">
                <span>{'<'}</span>
                {`${y}.${m}.${d}`}
                <span>{'>'}</span>
            </div>

            <div className="itnews-list">
            {
                itList.map((it,i) => {
                    return (
                        <div 
                            className="item"
                            key={i} 
                            onClick={() => window.open(it.url, '_blank')}
                        >
                            <div className="it-textarea">
                                <div className="it-title">{it.title}</div>
                                <div className="it-brief">{it.brief}</div>
                            </div>
                            <img src={it.img}></img>
                        </div>
                    );
                }) 
            }

            </div>
            <Button onClick={() => console.log(itList)}>불러온데이터 콘솔</Button>
        </div>
    );
}

export default CommunityIT;