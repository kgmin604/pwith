import axios from "axios";
import { useState, useEffect } from "react";
import "./search.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";


function Search({ searchText }) {
    let navigate = useNavigate();

    const category = [ '스터디','QnA','도서','강의','멘토링' ];

    let tmp = {
        'id' : 1,
        'postId' : 15,
        'title' : '1일 3문제 백준 풀이 인증하는 스터디',
        'nickname': '열정걸'
    };
    let [searchType, setSearchType] = useState(0);
    let [searchList, setSearchList] = useState([]);
    const [totalPage, setTotalPage] = useState(1);
    const [selectPage, setSelectPage] = useState(1);
    const [pages, setPages] = useState([]);
    const [disabled1, setDisabled1] = useState(true);
    const [disabled2, setDisabled2] = useState(true);
    const [isLoad, setIsLoad] = useState(false);

    function firstRequestSearch(index){

        let str;
        if(index===0) str="study";
        else if(index===1) str="qna"
        else if(index===2) str="book"
        else if(index===3) str="lecture"
        else if(index===4) str="portfolio"

        axios({
            method: "GET",
            url: `/search`,
            params: {
                type: 0,
                value: searchText,
                page: 1,
                search: str,
            }
        })
        .then(function (response) {
            setTotalPage(response.data.data.totalPage);
            setSearchList(response.data.data.searchList);

            if (!isLoad) { // 맨 처음 한번만 실행
                if (response.data.data.totalPage > 5) {
                    const tmp = Array.from({ length: 5 }, (_, index) => index + 1);
                    setPages(tmp);
                    setDisabled2(false); // 페이지 이동 가능

                }
                else {
                    const tmp = Array.from({ length: response.data.data.totalPage }, (_, index) => index + 1);
                    setPages(tmp);
                }
                setIsLoad(true);
            }
        })
        .catch(function (e) {
            alert('요청에 실패했습니다. 다시 시도해주세요.');
        });
    }

    useEffect(()=>{
        firstRequestSearch(0);
    },[]);

    function controlPages(type) {
        if (type === -1) {
            const startPage = pages[0];
            const tmp = Array.from({ length: 5 }, (_, index) => startPage - 5 + index);
            setPages(tmp);
            setSelectPage(tmp[0]);
            setDisabled2(false); // > 클릭 가능

            if (startPage === 6) {
                setDisabled1(true); // < 클릭 불가
            }
        }
        else if (type === 1) {
            if (pages[4] + 5 <= totalPage) { // 페이지 5개 display 가능
                const tmp = Array.from({ length: 5 }, (_, index) => pages[index] + 5);
                setPages(tmp);
                setSelectPage(tmp[0]);
                if (pages[4] + 5 === totalPage) {
                    setDisabled2(true); // > 클릭 불가
                }
            }
            else {   // 페이지 5개 dispaly 불가능
                const num = totalPage - pages[4];
                const tmp = Array.from({ length: num }, (_, index) => pages[index] + 5);
                setPages(tmp);
                setSelectPage(tmp[0]);
                setDisabled2(true); // > 클릭 불가
            }
            setDisabled1(false); // < 클릭 가능
        }
    }

    function requestSearch(){
        let str;
        if(searchType===0) str="study";
        else if(searchType===1) str="qna"
        else if(searchType===2) str="book"
        else if(searchType===3) str="lecture"
        else if(searchType===4) str="portfolio"

        axios({
            method: "GET",
            url: `/search`,
            params: {
                type: 0,
                value: searchText,
                page: 1,
                search: str,
            }
        })
        .then(function (response) {
            setSearchList(response.data.data.searchList);
        })
        .catch(function (e) {
            alert('요청에 실패했습니다. 다시 시도해주세요.');
        });
    }

    return(
        <>
        <div class="row">
            <div class="col-md-3 search-category">
                <h5>검색 종류</h5>
                <hr style={{ width: '60%', margin: '0 auto' }} />
                {category.map((item, index) => (
                    <div 
                        key={index} 
                        style={{ color: '#282c34' }} 
                        className={`${searchType===index?'s-selected':''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setSearchType(index);
                            firstRequestSearch(index);
                        }}
                    >{item}</div>
                ))}
            </div>
            <div class="col-md-6">
                <div className="search-area">
                {
                    searchType === 3 || searchType === 4 ?
                    null
                    :
                    <>
                    {
                    searchList === null ? null :
                        <>
                            <div className="search-item" style={{ 'height': '40px' }}>
                                <strong className="search-id" style={{'textAlign':'center'}} >No.</strong>
                                <strong className="search-title" style={{'textAlign':'center'}}>제목</strong>
                                <strong className="search-nickname" style={{'textAlign':'center'}}>글쓴이</strong>
                            </div>
                            <hr style={{ 'width': '100%', "margin": '5px auto' }} />
                            {
                                searchList.length === 0 ? <div style={{ 'margin': '20px 0', 'textAlign':'center' }}>검색 결과가 없습니다.</div> :
                                    searchList.map((post, i) => {
                                        return (
                                            <div
                                                className="search-item hover-effect"
                                                key={i}
                                                onClick={(e) => { e.stopPropagation(); navigate(`../${post.studyId}`) }}
                                            >
                                                <span className=" search-id">{post.id}</span>
                                                <span className=" search-title">{post.title}</span>
                                                <span className=" search-nickname">{post.nickname}</span>
                                            </div>
                                        );
                                    })}
                            <hr style={{ 'width': '100%', "margin": '5px auto' }} />
                        </>
                    }
                    </>
                }
                </div>

                <div className='pagination'>
                <span className="pages">
                    <button disabled={disabled1} className="control-page" onClick={(e) => { e.stopPropagation(); controlPages(-1); }}>
                        {'<'}
                    </button>
                    {
                        pages.map((page, i) => {
                            return (
                                <span
                                    key={i}
                                    className={`page${selectPage === page ? ' selected' : ' non-selected'}`}
                                    onClick={(e) => { e.stopPropagation(); setSelectPage(page); }}
                                >
                                    {page}
                                </span>
                            );
                        })
                    }
                    <button disabled={disabled2} className="control-page" onClick={(e) => { e.stopPropagation(); controlPages(1); }}>
                        {'>'}
                    </button>
                </span>
            </div>

            </div>
        </div>
        </>
    );
}


export default Search;