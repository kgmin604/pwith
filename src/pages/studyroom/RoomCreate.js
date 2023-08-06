import React from 'react';
import "./studyroom.css";
import { useState, useRef } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Select from 'react-select'
import axios from "axios";
import Cropper from "react-cropper";
import 'cropperjs/dist/cropper.css';

function RoomCreate(){
    let navigate = useNavigate();
    let [msg, setMsg] = useState('');
    let [userinput, setUserinput] = useState({
        'title': '',
        'category': -1,
        'totalP': -1,
    });

    let [isCrop, setIsCrop] = useState(false);
    const [inputImage, setInputImage] = useState(null); // 유저가 첨부한 이미지
    let [imgUrl, setImgUrl] = useState('https://pwith-bucket.s3.ap-northeast-2.amazonaws.com/studyroom/default_study_image_1.jpg');
    const cropperRef = useRef(null); // react-cropper 컴포넌트를 참조
    let [sel, setSel] = useState(1);

    let category=[
        {value:0, label:'웹개발'},
        {value:1, label:'모바일 앱 개발'},
        {value:2, label:'게임 개발'},  
        {value:3, label:'프로그래밍 언어'},
        {value:4, label:'알고리즘 · 자료구조'},
        {value:5, label:'데이터베이스'},
        {value:6, label:'자격증'},
        {value:7, label:'개발 도구'},
        {value:8, label:'데이터 사이언스'},
        {value:9, label:'데스크톱 앱 개발'},
        {value:10, label:'교양 · 기타'},
    ];

    const customStyles = {
        control: (provided) => ({
          ...provided,
          width: '400px',
        }),
    };

    function requestCreate() {
        if(sel===0){
            const imageElement = cropperRef?.current;
            const cropper = imageElement?.cropper;
            if(cropper){
                // 이미지를 Blob으로 변환
                cropper.getCroppedCanvas().toBlob((blob) => {
                    // Blob을 FormData로 감싸기
                    const formData = new FormData();
                    formData.append('image', blob, `${"d"}.jpg`);
                    formData.append('data', JSON.stringify({
                        'roomName': userinput.title,
                        'category': userinput.category,
                        'totalP': userinput.totalP
                    }));
              
                    // 서버로 업로드하기 위한 API 요청
                    axios({
                      method: "POST",
                      url: "/study-room",
                      data: formData, // FormData 전달
                    })
                    .then(function (response) {
                        alert("스터디룸이 개설되었습니다.");
                        navigate("../studyroom");
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
                  }, 'image/jpeg');
            }
        }
    }

    function checkCreate(event){
        event.stopPropagation();
        if(userinput['title']===''){
            setMsg('! 이름을 입력해주세요.');
        }
        else if(userinput['category']===-1){
            setMsg('! 카테고리를 선택해주세요.');
        }
        else if(userinput['totalP']===-1){
            setMsg('! 인원을 설정해주세요');
        }
        else if(!(2 <= Number(userinput['totalP']) && Number(userinput['totalP'])<=50)){
            setMsg('! 인원을 2명 이상 50명 이하로 설정해주세요');
        }
        else{
            setMsg('');
            requestCreate();
        }
    }

    function changeInput(e){
        let copyUserinput = {...userinput};
        copyUserinput[e.target.id] = e.target.value;
        setUserinput(copyUserinput);
    }

    const onCrop = () => {
        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        if (cropper) {
          setIsCrop(false);
          setImgUrl(cropper.getCroppedCanvas().toDataURL());
          setSel(0);
        }
    };

    function changeDefaultImage(num){
        let new_url = `https://pwith-bucket.s3.ap-northeast-2.amazonaws.com/studyroom/default_study_image_${num}.jpg`;
        setImgUrl(new_url);
    }

    return(
        <>
            <div className="create-wrap">
                <div className="title">
                    스터디룸 개설
                </div>
                <form method="POST">
                    <div className="item">
                        <p className="name">스터디 이름</p>
                        <input 
                            id = 'title'
                            className="input-area" 
                            placeholder='최대 20글자'
                            onChange={ e=>{ e.stopPropagation(); changeInput(e);} }
                        ></input>
                    </div>
                    <div className="item">
                        <p className="name">카테고리</p>
                        <Select styles={customStyles}
                            onChange={(e) => {
                                setUserinput({
                                    ...userinput,
                                    category: e.value
                                });
                            }}
                            placeholder = "-선택-"
                            options = { category }
                        />
                    </div>
                    <div className="item">
                        <p className="name">인원수</p>
                        <input
                            id = 'totalP'
                            className="input-area" 
                            placeholder='최대 50명'
                            type='number'
                            onChange={ e=>{e.stopPropagation(); changeInput(e);} }
                        ></input>
                    </div>
                    <div className="item">
                        <p className="name">스터디룸 이미지</p>
                        <div className="room-img">
                            <div className="img-area">
                                <img 
                                    className="main-img"
                                    src={imgUrl}
                                />
                                <div className="sub-img">
                                    <span> 기본 이미지</span>
                                    <img
                                        className={sel === 1 ? 'sel-img' : ''}
                                        src={'https://pwith-bucket.s3.ap-northeast-2.amazonaws.com/studyroom/default_study_image_1.jpg'}
                                        onClick={(e)=>{e.stopPropagation(); setSel(1); changeDefaultImage(1);}}
                                    />
                                    <img
                                        className={sel === 2 ? 'sel-img' : ''}
                                        src={'https://pwith-bucket.s3.ap-northeast-2.amazonaws.com/studyroom/default_study_image_2.jpg'}
                                        onClick={(e)=>{e.stopPropagation(); setSel(2); changeDefaultImage(2);}}
                                    />
                                    <img
                                        className={sel === 3 ? 'sel-img' : ''}
                                        src={'https://pwith-bucket.s3.ap-northeast-2.amazonaws.com/studyroom/default_study_image_3.jpg'}
                                        onClick={(e)=>{e.stopPropagation(); setSel(3); changeDefaultImage(3);}}
                                    />
                                </div>
                            </div>
                            <form>
                                    <label 
                                        htmlFor="imageUpload" 
                                        className='btn-area'
                                    >
                                        업로드
                                    </label>
                                    <input
                                        id="imageUpload"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            e.stopPropagation(); 
                                            setInputImage(URL.createObjectURL(e.target.files[0]));
                                            setIsCrop(true);
                                        }}
                                        onCancel={() => {
                                            // 파일 선택 취소 시 실행되는 함수
                                            setIsCrop(false);
                                        }}
                                        style={{'display':'none'}}
                                    />
                            </form>
                        </div>
                    </div>
                    <div className="create-btn" onClick={ (e)=>{e.stopPropagation(); checkCreate(e);} }>
                        만들기
                    </div>
                    <div className="message">{msg}</div>
                </form>
            </div>
            {
                !isCrop ? null :
                <>
                <div className="room-cropper-wrap"></div>
                <div className="room-cropper-area">
                    <h3> 스터디룸 이미지 업로드 
                        <span>(360x240 권장)</span>
                        <div className="x-btn" onClick={(e)=>{e.stopPropagation(); setIsCrop(false);}}>X</div>
                    </h3>
                            
                    <Cropper
                        ref={cropperRef}
                        style={{ height: 400, width: "100%"}}
                        zoomTo={0.5}
                        initialAspectRatio={1}
                        preview=".img-preview"
                        src={inputImage}
                        viewMode={1}
                        minCropBoxHeight={10}
                        minCropBoxWidth={10}
                        background={false}
                        responsive={true}
                        autoCropArea={1}
                        checkOrientation={false}
                        guides={true}
                        aspectRatio={360/240} 
                    />
                    <div className="btn-area">
                        <button
                            onClick={e=>{e.stopPropagation(); onCrop();}}
                            className="room-crop-btn"
                        >적용하기</button>
                    </div>
                </div>
                </>
            }
        </>
    );
}

export default RoomCreate;