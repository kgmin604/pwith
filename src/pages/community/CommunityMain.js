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
                        <Link to="/community/it" style={{ color: '#282c34' }}>IT 뉴스</Link>
                        <Link to="/community/content" style={{ color: '#282c34' }}>학습 컨텐츠</Link>
                        <Link to="/community/qna/main" style={{ color: '#282c34' }}>QnA</Link>
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