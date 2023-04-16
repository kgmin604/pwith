import './member.css';
import '../../App.css';
import {  useNavigate } from 'react-router-dom'; 

function Login(props){
    let navigate = useNavigate();
    return(
        <>
            <div className='round-box'>
                <div className="top-message">로그인</div>

                <form method='POST'>
                    <input className="box-design1" placeholder=" 아이디" name="userid"></input>
                    <input className="box-design1" placeholder=" 비밀번호" type='password' name="userpw"></input>
                    <div className="box-design2 mybtn" onClick={()=>{props.setUser('경민')}}>로그인</div>
                </form>
                
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