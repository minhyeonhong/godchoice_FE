import React, { useEffect, useRef, useState } from 'react';
import Comment from '../common/Comment';
import KakaoMap from '../common/KakaoMap';
import Carousel from 'react-bootstrap/Carousel';
import {
    StWrap,
    StTitleBox,
    StImgBox,
    StContentBox,
    StEventLinkBox,
    StEventPlaceBox,
    StButtonBox
} from '../styles/Detail.styled'
import { ModalWrap, AllInput, AllTextarea } from '../styles/GatherDetail.styled'
import noImg from '../../assets/images/common/noImg.jpg'
import { useDispatch } from 'react-redux';
import SearchAddress from '../post/SearchAddress';
import useImgUpload from "../../hooks/useImgUpload";
import styled from 'styled-components';
import { __putPost, __deletePost } from '../../redux/modules/postSlice3';
import Views from '../../assets/icon/Views.svg'
// 스크랩
import { __postScrap } from '../../redux/modules/postSlice';
import PostScrap from './PostScrap';

const Ask = ({ post, postId, modPost, setmodPost, modPostHandle }) => {

    const dispatch = useDispatch();

    //수정하기
    const [edit, setEdit] = useState(false);
    const toggleEdit = () => { setEdit(!edit); };


    //이미지 업로드 훅
    const [files, fileUrls, uploadHandle] = useImgUpload(5, true, 0.5, 1000);
    //기존 프리뷰 지울 state
    const [delImg, setDelImg] = useState([]);

    //이미지 업로드 인풋돔 선택 훅
    const imgRef = useRef();

    //submit
    const onSubmitAsk = () => {

        const formData = new FormData();

        if (files.length > 0) {
            files.forEach((file) => {
                formData.append("multipartFile", file);
            })
        } else {
            formData.append("multipartFile", null);
        }

        const detail = modPost.detailAddress === undefined ? "" : modPost.detailAddress


        const obj = {
            imgId: delImg.join(),
            title: modPost.title,
            content: modPost.content,
            postLink: modPost.postLink,
            postAddress: modPost.postAddress + detail
        }

        console.log("obj", obj);
        //폼 데이터에 글작성 데이터 넣기
        formData.append("askPostPutRequestDto", new Blob([JSON.stringify(obj)], { type: "application/json" }));

        //Api 날리기
        dispatch(__putPost({ postId, content: formData }));
    }

    //슬라이드 자동으로 넘기는 부분
    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    //기존글의 삭제할 이미지
    const delImgHandle = (imageId) => {
        setDelImg((e) => [...e, imageId]);
    }

    // 주소 API 팝업창 상태 관리& useState
    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const popupPostCode = () => { setIsPopupOpen(!isPopupOpen) }
    const [postAddress, setPostAddress] = useState(post.postAddress)

    useEffect(() => {
        if (postAddress !== "") {
            setmodPost({ ...modPost, postAddress })
        }
    }, [postAddress])

    const onAskDelete = (postId) => {
        dispatch(__deletePost(postId))
    }

    return (
        Object.keys(post).length < 1 ?
            <div>페이지 정보 없음</div>
            :
            <StWrap>
                {edit ? (

                    <div>
                        <StTitleBox>
                            <AllInput type="text" placeholder="제목" name="title" defaultValue={modPost.title || ""} onChange={modPostHandle} style={{ width: "100%" }} />
                        </StTitleBox>
                        <div><br />

                            {/*이미지 올리기*/}
                            <StCarouselWrap>
                                <Carousel activeIndex={index} onSelect={handleSelect}>
                                    {modPost.askPostImgList.map((img, i) => {
                                        return (
                                            <Carousel.Item key={img.id}>
                                                <img style={{ height: "180px" }}
                                                    className="d-block w-100"
                                                    src={img.postImgUrl}
                                                    alt={`slide${i + 1}`}
                                                />
                                            </Carousel.Item>
                                        )
                                    })}
                                </Carousel>

                                {modPost.askPostImgList.map((img, i) => {
                                    return (
                                        img.postImgId &&
                                        // <button style={{ width: '60px', height: '60px', backgroundImage: `url(${imgInfo.postImgUrl})` }} ></button>
                                        <button style={{ display: delImg.indexOf(img.postImgId) > -1 ? "none" : "inline-block" }}
                                            onClick={() => delImgHandle(img.postImgId)} key={img.postImgId}>
                                            <img style={{ width: '60px', height: '60px' }} src={img.postImgUrl} />
                                        </button>
                                    )
                                })}

                                <STUploadButton onClick={() => { imgRef.current.click() }}>+</STUploadButton>

                                <label htmlFor="imgFile">
                                    <input
                                        style={{ display: "none" }}
                                        type="file"
                                        id="imgFile"
                                        onChange={uploadHandle}
                                        accept="image/*"
                                        ref={imgRef}
                                        name="imgFile"
                                        multiple />
                                </label>

                                <div>
                                    {
                                        fileUrls.map((imgUrl, i) => {
                                            return (
                                                <img style={{ width: '60px', height: '60px' }} src={imgUrl} key={i} />
                                            )
                                        })
                                    }
                                </div>
                            </StCarouselWrap>

                        </div>
                        <StContentBox>
                            <AllTextarea type="text" name="content" defaultValue={modPost.content || ""} onChange={modPostHandle} />
                        </StContentBox>

                        <StEventLinkBox>
                            <br /><label>행사장 링크</label><br />
                            <AllInput type="text" name="postLink" defaultValue={modPost.postLink} onChange={modPostHandle} style={{ width: "100%" }} />
                        </StEventLinkBox><br />

                        <div>
                            <StEventPlaceBox>
                                <div>행사장소<button onClick={popupPostCode}> 주소 검색하기</button></div>
                                {isPopupOpen && (
                                    <ModalWrap>
                                        <SearchAddress setPostAddres={setPostAddress} popupPostCode={popupPostCode} />
                                    </ModalWrap>
                                )}
                                <div className='address-box'>
                                    <div className='tag'>#{modPost.postAddress && modPost.postAddress.split(' ')[0]}</div>
                                    <div className='address'>{modPost.postAddress}</div>
                                </div>
                            </StEventPlaceBox><br />
                            <input type="text" placeholder='상세주소' value={modPost.detailAddress} onChange={modPostHandle} />
                            <KakaoMap address={modPost.postAddress} width='100%' height='130px' />
                        </div><br />
                        <div>
                            <button onClick={onSubmitAsk}> 수정완료</button>
                            <button onClick={toggleEdit}>취소</button>
                        </div>
                    </div>
                )
                    :
                    (
                        <>
                            <STIng style={{ marginTop: "14px", marginBottom: "14px" }}>
                                <STImg style={{ display: "flex" }}>
                                    <img src={Views} style={{ width: "20px", height: "20px", flex: "2" }} />
                                    <div style={{ color: "#8B909F", flex: "8", marginLeft: "5px" }}>{post.viewCount}</div>
                                </STImg>
                                <PostScrap style={{}} bookMarkStatus={post.bookMarkStatus} />
                            </STIng>

                            <div style={{ marginBottom: "14px" }}>
                                <img src={post.userImg} style={{ width: "36px", height: "36px", borderRadius: "30px" }} />
                                <STUsername>{post.userName}</STUsername>
                            </div>

                            <STInput style={{ marginBottom: "8px" }}>{post.title}</STInput>

                            <div>
                                <Carousel fade>
                                    {
                                        post.askPostImgList
                                        && post.askPostImgList.map((img, i) => {
                                            return (
                                                <Carousel.Item key={img.id + i}>
                                                    <img style={{ width: "100%", height: "396px", borderRadius: "10px", objectFit: "contain" }}
                                                        src={img.postImgUrl} />
                                                </Carousel.Item>)
                                        })
                                    }
                                </Carousel>
                            </div>

                            <StContent style={{ marginBottom: "14px", paddingTop: "5px" }}>{post.content}</StContent>

                            <div>행사장 링크</div>
                            <STInput style={{ marginBottom: "14px" }}>{post.postLink}</STInput>

                            <div>행사장소</div>
                            <div style={{ display: "flex", marginBottom: "8px" }}>
                                <STAddressButton style={{ flex: "2" }}>#{post.postAddress.split(' ')[0]}</STAddressButton>
                                <STInput style={{ flex: "8", marginLeft: "5px" }}>{post.postAddress}</STInput>
                            </div>

                            <KakaoMap address={post.postAddress} width='100%' height='144px' />

                            {localStorage.getItem('userId') === post.userId.toString() &&
                                (<div>
                                    <STEditButton style={{ background: "#515466" }} onClick={() => { onAskDelete(postId); }}>삭제</STEditButton>
                                    <STEditButton onClick={toggleEdit}>수정</STEditButton>
                                </div>)}
                        </>
                    )}
                <Comment postId={postId} kind='ask' commentDtoList={post.commentDtoList} />

            </StWrap>
    );
};

