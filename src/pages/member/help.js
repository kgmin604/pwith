import "./help.css";
import { useState } from "react";
import axios from "axios";
import { renderHook } from "@testing-library/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

function HelpId(){

    let [email, setEmail] = useState('');
    let [auth, setAuth] = useState('');
    let [userAuth, setUserAuth] = useState('');
    let [userId, setUserId] = useState('');
    let [authFlag, setAuthFlag] = useState(false);
    
    let navigate = useNavigate();
    
    function changeInput(e){
        e.stopPropagation();
        if(e.target.id==="id-email"){
            setEmail(e.target.value);
        }
        else if(e.target.id==="id-auth"){
            setAuth(e.target.value);
        }
    }

    function sendAuth(){
        const emailRE = /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        if(!emailRE.test(email)){
            alert("올바른 이메일 주소를 입력해주세요.");
            return;
        }

        axios({
            method: "POST",
            url: "/member/id",
            data: {
                email: `${email}`
            },
        })
        .then(function (response) {
            setUserAuth(response.data.data.auth);
            setUserId(response.data.data.memId);
            alert("이메일로 전송된 인증번호를 확인해주세요.");
        })
        .catch(function (error) {
            if(error.response.data.status===400){
                alert("존재하지 않는 이메일입니다.");
            }
        });
    }

    function CheckAuth(){
        if(auth===userAuth){
            setAuthFlag(true);
        }
        else{
            alert("잘못된 인증번호입니다.");
        }
    }

    return(
        <>
        <div className="help-top">
            <div className="help-title">
                아이디 찾기
            </div>
            <p className="help-text">
                회원 가입 시 사용한 이메일 주소를 통해 아이디를 찾을 수 있습니다.
            </p>
        </div>
        <hr style={{"marginBottom":"40px"}}></hr>
        {
            !authFlag ?
            <div className="help-input">
                <form>
                    <div className="items">
                        <div className="item">
                            <h4>이메일 주소</h4>
                            <input id="id-email" onChange={e=>changeInput(e)}></input>
                            <div onClick={(e)=>{e.stopPropagation(); sendAuth();}}>인증하기</div>
                        </div>
                        <div className="item">
                            <h4>인증번호</h4>
                            <input id="id-auth" onChange={e=>changeInput(e)}></input>
                        </div>
                    </div>
                </form>
            </div>
            :
            <div className="help-id">
                해당 이메일로 가입하신 아이디는 <br></br>
                <strong>{userId}</strong>입니다.
            </div>
        }
        <hr style={{"margin-top":"40px"}}></hr>
        {
            !authFlag ?
            <div className="help-btn"onClick={(e)=>{e.stopPropagation(); CheckAuth();}}>아이디 찾기</div>
            :
            <div className="help-btn" onClick={(e)=>{e.stopPropagation(); navigate('./../login');}}>로그인 하기</div>

        }
        </>
    );
}

function HelpPw(){

    let [id, setId] = useState('');
    let [email, setEmail] = useState('');

    function changeInput(e){
        e.stopPropagation();
        if(e.target.id==="pw-id"){
            setId(e.target.value);
        }
        else if(e.target.id==="pw-email"){
            setEmail(e.target.value);
        }
    }

    function requestChange(){
        axios({
            method: "POST",
            url: "/member/password",
            data:{
                memId: id,
                email: email
            }
        })
        .then(function(response){
            alert("이메일로 전송된 링크를 통해 비밀번호를 재전송해주세요.");
        })
        .catch(function(error){
            if(error.response.data.status===404){
                alert("존재하지 않는 아이디입니다.");
            }
            else if(error.response.data.status===400){
                alert("등록된 이메일 주소가 아닙니다.");
            }
        })
    }

    return(
        <>
        <div className="help-top">
            <div className="help-title">
                비밀번호 찾기
            </div>
            <p className="help-text">
                회원 가입 시 사용한 이메일 주소를 통해 비밀번호를 재설정 할 수 있습니다.
            </p>
        </div>
        <hr style={{"marginBottom":"40px"}}></hr>
        <div className="help-input">
            <form>
                <div className="items">
                    <div className="item">
                        <h4>아이디</h4>
                        <input id="pw-id" onChange={(e)=>changeInput(e)}></input>
                    </div>
                    <div className="item">
                        <h4>이메일 주소</h4>
                        <input id="pw-email" onChange={(e)=>changeInput(e)}></input>
                    </div>
                </div>
            </form>
        </div>
        <hr style={{"margin-top":"40px"}}></hr>
        <div className="help-btn" onClick={(e)=>{e.stopPropagation(); requestChange(); }}>비밀번호 찾기</div>
        </>
    );
}

function ResetPw(){

    let navigate = useNavigate();

    let [newpw, setNewpw] = useState('');
    let [pwchk, setPwchk] = useState('')
    const location = useLocation();
    const currentPath = location.pathname;
    const randStr = currentPath.split('/').pop(); // 랜덤 문자열 추출

    useEffect(()=>{
        axios({
            method: "GET",
            url: `/member/password/${randStr}`,
            data:{
                password: newpw
            }
        })
        .then(function(response){
            if(response.data.status===200){
                return;
            }
        })
        .catch(function(error){
            if(error.response.data.status===400){
                alert("유효하지 않은 페이지입니다.");
                navigate("/");
            }
        })
    },[]);

    function changeInput(e){
        e.stopPropagation();
        if(e.target.id=="pw-pw"){
            setNewpw(e.target.value);
        }
        else if(e.target.id=="pw-pwchk"){
            setPwchk(e.target.value);
        }
    }
    
    function ResetPassword(){
        const pwRE = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
        if(!pwRE.test(newpw)){
            alert('조건에 맞는 비밀번호를 입력해주세요.');
            return;
        }

        if(newpw!==pwchk){
            alert('비밀번호와 비밀번호 확인 창에 입력한 값이 다릅니다.');
            return;
        }

        axios({
            method: "PATCH",
            url: `/member/password/${randStr}`,
            data:{
                password: newpw
            }
        })
        .then(function(response){
            alert("비밀번호가 재설정 되었습니다.");
            navigate("/member/login");
        })
        .catch(function(error){
            console.log(error);
        })
    }

    return(
    <>
        <div className="help-top">
            <div className="help-title">
                비밀번호 재설정
            </div>
            <p className="help-text">
                새롭게 사용할 비밀번호를 입력해주세요. <br></br>
                하나 이상의 문자,숫자,특수문자를 포함한 8자리 이상의 비밀번호를 사용해주세요.
            </p>
        </div>
        <hr style={{"marginBottom":"40px"}}></hr>
        <div className="help-input">
            <form>
                <div className="items">
                    <div className="item">
                        <h4>비밀번호</h4>
                        <input id="pw-pw" type="password" onChange={(e)=>changeInput(e)}></input>
                    </div>
                    <div className="item">
                        <h4>비밀번호 확인</h4>
                        <input id="pw-pwchk" type="password" onChange={(e)=>changeInput(e)}></input>
                    </div>
                </div>
            </form>
        </div>
        <hr style={{"margin-top":"40px"}}></hr>
        <div 
            className="help-btn" 
            onClick={(e)=>{e.stopPropagation(); ResetPassword(); }}
        >비밀번호 변경</div>
    </>
    );
}


export{ HelpId, HelpPw, ResetPw }