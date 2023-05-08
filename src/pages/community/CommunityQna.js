import "bootstrap/dist/css/bootstrap.min.css";
import "./community.css";
import "../../App.css";
import React, { useState } from 'react';
import { Form, Nav, Stack, Button, Table } from "react-bootstrap";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

function CommunityQna(){
    return(
        <div className="CommunityQna">
            qna 페이지입니다
        </div>
    );
}

export default CommunityQna;