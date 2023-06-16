import "bootstrap/dist/css/bootstrap.min.css";
import "../../App.css";
import "./mentoring.css";
import { Form, Nav, Stack, Button, Card, Row, Col } from "react-bootstrap";


function MentoringMain() {
    const data = [1, 2, 3, 4, 5, 6];

    return (
        <div className="MentoringMain">
            <div class="row">
                <div class="col-md-3">
                    {Category()}
                </div>

                <div class="col-md-8">
                    <Stack direction="horizontal" gap={3} style={{ padding: "5px" }}>
                        <Form.Control className="me-auto" placeholder="원하는 멘토를 찾아보세요!" />
                        <Button variant="blue">🔍</Button>
                    </Stack>

                    <Row className="row-cols-1 row-cols-md-4 g-2" style={{padding:'10px'}}>
                        {data.map((k, i) => (
                            <Col key={i} xs={12} sm={6} md={4} className="mb-2">
                                <Card style={{ width: '15rem', height:'20rem' }}>
                                    <Card.Img variant="top" src="https://cdn.inflearn.com/public/courses/325630/cover/56f635a3-3a44-4096-a16b-453ea1696b1a/325630-eng.png" />
                                    <Card.Body>
                                        <Card.Title>멘토</Card.Title>
                                        <Card.Text>전문가임</Card.Text>
                                        <Button variant="blue">상세정보</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>






                </div>

                <div class="col-md-3"></div>
            </div>


        </div>
    );
}

function Category() {//카테고리
    return <>

        <h5>Mentoring</h5>
        <hr style={{ width: '60%', margin: '0 auto' }} />
        <Nav defaultActiveKey="#" className="flex-column">
            <Nav.Link href="#"><div style={{ color: '#282c34' }}>멘토링</div></Nav.Link>
            <Nav.Link href="./create"><div style={{ color: '#282c34' }}>포트폴리오 업로드</div></Nav.Link>
        </Nav>
    </>

}


export default MentoringMain;