import axios from "axios";
import { useState, useEffect } from "react";
import "./search.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";


function Search({ searchText }) {
    let navigate = useNavigate();
    const location = useLocation();

    const category = [ '스터디','QnA','도서','강의','멘토링' ];
    const [nameType, setNameType] = useState('');

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
    // const [isLoad, setIsLoad] = useState(false);

    function firstRequestSearch(index, isLoad){

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
            console.log(str);
            console.log(response.data);

            setTotalPage(response.data.data.totalPage);
            setSearchList(response.data.data.searchList);

            if (!isLoad) { // 맨 처음 한번만 실행
                if (response.data.data.totalPage > 5) {
                    const tmp = Array.from({ length: 5 }, (_, index) => index + 1);
                    setPages(tmp);
                    setDisabled2(false); // > 가능
                    setDisabled1(true); // < 불가
                }
                else {
                    const tmp = Array.from({ length: response.data.data.totalPage }, (_, index) => index + 1);
                    setDisabled2(true); // > 불가
                    setDisabled1(true); // < 불가
                    setPages(tmp);
                }
                //setIsLoad(true);
            }
        })
        .catch(function (e) {
            alert('요청에 실패했습니다. 다시 시도해주세요.');
        });
    }

    useEffect(()=>{
        setSearchType (0);
        firstRequestSearch(0, false);
    },[location]); // url이 바뀔때마다 재검색!

    function controlPages(type) {
        if (type === -1) {
            const startPage = pages[0];
            const tmp = Array.from({ length: 5 }, (_, index) => startPage - 5 + index);
            setPages(tmp);
            setSelectPage(tmp[0]);
            requestSearch(tmp[0]); // 검색
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
                requestSearch(tmp[0]); // 검색 요청
            }
            else {   // 페이지 5개 dispaly 불가능
                const num = totalPage - pages[4];
                const tmp = Array.from({ length: num }, (_, index) => pages[index] + 5);
                setPages(tmp);
                setSelectPage(tmp[0]);
                setDisabled2(true); // > 클릭 불가
                requestSearch(tmp[0]); // 검색 요청
            }
            setDisabled1(false); // < 클릭 가능
            
        }
    }

    function requestSearch(page){
        setSearchList([]);

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
                page: page,
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

    function changeUrl(data){
        let url = "";
        if(searchType===0) url=`../study/${data}`
        else if(searchType===1) url=`../community/qna/${data}`
        else if(searchType===2) url=data;
        else if(searchType===3) url=data;
        else if(searchType===4) url=`../mentoring/${data}`

        if(searchType===2 || searchType===3)  window.open(`${data}`, '_blank');
        else navigate(url);
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
                            setSearchList([]);
                            setSearchType(index);
                            setSelectPage(1);
                            if(index===2) setNameType('저자')
                            else if(index===3) setNameType('강사')
                            firstRequestSearch(index,false);
                        }}
                    >{item}</div>
                ))}
            </div>
            <div class="col-md-6">
                <div className="search-area">
                {
                    searchType === 2 || searchType === 3 ?
                    <>
                    {
                    searchList === null ? null :
                        <>
                            <div className="search-item" style={{ 'height': '40px' }}>
                                <strong className="search-id" >No.</strong>
                                <strong className="search-title" >제목</strong>
                                <strong className="search-nickname" >{nameType}</strong>
                            </div>
                            <hr style={{ 'width': '100%', "margin": '5px auto' }} />
                            {
                                searchList.length === 0 ? <div style={{ 'margin': '20px 0', 'textAlign':'center' }}>검색 결과가 없습니다.</div> :
                                    searchList.map((post, i) => {
                                        return (
                                            <div
                                                className="search-item hover-effect"
                                                key={i}
                                                onClick={(e) => { 
                                                    e.stopPropagation(); 
                                                    changeUrl(post.link);
                                                }}
                                            >
                                                <span className=" search-id">{post.id}</span>
                                                <span className=" search-title">{post.title}</span>
                                                <span className=" search-nickname">{post.instructor}</span>
                                            </div>
                                        );
                                    })}
                            <hr style={{ 'width': '100%', "margin": '5px auto' }} />
                        </>
                    }
                    </>
                    :
                    <>
                    {
                    searchList === null ? null :
                        <>
                            <div className="search-item" style={{ 'height': '40px' }}>
                                <strong className="search-id" >No.</strong>
                                <strong className="search-title" >제목</strong>
                                <strong className="search-nickname" >글쓴이</strong>
                            </div>
                            <hr style={{ 'width': '100%', "margin": '5px auto' }} />
                            {
                                searchList.length === 0 ? <div style={{ 'margin': '20px 0', 'textAlign':'center' }}>검색 결과가 없습니다.</div> :
                                    searchList.map((post, i) => {
                                        return (
                                            <div
                                                className="search-item hover-effect"
                                                key={i}
                                                onClick={(e) => { 
                                                    e.stopPropagation();
                                                    changeUrl(post.postId);
                                            }}
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
                {
                    searchList.length !== 0 ?
                    <>
                    <button disabled={disabled1} className="control-page-btn" onClick={(e) => { e.stopPropagation(); controlPages(-1); }}>
                        {'<'}
                    </button>
                    {
                        pages.map((page, i) => {
                            return (
                                <span
                                    key={i}
                                    className={`page${selectPage === page ? ' selected' : ' non-selected'}`}
                                    onClick={(e) => { 
                                        e.stopPropagation(); 
                                        setSelectPage(page); 
                                        requestSearch(page);
                                    }}
                                >
                                    {page}
                                </span>
                            );
                        })
                    }
                    <button disabled={disabled2} className="control-page-btn" onClick={(e) => { e.stopPropagation(); controlPages(1); }}>
                        {'>'}
                    </button>
                    </>
                    :null
                }
                </span>
            </div>

            </div>
        </div>
        </>
    );
}


export default Search;