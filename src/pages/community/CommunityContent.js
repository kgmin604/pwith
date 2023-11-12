import "bootstrap/dist/css/bootstrap.min.css";
import "./community-content.css";
import "../../App.css";
import React, { useState, useEffect } from 'react';
import { Nav } from "react-bootstrap";
import axios from "axios";
import { setBookCategory,setLectureCategory } from "../../store";
import { useDispatch,useSelector } from "react-redux";


function CommunityContent() {
    let [type, setType] = useState('책'); // 책 또는 강의
    const lectureCategory = useSelector((state) => state.lectureCategory);
    const bookCategory = useSelector((state) => state.bookCategory);
    const [selectBookPage, setSelectBookPage] = useState(1);
    const [selectLecturePage, setSelectLecturePage] = useState(1);
    const [bookIsNext, setBookIsNext] = useState(true)
    const [lectureIsNext, setLectureIsNext] = useState(true)

    const [bookList, setBookList] = useState([])
    const [lectureList, setLectureList] = useState([])

    useEffect(() => {
        axios({
            method: "GET",
            url: "/community/contents/book",
            params: {
                page: selectBookPage,
                firstCategory:bookCategory.firstCategory,
                secondCategory:bookCategory.secondCategory
            }
        })
            .then(function (response) {
                const data = response.data.data
                setBookList((prev) => [...prev, ...data.book])
                setBookIsNext(data.isNext)
            })
            .catch(function (error) {
            });
    }, [selectBookPage]);

    useEffect(() => {
        axios({
            method: "GET",
            url: "/community/contents/book",
            params: {
                page: 1,
                firstCategory:bookCategory.firstCategory,
                secondCategory:bookCategory.secondCategory
            }
        })
            .then(function (response) {
                const data = response.data.data
                setBookList(data.book)
                setBookIsNext(data.isNext)
            })
            .catch(function (error) {
            });
    }, [bookCategory]);
    useEffect(() => {
        axios({
            method: "GET",
            url: "/community/contents/lecture",
            params: {
                page: selectLecturePage,
                firstCategory:lectureCategory.firstCategory,
                secondCategory:lectureCategory.secondCategory
            }
        })
            .then(function (response) {
                const data = response.data.data
                setLectureList((prev) => [...prev, ...data.lecture])
                setLectureIsNext(data.isNext)
            })
            .catch(function (error) {
            });
    }, [selectLecturePage]);

    useEffect(() => {
        axios({
            method: "GET",
            url: "/community/contents/lecture",
            params: {
                page: 1,
                firstCategory:lectureCategory.firstCategory,
                secondCategory:lectureCategory.secondCategory
            }
        })
            .then(function (response) {
                const data = response.data.data
                setLectureList(data.lecture)
                setLectureIsNext(data.isNext)
            })
            .catch(function (error) {
            });
    }, [lectureCategory]);

    const moreBook = () => {
        setSelectBookPage(selectBookPage + 1)
    }
    const moreLecture = () => {
        setSelectLecturePage(selectLecturePage + 1)

    }
    return (
        <>
            <div class="row">
                <div class="col-md-3 category-area">
                    <Category type={type} />
                </div>
                <div class="col-md-9 content-area">
                    <div className="header">
                        <h3
                            className={type === '책' ? "selected" : "non-selected"}
                            onClick={(e) => { e.stopPropagation(); setType('책'); }}
                        >책</h3>
                        <h3>|</h3>
                        <h3
                            className={type === '강의' ? "selected" : "non-selected"}
                            onClick={(e) => { e.stopPropagation(); setType('강의'); }}
                        >인터넷 강의</h3>
                    </div>
                    <div className="body">
                        <div className="items">
                            {
                                type === '책' && <div><div>{bookList.map((item, i) => (
                                    <div
                                        key={i}
                                        className="content-card"
                                        onClick={(e) => { e.stopPropagation(); window.open(item.link, '_blank') }}
                                    >
                                        <img src={item.image} />
                                        <h5>{item.title}</h5>
                                        <div className="tags">
                                            {<span
                                                className="tag"
                                            >{item.second_category}</span>
                                            }
                                        </div>

                                    </div>
                                ))}</div>
                                    {bookIsNext && <div className="more-button" onClick={moreBook}>더보기</div>}
                                </div>

                            }

                            {type === '강의' && <div><div>{lectureList.map((item, i) => (
                                <div
                                    key={i}
                                    className="content-card"
                                    onClick={(e) => { e.stopPropagation(); window.open(item.link, '_blank') }}
                                >
                                    <img src={item.image} />
                                    <h5>{item.title}</h5>
                                    <div className="tags">
                                        {<span
                                            className="tag"
                                        >{item.second_category}</span>
                                        }
                                    </div>
                                </div>
                            ))}
                            </div>
                                {lectureIsNext && <div className="more-button" onClick={moreLecture}>더보기</div>}
                            </div>}
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

const lectureCategory = [
    {
        firstCategory: '개발/프로그래밍',
        secondCategory: [
            '웹개발',
            '프론트엔드',
            '백엔드',
            '풀스택',
            '모바일 앱 개발',
            '게임 개발',
            '프로그래밍 언어',
            '알고리즘/자료구조',
            '데이터베이스',
            '데브옵스/인프라',
            '자격증',
            '개발 도구',
            '데이터 사이언스',
            '데스크톱 앱 개발',
            '교양 기타']
    },
    {
        firstCategory: '보안/네트워크',
        secondCategory: [
            '보안',
            '네트워크',
            '시스템',
            '클라우드',
            '블록체인',
            '자격증',
            '기타'
        ]

    },
    {
        firstCategory: '데이터 사이언스',
        secondCategory: [
            '데이터 분석',
            '인공지능',
            '데이터 시각화',
            '데이터 수집/처리',
            '기타'
        ]
    },
    {
        firstCategory: '게임 개발',
        secondCategory: [
            '게임 프로그래밍',
            '게임 기획',
            '게임 아트/그래픽',
            '기타'
        ]
    },
    {
        firstCategory: '하드웨어',
        secondCategory: [
            '컴퓨터 구조',
            '임베디드/IoT',
            '반도체',
            '로봇공학',
            '모빌리티',
            '자격증',
            '기타'
        ]
    }
]

const bookCategory = [
    {
        firstCategory: '게임',
        secondCategory: [
            '게임 개발',
            '게임 기획',
            '모바일 게임'
        ]
    },
    {
        firstCategory: '네트워크/해킹/보안',
        secondCategory: [
            '네트워크 일반',
            'TCP/IP',
            '보안/해킹'
        ]
    },
    {
        firstCategory: '모바일 프로그래밍',
        secondCategory: [
            '아이폰',
            '안드로이드폰',
            '윈도우폰',
            '모바일 게임'
        ]
    },
    {
        firstCategory: '웹사이트',
        secondCategory: [
            'HTML/JavaScript/CSS',
            '웹디자인',
            '웹기획',
            'UI/UX'
        ]
    },
    {
        firstCategory: '컴퓨터공학',
        secondCategory: [
            '컴퓨터 교육',
            '네트워크/데이터 통신',
            '마이크로 프로세서',
            '자료구조/알고리즘',
            '전산수학',
            '정보통신 공학',
            '컴퓨터구조 일반',
            '운영체제 일반',
            '데이터베이스 일반'
        ]
    },
    {
        firstCategory: 'OS/데이터베이스',
        secondCategory: [
            '클라우드/빅데이터',
            '프로그래밍 교육',
            '리눅스',
            'Oracle',
            '시스템관리/서버',
            '윈도우',
            'SQL Server',
            'MAC OS',
            '유닉스',
            'Access',
            'MySQL'
        ]
    },
    {
        firstCategory: '프로그래밍 언어',
        secondCategory: [
            '자바',
            '프로그래밍 교육',
            'ASP',
            'Visual Basic',
            'C',
            'C#',
            'JSP',
            'Visual C++',
            'C++',
            '.NET',
            'Perl',
            'XML',
            'JavaScript/CGI',
            '델파이',
            'PHP',
            '파이썬',
            'Ajax',
            'Ruby/Rails',
            '프로그래밍 언어 기타'
        ]
    }
];

function Category({ type }) {//카테고리
    return (
        <>
            <h5>학습 콘텐츠</h5>
            <hr style={{ width: '60%', margin: '0 auto' }} />
            {type === '강의' ? <Nav defaultActiveKey="#" className="flex-column">
                {lectureCategory.map((category, index) => {
                    return <SecondCategory type={'lecture'} category={category} index={index} />
                    // return 
                })}
            </Nav> : <Nav defaultActiveKey="#" className="flex-column">
                {bookCategory.map((category, index) => {
                    return <SecondCategory type={'book'} category={category} index={index} />
                })}
            </Nav>}
        </>
    );
}

function SecondCategory({ type, category, index }) {
    const [showSecondCategory, setShowSecondCategory] = useState(false)
    const dispatch = useDispatch();
    const clickedStyle = {
        color: '#282c34',
        fontWeight: 700
    }
    const defaultStyle = {
        color: '#282c34',
    }

    const onClickCategory = (secondCategory) => {
        if (type === 'lecture') {
            dispatch(setLectureCategory({ firstCategory: index, secondCategory: secondCategory }));
        } else {
            dispatch(setBookCategory({ firstCategory: index, secondCategory: secondCategory }));
        }

    }
    return <>
        <Nav.Link href="#" onClick={() => {
            onClickCategory(null)
            setShowSecondCategory((prev) => !prev)
        }}><div style={showSecondCategory ? clickedStyle : defaultStyle}>{category.firstCategory}</div></Nav.Link>
        {showSecondCategory && category.secondCategory.map((category, secondIndex) => {
            return <div onClick={() => {
                onClickCategory(secondIndex)
            }} className="second-category">{category}</div>
        })
        }
    </>
}

export default CommunityContent;