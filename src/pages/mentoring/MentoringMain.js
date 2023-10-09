import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../App.css";
import "./mentoring.css";
import { Form, Nav, Stack, Button, Row } from "react-bootstrap";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import MentorCard from './MentorCard';
import { useSelector } from "react-redux";



function MentoringMain() {
    const navigate = useNavigate();
    const [selectPage, setSelectPage] = useState(0);
    const [mentoList, setMentoList] = useState([]);
    const [userinput, setUserinput] = useState('');
    const [isNext,setIsNext]=useState(false)
    const [myPortfolio, setMyPortfolio] = useState();

    useEffect(() => {
        axios({
            method: "GET",
            url: "/mentoring",
            params: {
                page: selectPage
            }
        })
            .then(function (response) {
                const data = response.data.data
                setMentoList((prev) => [...prev, ...data.portfolioList]);
                setMyPortfolio(data.myPortfolio);
                setIsNext(data.isNext);
            })
            .catch(function (error) {
                console.log(error);
            });

    }, [selectPage]);

    const more = () => {
        setSelectPage(selectPage + 1)
    }

    function searchMentor() {
        axios({
            method: "GET",
            url: "/mentoring",
            params: {
                search: `${userinput}`,
                page:0,
            }
        })
            .then(function (response) {
                setMentoList(response.data.data.portfolioList);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <div className="MentoringMain">
            <div className="row">
                <div className="col-md-3">
                    <Category myPortfolio={myPortfolio} />
                </div>
                <div className="col-md-8">
                    <Stack direction="horizontal" gap={3} style={{ padding: "5px" }}>
                        <Form.Control
                            className="me-auto"
                            placeholder="원하는 멘토를 찾아보세요!"
                            onChange={(e) => { e.stopPropagation(); setUserinput(e.target.value); }}
                            onKeyDown={(e) => { if (e.key === "Enter") searchMentor(); }}
                        />
                        <Button
                            variant="blue"
                            onClick={(e) => { e.stopPropagation(); searchMentor(); }}
                        >
                            🔍
                        </Button>
                    </Stack>
                    <hr />
                    <Row className="row-cols-1 row-cols-md-4 g-2" style={{ padding: '10px' }}>
                        {mentoList?.map((mento) => {
                            return (<MentorCard mento={mento} />
                            )
                        })}
                    </Row>
                    {isNext && <div className="more-button" onClick={more}>더보기</div>}
                </div>

                <div className="col-md-3"></div>
            </div>
        </div>
    );
}



function Category({ myPortfolio }) {
    const user = useSelector((state) => state.user);
    return <>
        <h5>Mentoring</h5>
        <hr style={{ width: '60%', margin: '0 auto' }} />
        <Nav defaultActiveKey="#" className="flex-column">
            <Link to="#"><div style={{ color: '#282c34' }}>멘토링</div></Link>
            <Link to={user.id === null ? '#' : `../mentoring/create`} ><div className={user.id === null ? 'disabled' : 'category'}>포트폴리오 작성</div></Link>
            <Link to={user.id === null ? '#' : `../mentoring/${myPortfolio}`}><div className={user.id === null ? 'disabled' : 'category'}>포트폴리오 관리</div></Link>
        </Nav>
    </>
}

export default MentoringMain;
