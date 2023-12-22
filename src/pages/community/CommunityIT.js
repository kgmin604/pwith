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
import { useLoginStore } from "../auth/CheckLogin";

function CommunityIT() {
    let navigate = useNavigate();

    let [currentDate, setcurrentDate] = useState(new Date());
    let [selectDate, setSelectDate] = useState(new Date());
    let [stringDate, setStringDate] = useState(
        `${selectDate.getFullYear()}.${String(selectDate.getMonth() + 1).padStart(2, '0')}.${String(selectDate.getDate()).padStart(2, '0')}`
    );
    let [totalPage, setTotalPage] = useState(1);
    let [selectPage, setSelectPage] = useState(1);
    let [inputPage, setInputPage] = useState(0);

    const [itList, setItList] = useState([]);

    const {checkLogin}=useLoginStore()

    useEffect(() => {
        checkLogin()
    }, [])
    
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
                    setTotalPage(response.data.data.page);
                    setItList(response.data.data.news);
                })
                .catch(function (error) {
                    console.log("IT 뉴스 요청 에러");
                    console.log(error);
                });
        };

        updateITNews();
    }, [selectDate, selectPage]);

    function controlDate(event, type) {
        event.stopPropagation();
        if (type === -1) { // < 버튼
            const previousDate = new Date(selectDate.getTime() - (24 * 60 * 60 * 1000));
            setSelectDate(previousDate);
            setItList([]);
            setStringDate(
                `${previousDate.getFullYear()}.${String(previousDate.getMonth() + 1).padStart(2, '0')}.${String(previousDate.getDate()).padStart(2, '0')}`
            );
            setSelectPage(1);
        }
        else if (type === 1) { // > 버튼
            const nextDate = new Date(selectDate.getTime() + (24 * 60 * 60 * 1000));
            if (nextDate <= currentDate) {
                setSelectDate(nextDate);
                setItList([]);
                setStringDate(
                    `${nextDate.getFullYear()}.${String(nextDate.getMonth() + 1).padStart(2, '0')}.${String(nextDate.getDate()).padStart(2, '0')}`
                );
                setSelectPage(1);
            }
        }
    }

    function changePage(event) {
        event.stopPropagation();
        if (1 <= inputPage && inputPage <= totalPage) {
            setSelectPage(inputPage);
        }
    }

    function inputChange(event) {
        event.stopPropagation();
        setInputPage(event.target.value);
    }

    return (
        <div className="CommunityIT">

            <div className="selected-date">
                <span onClick={(e) => controlDate(e, -1)}>{'<'}</span>
                {stringDate}
                <span onClick={(e) => controlDate(e, 1)}>{'>'}</span>
            </div>
            <hr />
            <div className="itnews-list">
                {
                    itList.map((it, i) => {
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
            <div className="control-page-it">
                <input
                    type='number'
                    className='page-num'
                    onChange={e => inputChange(e)}
                    onKeyDown={(e) => { if (e.key === "Enter") changePage(e); }}
                    defaultValue={selectPage}
                ></input>
                /{totalPage + " "}page
                <button onClick={(e) => { changePage(e); }}>이동</button>
            </div>
        </div>
    );
}

export default CommunityIT;