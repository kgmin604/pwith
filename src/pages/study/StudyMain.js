import "bootstrap/dist/css/bootstrap.min.css";
import "./study.css";
import "../../App.css";
import { Form, Nav, Stack, Button, Table} from "react-bootstrap"; 
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import StudyCreate from "./StudyCreate.js";

function StudyMain(){
  let navigate = useNavigate();

    return(
        <div className="StudyMain">
        <div class="row">
  <div class="col-md-3">
  <Nav defaultActiveKey="/home" className="flex-column">
      <Nav.Link href="#">Active</Nav.Link>
      <Nav.Link eventKey="link-1">Link</Nav.Link>
      <Nav.Link eventKey="link-2">Link</Nav.Link>
    </Nav>
  </div>
  <div class="col-md-6">
  <Stack direction="horizontal" gap={3} style={{padding:"5px"}}>
      <Form.Control className="me-auto" placeholder="원하는 스터디를 찾아보세요!" />
      <Button variant="blue">🔍</Button>
      <Nav.Link onClick={() => navigate("./create")}>
        <Button variant="blue" style={{margin: "1em 1.5em"}}
            >글쓰기</Button>
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
        <tr>
          <td>1</td>
          <td colSpan={2}>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
          <td>@fat</td>
        </tr>
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