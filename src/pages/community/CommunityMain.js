import "bootstrap/dist/css/bootstrap.min.css";
import "./community.css";
import "../../App.css";
import React, { useState } from 'react';
import { Form, Nav, Stack, Button, Table } from "react-bootstrap";
import { Routes, Route, Link, useNavigate, Outlet } from "react-router-dom";

function CommunityMain() {
    let navigate = useNavigate();

    return (
        <div className="CommunityMain">
            <div class="row">
                <div class="col-md-3">
                    <h5>커뮤니티</h5>
                    <hr style={{ width: '60%', margin: '0 auto' }} />
                    <Nav defaultActiveKey="/community" className="flex-column">
                        <Nav.Link href="/community/it"><div style={{ color: '#282c34' }}>IT 뉴스</div></Nav.Link>
                        <Nav.Link href="/community/bootcamp"><div style={{ color: '#282c34' }}>부트캠프 후기</div></Nav.Link>
                        <Nav.Link href="/community/qna"><div style={{ color: '#282c34' }}>QnA</div></Nav.Link>
                    </Nav>
                </div>


                <div class="col-md-6">
                    <Outlet></Outlet>
                </div>


                <div class="col-md-3">
                </div>


            </div>
        </div>
    );
}


export default CommunityMain;