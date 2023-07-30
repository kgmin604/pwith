import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../App.css";
import "./mentoring.css";
import { Form, Nav, Stack, Button, Row } from "react-bootstrap";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import MentoCard from './MentoCard';

function MentoringMain() {
    const navigate = useNavigate();
    const [mentoList, setMentoList] = useState([]);
    const [userinput, setUserinput] = useState('');


    useEffect(() => {
        axios({
            method: "GET",
            url: "/mentoring",
        })
            .then(function (response) {
                console.log(response.data.data)
                setMentoList(response.data.data);
            })
            .catch(function (error) {
                console.log(error);
            });

    }, []);

    function searchMentor() {
        axios({
            method: "GET",
            url: "/mentoring",
            params: {
                value: `${userinput}`
            }
        })
            .then(function (response) {
                setMentoList(response.data.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <div className="MentoringMain">
            <div className="row">
                <div className="col-md-3">
                    {Category()}
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
                        {mentoList.map((mento) => {
                            return (<MentoCard mento={mento} />
                            )
                        })}
                    </Row>
                </div>

                <div className="col-md-3"></div>
            </div>
        </div>
    );
}



function Category() {
    return <>
        <h5>Mentoring</h5>
        <hr style={{ width: '60%', margin: '0 auto' }} />
        <Nav defaultActiveKey="#" className="flex-column">
            <Link to="#"><div style={{ color: '#282c34' }}>멘토링</div></Link>
            <Link to="../mentoring/create"><div style={{ color: '#282c34' }}>포트폴리오 업로드</div></Link>
        </Nav>
    </>
}

export default MentoringMain;