export default Ask;


const StCarouselWrap = styled.div`
    .carousel-indicators [data-bs-target]{
        width:3px;
        border-radius : 50%;
    }
`
const STUploadButton = styled.button`
    margin-left:10px;
    width : 60px;
    height : 60px;
    background-color: #F4F4F4;
    color : #5E5E5E;
    float : left;
    font-size: 40px;
    vertical-align : middle;
    height : 100%;
    border-radius: 10px;
    border : transparent;
`

const LikeBox = styled.div`
    width:100%;
    height:50px;
`


//---------------------

const STIng = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 206px;
    width: 100%;
    height: 44px;
`

const STIngDiv = styled.p`
    display: flex;
    flex-direction: row;
    align-items: center;
    text-align: center;
    vertical-align: center;
    /* padding: 14px 16px 14px 18px; */
    /* gap: 10px; */
    justify-content: center;
    width: 85px;
    height: 44px;
    background: #15DD95;
    color: #FFFFFF;

    /* line-height: 44px; */
`
const STUsername = styled.span`
    color : #424754;
    margin-left: 12px;
`
const STInput = styled.div`
    width: 100%;
    //height: 36px;
    background: white;
    border-radius: 10px;
    font-weight: 500;
    padding-top: 6px;
    padding-left: 6px;
    padding-bottom: 6px;
`

const STButton = styled.p`
    background: #DDE1FF;
    border-radius: 100px;
    height: 44px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color :#00105C;
`

const STButton2 = styled.p`
    background: white;
    border-radius: 100px;
    height: 44px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: #424754; 
`

const STBox2 = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 0px;
    gap: 4px;
    width: 100%;
    height: 44px;
    font-size: 17px;
`

const StContent = styled.textarea`
    width: 100%;
    height: 144px;
    border : transparent;
    background: #FFFFFF;
    padding-top: 6px;
    padding-left: 6px;
`

const STAddressButton = styled.div`
    width: 64px;
    height: 36px;
    background-color: #DCE0F1;
    border-radius: 30px;
    text-align: center;
    padding-top: 6px;
`

const STEditButton = styled.button`
    width: 67px;
    height: 40px;
    background: #B8C4FF;
    border-radius: 100px;
    float: right;
    
    border : transparent;
`

const STImg = styled.div`
    display : inline-block;
    //background-color: black;
    position: absolute;
    left : 94px;
    //margin-left: 10px;
`

