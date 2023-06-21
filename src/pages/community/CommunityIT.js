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

    let [currentDate, setcurrentDate] = useState(new Date());
    let [selectDate, setSelectDate] = useState(new Date());
    let [stringDate, setStringDate] = useState(
        `${selectDate.getFullYear()}.${String(selectDate.getMonth() + 1).padStart(2, '0')}.${String(selectDate.getDate()).padStart(2, '0')}`
    );
    let [totalPage, setTotalPage] = useState(1);
    let [selectPage, setSelectPage] = useState(1);

    const [itList, setItList] = useState([]);

    useEffect(() => {

        /* Date 객체 -> 문자열 변환 */
        const y = selectDate.getFullYear();
        const m = String(selectDate.getMonth() + 1).padStart(2, '0');
        const d = String(selectDate.getDate()).padStart(2, '0');

        const updateITNews = () => {
          axios({
            method: "GET",
            url: "/community/it",
            params: {
              'page': `${selectPage}`,
              'date': `${y}${m}${d}`
            }
          })
            .then(function (response) {
                console.log(response.data.page);
                setTotalPage(response.data.page);
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
                {stringDate}
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