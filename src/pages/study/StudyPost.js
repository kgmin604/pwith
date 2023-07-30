import React, { useEffect, useState, createRef } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./study.css";
import "../../App.css";
import axios from "axios";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import LikeAndComment from '../../component/likeAndComment';
import MDEditor from '@uiw/react-md-editor';

function StudyPost(props) {

    let navigate = useNavigate();

    let user = useSelector((state) => state.user);
    let { id } = useParams();

    const [post, setPost] = useState(null);
    const [reply, setReply] = useState(null);

    const [isUpdating, setIsUpdating] = useState(false);


    useEffect(() => {
        axios({
            method: "GET",
            url: `/study/${id}`
        })
            .then(function (response) {
                setPost(response.data.data.post);
                setReply(response.data.data.reply);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    if (!post) {
        return <div>Loading...</div>;
    }

    function joinStudyRoom() {
        axios({
            method: "GET",
            url: `/study/${id}`,
            params: {
                apply: 'go'
            }
        })
            .then(function (response) {
                alert("스터디 참여 완료!");
                navigate("../../studyroom");
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function updatePost(content) {
        axios.patch(`/study/${id}`, {
            postId: `${id}`,
            content: `${content}`
        })
            .then(function (response) {
                setIsUpdating(false);
                navigate(`../${id}`);
                alert("글 수정 성공");
            }).catch(function (error) {
                // 오류발생시 실행
            })
    }

    function deletePost() {
        axios.delete(`/study/${id}`, {
            data: {
                postId: `${id}`
            }
        })
            .then(function (response) {
                navigate(`../main`);
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
        <div className="StudyPost">
            {!isUpdating ? <div><h2>스터디 모집</h2>
                <hr style={{ width: '100%', margin: '0 auto' }} />
                <div className="study-header">
                    <h3>{post.title}</h3>
                    <p className="info">
                        <strong>작성자</strong> <span className="info-content">{post.writer}</span>
                        <span className="line">|</span>
                        <strong>조회수</strong> <span className="info-content">{post.views}</span>
                        <span className="line">|</span>
                        <strong>등록일</strong> <span className="info-content">{post.curDate}</span>
                        {
                            user.name === post.writer ?
                                <span className="control-part">
                                    <button className="control-btn" onClick={() => setIsUpdating(true)}>수정</button>
                                    <button className="control-btn" onClick={() => checkDelete()}>삭제</button>
                                </span>
                                :
                                null
                        }
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

                <div className="studyroom-join">
                    <img src='/img_notebook.png'></img>
                    <span className="room-title">
                        {post.roomTitle}
                        <span className="room-p">({post.joinP}명/{post.totalP}명)</span>
                    </span>{
                        (user.name === post.writer || user.id === null) ? null :
                            <Button
                                disabled={post.isApplied}
                                className="button"
                                variant='blue'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (post.joinP !== post.totalP)
                                        joinStudyRoom();
                                }}
                            >
                                {
                                    post.joinP === post.totalP ? "모집완료" :
                                        post.isApplied ? "참여완료" : "참여하기"
                                }
                            </Button>
                    }
                </div>

                <LikeAndComment id={id} liked={post.liked} likes={post.likes} reply={reply} type={'study'} /></div> :

                <div>
                    <div className='StudyCreate' style={{ textAlign: 'start', width: '100%' }}>
                        <h5>스터디 모집글 수정하기</h5>
                        <h3>{post.title}</h3>
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

export default StudyPost;