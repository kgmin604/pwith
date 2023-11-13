import "bootstrap/dist/css/bootstrap.min.css";
import "./study.css";
import "../../App.css";
import React,{useEffect} from 'react';
import axios from 'axios'
import { Nav } from "react-bootstrap";
import { setStudyCategory } from "../../store";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";
import { updateRecStudyList } from "../../store";


const category = [
  '웹개발',
  '모바일 앱 개발',
  '게임 개발',
  '프로그래밍 언어',
  '알고리즘 · 자료구조',
  '데이터베이스',
  '자격증',
  '개발 도구',
  '데이터 사이언스',
  '데스크톱 앱 개발',
  '교양 · 기타'
]

function StudyMain() {
  const navigate = useNavigate();
  const recStudyList = useSelector((state) => state.recStudyList);

  return (
    <div className="StudyMain">
      <div class="row">
        <div class="col-md-3">
          <Category />
        </div>

        <div class="col-md-6">
          <Outlet></Outlet>
        </div>

        <div class="col-md-3">
          <h5>추천 스터디</h5>
          <hr style={{ width: '60%', margin: '0 auto', marginBottom: '10px' }} />
          <div className="rec-items">
            {
              recStudyList.Length === 0 ? null :
                recStudyList.map((study, i) => {
                  return (
                    <div className="rec-item" key={i}>
                      <img
                        src={study.image}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("./main");
                          setTimeout(() => {
                            navigate(`./${study.id}`);
                          }, 10);
                        }}
                      ></img>
                      <p
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("./main");
                          setTimeout(() => {
                            navigate(`./${study.id}`);
                          }, 10);
                        }}>
                        {study.title}
                      </p>
                    </div>
                  );
                })
            }
          </div>
        </div>
      </div>
    </div>
  );

}

function Category() {//카테고리
  const dispatch = useDispatch();
  return <>
    <h5>Study</h5>
    <hr style={{ width: '60%', margin: '0 auto' }} />
    <Nav defaultActiveKey="#" className="flex-column">
      {category.map((item, index) => (
        <Nav.Link href="#" onClick={() => { dispatch(setStudyCategory(index)) }}><div style={{ color: '#282c34' }}>{item}</div></Nav.Link>
      ))}
    </Nav>
  </>

}

export default StudyMain;
