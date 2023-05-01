import "bootstrap/dist/css/bootstrap.min.css";
import "./study.css";
import "../../App.css";
import { Form, Nav, Stack, Button, Table } from "react-bootstrap";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

function StudyMain() {
  let navigate = useNavigate();

  return (
    <div className="StudyMain">
      <div class="row">
        <div class="col-md-3">
          <h5>분야별 스터디 보기</h5>
          <hr style={{ width: '60%', margin: '0 auto' }} />
          <Nav defaultActiveKey="/home" className="flex-column">
            <Nav.Link href="#"><div style={{ color: '#282c34' }}>프론트엔드</div></Nav.Link>
            <Nav.Link eventKey="link-1"><div style={{ color: '#282c34' }}>백엔드</div></Nav.Link>
            <Nav.Link eventKey="link-2"><div style={{ color: '#282c34' }}>인공지능</div></Nav.Link>
            <Nav.Link eventKey="link-2"><div style={{ color: '#282c34' }}>컴퓨터사이언스</div></Nav.Link>
          </Nav>
        </div>
        
        <div class="col-md-6">
          <Stack direction="horizontal" gap={3} style={{ padding: "5px" }}>
            <Form.Control className="me-auto" placeholder="원하는 스터디를 찾아보세요!" />
            <Button variant="blue">🔍</Button>
            <div className="vr" />
            <Nav.Link onClick={() => navigate("./create")}>
              <Button variant="blue"
              >New</Button>
            </Nav.Link>
          </Stack>

          <Table bordered hover>
            <thead>
              <tr>
                <th>no.</th>
                <th colSpan={2}>글제목</th>
                <th>조회수</th>
                <th>날짜</th>
                <th>인원</th>
              </tr>
            </thead>
            <tbody>
              {/* <tr>
          <td>1</td>
          <td colSpan={2}>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
          <td>@fat</td>
        </tr> */}

        //컴포넌트로 묶어야할 듯
              <tr>
                <td>2</td>
                <td colSpan={2}>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
                <td>@fat</td>
              </tr>
              <tr>
                <td>3</td>
                <td colSpan={2}>Larry the Bird</td>
                <td>@twitter</td>
                <td>@fat</td>
                <td>@fat</td>
              </tr>
            </tbody>
          </Table>
        </div>
        <div class="col-md-3">추천스터디</div>
      </div>


    </div>

  );
}


export default StudyMain;