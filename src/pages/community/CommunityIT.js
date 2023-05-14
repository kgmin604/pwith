import "bootstrap/dist/css/bootstrap.min.css";
import "./community.css";
import "../../App.css";
import React, { useState } from 'react';
import { Form, Nav, Stack, Button, Table } from "react-bootstrap";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

function CommunityIT(){
    let navigate = useNavigate();
    let postList=[];

    return(
        <div className="CommunityIT">
                    <Stack direction="horizontal" gap={3} style={{ padding: "5px" }}>
            <Form.Control className="me-auto" placeholder="IT 소식을 검색해보세요!" />
            <Button variant="blue">🔍</Button>
        </Stack>

        <Table bordered hover>
            <thead>
                <tr>
                    <th>no.</th>
                    <th colSpan={2}>글제목</th>
                    <th>조회수</th>
                    <th>날짜</th>
                    <th>인원</th>
                </tr>
            </thead>
            <tbody>

                {postList.map(function (row, index) {
                    return (
                        <tr className="postCol" key={row[0]} onClick={() => navigate(`../${index + 1}`)}>
                            <td>{row[0]}</td>
                            <td colSpan={2}>{row[1]}</td>
                            <td>{row[6]}</td>
                            <td>{row[3]}</td>
                            <td>{row[8]}</td>
                        </tr>
                    );
                }
                )}
            </tbody>
        </Table>
    </div>
    );
}

export default CommunityIT;