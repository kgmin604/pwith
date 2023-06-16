import axios from "axios";
import { useState, useEffect } from "react";
import "./main.css";
import SimpleSlider from "./mainSlider.js";
import { useNavigate } from "react-router-dom";

function PwithMain(){

    let navigate = useNavigate();
    // {'id':-1,'title':''}, {'id':-1,'title':''}, {'id':-1,'title':''}, {'id':-1,'title':''}, {'id':-1,'title':''} // 초기화용
    let [studyList, setStudyList] = useState([
        {'id':1,'title':'제목1'}, {'id':2,'title':'제목2'}, {'id':3,'title':'제목3'}, {'id':4,'title':'제목4'}, {'id':5,'title':'제목5'}
    ])
    let [newsList, setNewsList] = useState([
        {'id':1,'title':'제목1'}, {'id':2,'title':'제목2'}, {'id':3,'title':'제목3'}, {'id':4,'title':'제목4'}, {'id':5,'title':'제목5'}
    ])
    let [mentorList, setMentorList] = useState([
        {'id':1,'title':'제목1'}, {'id':2,'title':'제목2'}, {'id':3,'title':'제목3'}, {'id':4,'title':'제목4'}, {'id':5,'title':'제목5'}
    ])
    let [contentList, setContentList] = useState([
        {'id':1,'title':'제목1'}, {'id':2,'title':'제목2'}, {'id':3,'title':'제목3'}, {'id':4,'title':'제목4'}
    ])

    
    useEffect(()=>{
        axios({
          method: "GET",
          url: "/",
        })
        .then(function (response) {
            if(response.data.studyList === undefined){ // 수정해야 함!!
                setStudyList([
                    {'id':1,'title':'제목1'}, {'id':2,'title':'제목2'}, {'id':3,'title':'제목3'}, {'id':4,'title':'제목4'}, {'id':5,'title':'제목5'}
                ]);
            }
            else setStudyList(response.data.studyList);
        })
        .catch(function (error) {
            console.log(error);
        });
    },[])
    

    return(
        <>
            <SimpleSlider/>
            <div className="main-area">
                <div className="posting-part" style={{'margin-right':'40px'}}>
                    <h5 className="posting-header">모집중인 스터디
                    <span className="posting-plus" onClick={()=>{navigate("/study")}}>(+)</span></h5>
                    <ul className="posting-list">
                    {
                        studyList.map((a,i)=>{
                            return(
                                <li className="posting" key={i}> {a['title']}</li> // onClick 속성 추가 -> 눌렀을 때 해당 글로
                            )
                        })
                    }  
                    </ul>
                </div>
                <div className="posting-part" style={{'margin-right':'40px'}}>
                    <h5 className="posting-header">최신 IT 뉴스
                    <span className="posting-plus" onClick={()=>{navigate("/community/IT")}}>(+)</span></h5>
                    <ul className="posting-list">
                    {
                        newsList.map((a,i)=>{
                            return(
                                <li className="posting" key={i}>{a['title']}</li> // onClick 속성 추가 -> 눌렀을 때 해당 글로
                            )
                        })
                    }  
                    </ul>
                </div>
                <div className="posting-part">
                    <h5 className="posting-header">멘토링 신청하기
                    <span className="posting-plus" onClick={()=>{navigate("/mentoring")}}>(+)</span></h5>
                    <ul className="posting-list">
                    {
                        mentorList.map((a,i)=>{
                            return(
                                <li className="posting" key={i}>{a['title']}</li> // onClick 속성 추가 -> 눌렀을 때 해당 글로
                            )
                        })
                    }  
                    </ul>
                </div>
            </div>
            <div className="main-area" style={{'height':'350px', 'margin-bottom':'80px'}}>
                <h5 className="posting-header">무엇을 배워볼까?!</h5>
                <div>
                {
                    contentList.map((a,i)=>{
                        return(
                            <div className="study-content" key={i}>
                                <img className="study-content-img"/>
                                <h5 className="study-content-header">{a['title']}</h5>
                            </div>
                        )
                    })
                }
                    
                </div>
            </div>
        </>
    );
}


export default PwithMain;