import React, { useEffect, useState, createRef } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./mentoring.css";
import "../../App.css";
import axios from "axios";
import { Form, Nav, Stack, Button, Table } from "react-bootstrap";
import { Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Comment from './Comment.js';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

function MentoringPost() {
    let user = useSelector((state) => state.user);
    let { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState({});
    const [review, setReview] = useState([]);
    const [dataUrl, setDataUrl] = useState('');

    const [isUpdating, setIsUpdating] = useState(false);

    const formData = new FormData();
    const [selectedFile, setSelectedFile] = useState(null); // ㅊㅇ 추가

    const words = ['웹개발', '모바일 앱 개발', '게임 개발', '프로그래밍 언어', '알고리즘 · 자료구조', '데이터베이스', '자격증', '개발 도구', '데이터 사이언스', '데스크톱 앱 개발', '교양 · 기타'];
    const [selectedWords, setSelectedWords] = useState([]); // 클릭한 단어 배열

    // let [portfolio, setPortfolio] = useState({
    //     'image': '',
    //     'brief': '',
    //     'subject': '',
    //     'content': ''
    // })//제목, 분야, 내용

    function updatePortfolio() {
        // 원래는 함수 밖에 있었음 - ㅊㅇ
        const updatedSubject = JSON.stringify(selectedWords);

        // FormData 객체 생성
        formData.append("brief", post.brief);
        formData.append("subject", updatedSubject);
        formData.append("content", post.content);
        // formData.append("image", portfolio.image); // Blob 객체 추가
        formData.append('image', selectedFile); // ㅊㅇ

        console.log(formData.get('brief'))
        console.log(formData.get('content'))

        axios.put(`/mentoring/update/${id}`, formData)
            .then(function (response) {
                setIsUpdating(false);
                navigate(`../mentoring/${id}`);
                alert("글 수정 성공");
            }).catch(function (error) {
                // 오류발생시 실행
            })

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
        post['title'] === "" || post['content'] === "" ? alert("제목 또는 내용을 입력해주세요.") :
            updatePortfolio();
    }



    const getValue = e => {
        const { name, value } = e.target;
        setPost({
            ...post,
            [name]: value
        })
    };

    const [imageSrc, setImageSrc] = useState(null);
    useEffect(() => {
        console.log(post);
    }, [post])

    const onUpload = (e) => {
        setSelectedFile(e.target.files[0]); // ㅊㅇ, 밑에 대신 이거 한 줄 사용했음
    }

    useEffect(() => {
        axios.get(`/mentoring/${id}`)
            .then(response => {
                setPost(response.data.portfolio);
                setReview(response.data.review);
                
                const image = response.data.portfolio.image; // 이미지 데이터
                const url = `data:image/jpeg;base64,${image}`;
                setDataUrl(url);
            })
            .catch(error => console.error(error));
    }, []);



    function joinMentoring() {
        if (user.id === null) {
            alert("로그인이 필요합니다")
        }
        else {
            axios.get(`/mentoring/${id}`, {
                params: {
                    apply: 'go'
                }
            })
                .then(function (response) {
                    alert("신청이 완료되었습니다.")
                }).catch(function (error) {
                    console.log(error);
                }).then(function () {
                    // 항상 실행
                });
        }
    }

    let parsedContent = null;
    if (post.content != null) {
        const parse = require('html-react-parser');
        parsedContent = parse(post.content);
    }

    function deletePost() {
        axios.delete(`/mentoring/delete/${id}`, {
            data: {
                mento: `${id}`
            }
        })
            .then(function (response) {
                navigate(`../mentoring/main`);
                alert("글 삭제 성공");
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    function checkDelete() {
        // eslint-disable-next-line no-restricted-globals
        const result = confirm("정말 글을 삭제하시겠습니까?");
        if (result) {
            deletePost();
        }
    }

    return (<div>

        {!isUpdating ? <div className="MentoringPost">

            <div class="row">
                <div class="col-md-3"></div>


                <div class="col-md-6">
                    <h5>{post.brief}</h5>
                    <hr style={{ width: '100%', margin: '0 auto' }} />
                    {
                        user.id === post.mento ?
                            <div className="control-part" style={{ display: 'flex', justifyContent: 'end', gap: '10px' }}>
                                <button className="control-btn" onClick={() => setIsUpdating(true)}>수정</button>
                                <button className="control-btn" onClick={() => checkDelete()}>삭제</button>
                            </div>
                            :
                            null
                    }

                    <div className="MentoringTitle" style={{ display: 'flex', justifyContent: 'center' }} >
                        <img src={dataUrl} style={{ borderRadius: '100%', width: '150px', height: '150px', margin: '10px' }} />
                    </div>
                    <h4>{post.mento}</h4>
                    <hr style={{ width: '50%', margin: '0 auto' }} />

                    <div className="mentoringContent">
                        <p cols="50" rows="10">
                            {parsedContent}
                        </p>
                    </div>

                    <Button variant='blue' onClick={() => joinMentoring()} style={{ margin: '20px' }}>멘토링 신청하기</Button>
                    <Comment id={id} mento={post.mento} review={review} />
                </div>


                <div class="col-md-3">
                </div>


            </div>
        </div> : <div className="MentoringCreate">
            <h5 >포트폴리오 수정하기</h5>

            <div className='mentoPic' >
                <div className='child'>
                    <label for="avatar">프로필 사진 등록하기(150x150 권장):</label>
                </div>
                <div className='child'>
                    <input type="file" id="mentoPic" name="mentoPic" accept='image/*' onChange={e => onUpload(e)} />
                </div>
                {
                    dataUrl != null ? <img
                        width={'150px'}
                        height={'150px'}
                        src={dataUrl}
                        className='child'
                    /> : null
                }

            </div>

            <div className='form-wrapper'>
                <input className="title-input" type='text' placeholder='한줄소개' onChange={getValue} name='brief' value={post.brief}/>
                <CKEditor
                    editor={ClassicEditor}
                    data=" "
                    config={{
                        placeholder: "내용을 입력하세요.",
                    }}
                    onReady={editor => {
                        editor.setData(post.content);
                    }}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        setPost({
                            ...post,
                            content: data
                        })
                    }}
                    style={{ width: '500px' }}
                />

                <div className='selectSubject'>
                    <hr />
                    {words.map((word, index) => (
                        <span
                            key={index}
                            style={{
                                color: selectedWords.includes(word) ? 'blue' : 'gray',
                                marginRight: index % 3 === 2 ? '10px' : '5px'
                            }}
                            onClick={() => { handleWordClick(word) }}
                        >
                            {word}
                        </span>
                    ))}

                </div>

                <Button className="submit-button" variant="blue" style={{ margin: "5px" }}
                    onClick={() => { checkTitle(); }}>수정</Button>
            </div>


        </div>
        }
    </div>
    );

}



export default MentoringPost;