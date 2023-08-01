import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../App.css";
import "./mentoring.css";
import { Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MDEditor from '@uiw/react-md-editor';

function MentoringCreate() {

    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [selectedFile, setSelectedFile] = useState(null); 

    const words = ['웹개발', '모바일 앱 개발', '게임 개발', '프로그래밍 언어', '알고리즘 · 자료구조', '데이터베이스', '자격증', '개발 도구', '데이터 사이언스', '데스크톱 앱 개발', '교양 · 기타'];
    const [selectedWords, setSelectedWords] = useState([]); // 클릭한 단어 배열

    let [portfolio, setPortfolio] = useState({
        'image': '',
        'brief': '',
        'subject': '',
        'content': ''
    })//제목, 분야, 내용

    function postPortfolio() {
        const formData = new FormData(); // 원래는 함수 밖에 있었음 - ㅊㅇ
        const updatedSubject = JSON.stringify(selectedWords);

        // FormData 객체 생성
        formData.append("brief", portfolio.brief);
        formData.append("subject", updatedSubject);
        formData.append("content", portfolio.content);
        // formData.append("image", portfolio.image); // Blob 객체 추가
        formData.append('image', selectedFile); // ㅊㅇ

        console.log(formData.get('brief'))
        console.log(formData.get('content'))

        axios.post('/mentoring', formData)
        .then((response) => {
          alert("새 글이 등록되었습니다.");
          navigate("../mentoring/main");
        })
        .catch((error) => {
          console.error(error);
          alert("요청을 처리하지 못했습니다.");
        });
}


const handleWordClick = (word) => {
    if (selectedWords.includes(word)) {
        setSelectedWords(prevWords => prevWords.filter(w => w !== word));
        console.log(selectedWords);
    } else {
        setSelectedWords(prevWords => [...prevWords, word]);
        console.log(selectedWords);
    }
};



function checkTitle() {
    portfolio['title'] === "" || portfolio['content'] === "" ? alert("제목 또는 내용을 입력해주세요.") :
        postPortfolio();
}

const getValue = e => {
    const { name, value } = e.target;
    setPortfolio({
        ...portfolio,
        [name]: value
    })
};

const [imageSrc, setImageSrc] = useState(null);
useEffect(()=>{
    console.log(portfolio);
},[portfolio])

const onUpload = (e) => {
    setSelectedFile(e.target.files[0]); 
  };

return (
    <div className="MentoringCreate">
        <h5 style={{ fontFamily: 'TmoneyRoundWind' }}>포트폴리오 작성하기</h5>

        <div className='mentoPic' >
            <div className='child'>
                <label for="avatar">프로필 사진 등록하기(150x150 권장):</label>
            </div>
            <div className='child'>
                <input type="file" id="mentoPic" name="mentoPic" accept='image/*' onChange={e => onUpload(e)} />
            </div>
            {
                imageSrc != null ? <img
                    width={'150px'}
                    height={'150px'}
                    src={imageSrc}
                    className='child'
                /> : null
            }

        </div>

        <div className='form-wrapper'>
            <input className="title-input" type='text' placeholder='한줄소개' onChange={getValue} name='brief' />
            <MDEditor height={865} value={portfolio.content} onChange={(value, event) => {
                    setPortfolio({
                        ...portfolio,
                        content: value
                    })
                }} />
            <div className='selectSubject'>
                <hr />
                {words.map((word, index) => (
                    <span
                        key={index}
                        style={{
                            color: selectedWords.includes(word) ? 'blue' : 'gray',
                            marginRight: index % 3 === 2 ? '10px' : '5px'
                        }}
                        onClick={() => { handleWordClick(word) }}>
                        {word}
                    </span>
                ))}

            </div>

            <Button className="submit-button" variant="blue" style={{ margin: "5px" }}
                onClick={() => { checkTitle(); }}>등록</Button>
        </div>


    </div>
);
}




export default MentoringCreate;