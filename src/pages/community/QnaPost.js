import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "../study/study.css";
import "./community.css";
import "../../App.css";
import axios from "axios";
import { Nav, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import MDEditor from '@uiw/react-md-editor';
import LikeAndComment from '../../component/likeAndComment';
import QnaCategory from './QnaCategory';

function QnaPost(props) {
    let user = useSelector((state) => state.user);
    let navigate = useNavigate();
    const { id } = useParams();
    const [post, setPost] = useState({});
    const [reply, setReply] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);
    useEffect(() => {
        axios.get(`/community/qna/${id}`)
            .then((response) => {
                setPost(response.data.data.post);
                setReply(response.data.data.reply);
            })
            .catch();
    }, [id]);

    useEffect(() => {
    }, [post.title])

    if (!post) {
        return <div>Loading...</div>;
    }

    function updatePost(content) {
        axios.patch(`/community/qna/${id}`, {
            title: `${post.title}`,
            postId: `${id}`,
            content: `${content}`
        })
            .then(function (response) {
                setIsUpdating(false);
                navigate(`../community/qna/${id}`);
                alert("글 수정 성공");
            }).catch(function (error) {
                // 오류발생시 실행
            })
    }

    function deletePost() {
        axios.delete(`/community/qna/${id}`, {
            data: {
                postId: `${id}`
            }
        })
            .then(function (response) {
                navigate(`../community/qna/main`);
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
            deletePost()
        }
    }


    return (
        <div className="QnaPost">
            {!isUpdating ? <div>
                <div class="row">
                    <div class="col-md-3">
                        <QnaCategory />
                    </div>
                    <div class="col-md-6 StudyPost">
                        <h2 style={{ textAlign: 'left' }}>QnA</h2>
                        <hr style={{ width: '100%', margin: '0 auto' }} />
                        <div className="study-header">
                            <h3>{post.title}</h3>
                            <p className="info">
                                <strong>작성자</strong> <span className="info-content">{post.writer}</span>
                                <span className="line">|</span>
                                <strong>조회수</strong> <span className="info-content">{post.views}</span>
                                <span className="line">|</span>
                                <strong>등록일</strong> <span className="info-content">{post.curDate}</span>
                                {user.name === post.writer ?
                                    <span className="control-part">
                                        <button className="control-btn" onClick={() => setIsUpdating(true)}>수정</button>
                                        <button className="control-btn" onClick={() => checkDelete()}>삭제</button>
                                    </span>
                                    :
                                    null}
                            </p>
                        </div>
                        <hr style={{ width: '100%', margin: '0 auto' }} />

                        <div className="studyContent">
                            <div className="markdownDiv" data-color-mode="light" style={{ padding: 15 }}>
                                <MDEditor.Markdown
                                    style={{ padding: 10 }}
                                    source={post.content}
                                />
                            </div>
                        </div>
                        <LikeAndComment id={id} liked={post.liked} likes={post.likes} reply={reply} type={'qna'} />

                        <div class="col-md-3"></div>
                    </div>
                </div>

            </div> : <div>
                <div className='StudyCreate' style={{ textAlign: 'start', width: '60%', margin: 'auto' }}>
                    <h5>QnA 글 수정하기</h5>
                    <input className="title-input" type='text' value={post.title} onChange={(event) => {
                        const updatedTitle = event.target.value;
                        setPost({
                            ...post,
                            title: updatedTitle
                        });
                    }} />
                    <hr style={{ width: '100%', margin: '0 auto', marginBottom: '10px' }} />
                    <div className='form-wrapper' style={{ width: '100%' }}>
                        <div style={{ width: '100%' }}>
                            <MDEditor height={865} value={post.content} onChange={(value, event) => {
                                setPost({
                                    ...post,
                                    content: value
                                })
                            }} />
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    className="submit-button"
                                    variant="blue"
                                    onClick={() => updatePost(post.content)}
                                    style={{ margin: '10px' }}
                                > 수정
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    );

}

export default QnaPost;