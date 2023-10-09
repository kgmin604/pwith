import axios from "axios";
import { useState, useEffect } from "react";
import "./main.css";
import SimpleSlider from "./mainSlider.js";
import { useNavigate } from "react-router-dom";
import userEvent from "@testing-library/user-event";

function PwithMain(){
    const dummy = {'id':1,'title':'로딩중...'}
    const dummy2 = {'id':0, 'brief':'로딩중...'}
    const dummylist = [dummy,dummy,dummy,dummy,dummy];
    const dummylist2 = [dummy,dummy,dummy,dummy];
    const dummylist3 = [dummy2,dummy2,dummy2,dummy2,dummy2]

    let navigate = useNavigate();
    let [studyList, setStudyList] = useState(dummylist);
    let [newsList, setNewsList] = useState(dummylist);
    let [mentorList, setMentorList] = useState(dummylist3);
    let [contentList, setContentList] = useState(dummylist2);

    
    useEffect(()=>{
        axios({
            method: "GET",
            url: "/list"
          })
          .then(function (response) {
            setStudyList(response.data.data.study);
            setNewsList(response.data.data.news);
            setMentorList(response.data.data.mentoring);
            setContentList(response.data.data.contents);
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
                    <span className="posting-plus" onClick={()=>{navigate("/study/main")}}>(+)</span></h5>
                    <ul className="posting-list">
                    {
                        studyList.length===0 ? null :
                        studyList.map((a,i)=>{
                            return(
                                <li 
                                    className="posting" 
                                    key={i}
                                    onClick={(e)=>{e.stopPropagation(); navigate(`./study/${a['id']}`)}}
                                > 
                                    {a['title']}
                                </li>
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
                        newsList.length===0 ? null :
                        newsList.map((a,i)=>{
                            return(
                                <li 
                                    className="posting" 
                                    key={i}
                                    onClick={(e)=>{e.stopPropagation(); window.open(`${a['url']}`, '_blank');}}
                                >{a['title']}</li>
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
                        mentorList.length===0 ? null :
                        mentorList.map((a,i)=>{
                            return(
                                <li 
                                    className="posting" 
                                    key={i}
                                    onClick={(e)=>{e.stopPropagation(); navigate(`./mentoring/${a['id']}`)}}
                                >{a['brief']}
                                </li>
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
                            <div 
                                className="study-content" 
                                key={i} 
                                onClick={e=>{e.stopPropagation(); window.open(`${a['url']}`, '_blank');}}
                            >
                                <img className="study-content-img" src={a['img']}/>
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