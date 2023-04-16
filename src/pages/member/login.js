import './member.css';
import '../../App.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom'; 

function Login(props){
    
    let navigate = useNavigate();

    function postLogin() {
        let id = document.getElementById("memberId").value;
        let pw = document.getElementById("memberPw").value;
    
        axios({
          method: "POST",
          url: "/login",
          data: {
            memberId: `${id}`,
            memberPw: `${pw}`
          },
        })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
      }

    return(
        <>
            <div className='round-box'>
                <div className="top-message">로그인</div>

                <form method='POST'>
                    <input className="box-design1" placeholder=" 아이디" id="memberId"></input>
                    <input className="box-design1" placeholder=" 비밀번호" type='password' id="memberPw"></input>
                </form>
                
                {/* <div className="box-design2 mybtn" onClick={ ()=>{postLogin(); props.setUser('경민');} }>로그인</div> */}
                <div className="box-design2 mybtn" onClick={() => {props.setUser(postLogin)}}>로그인</div>
                {/* '경민' 자리에 member의 이름이 들어가면 될까? 저 값은 어디서 확인 가능? */}
                

                <div style={{'width':'300px','height':'30px', 'margin':'0 auto','margin-top':'20px'}}>
                    <div 
                        className='mybtn'
                        onClick = {()=>navigate('../help')}
                        style={{'float':'right','margin':'5px','fontSize':'7px' }}
                        
                    >비밀번호 찾기</div>
                    <div style={{'float':'right','margin':'5px','fontSize':'8px'}}>|</div>
                    <div 
                        className='mybtn' 
                        onClick = {()=>navigate('../join')}
                        style={{'float':'right','margin':'5px','fontSize':'7px'}}
                    >회원가입</div>
                </div>
                
            </div>
        </>
    );
}


export default Login;
