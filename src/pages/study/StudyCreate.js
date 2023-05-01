import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./study.css";
import "../../App.css";
import { Button } from "react-bootstrap";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

function StudyCreate() {
    const [postContent, setPostContent] = useState({
        title: '',
        content: ''
    })//제목과 내용이 담길 변수-> 백엔드에 전달해줘야함

    const [viewContent, setViewContent] = useState([]);//각각 적힌 내용들이 담길 배열



    const getValue = e => {
        const { name, value } = e.target;
        setPostContent({
            ...postContent,
            [name]: value
        })
        console.log(postContent);

    };


    return (
        <div className="StudyCreate">

            <h5 style={{ fontFamily: 'TmoneyRoundWind' }}>스터디 모집글 작성하기</h5>
            <div className='form-wrapper'>
                <input className="title-input" type='text' placeholder='제목' onChange={getValue} name='title' />
                <CKEditor
                    editor={ClassicEditor}
                    data=" "

                    onReady={editor => {

                        // console.log( 'Editor is ready to use!', editor );
                    }}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        console.log({ event, editor, data });
                        setPostContent({
                            ...postContent,
                            content: data
                        })
                        console.log(postContent);
                    }}
                // onBlur={ ( event, editor ) => {
                //     console.log( 'Blur.', editor );
                // } }
                // onFocus={ ( event, editor ) => {
                //     console.log( 'Focus.', editor );
                // } }
                />

                <Button className="submit-button" variant="blue" style={{ margin: "5px" }}
                    onClick={() => {
                        setViewContent(viewContent.concat({ ...postContent }));
                        console.log(viewContent);
                    }}
                >입력</Button>
            </div>


        </div>
    );
}


export default StudyCreate;