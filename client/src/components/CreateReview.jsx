import { ImStarFull } from "react-icons/im";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import styled from 'styled-components'
import * as userApi from "../lib/userApi";

const RatingBox = styled.div`
  margin: 0 auto;

  & svg {
    color: #C4C4C4;
    cursor: pointer;
  }
  .black {
    color: yellow;
  }
`
const ShowReservation = ({reservationData}) => {
 return (
  <>
    {reservationData.map(item => {
      const {time, reserveInfo} = item;
      const start_time = time.start_time.slice(0,5);
      const end_time = time.end_time.slice(0,5);
      return (
        <div key={time.id}>
        <img src={time.url} alt="농장이미지"/>
        <h1>{time.name}</h1>
        <p>날짜: {time.date}</p>
        <p>체험시간: {start_time} - {end_time}</p>
        <p>인원: {reserveInfo.personnel}명</p>
        </div>
      )
    })}
  </>
 )
}

const CreateReview = ({id, farmId}) => {
  const [clicked, setClicked] = useState([false, false, false, false, false]);
  const navigate = useNavigate();
  let starScore = clicked.filter(Boolean).length;
  
  const handleStarClick = index => {
    let clickStates = [...clicked];
    clickStates.forEach((i, idx) => clickStates[idx] = idx <= index ? true : false)
    setClicked(clickStates);
   };

   const postReviewDataHandler = async(e) => {
    e.preventDefault();
    const content = e.target.content.value;
    const rating = starScore;
    const farm_id = farmId;
    try{
      await userApi.post(`//localhost:3500/api/review/${id}`, {
        content,
        rating,
        farm_id
      })
      navigate('/myreview');
    }catch(err){
      console.log(err);
    }
  };

  return (
    <>
    <RatingBox>
      <p>농장 체험 경험은 어떠셨나요?</p>
      {[0,1,2,3,4].map(item =>
      <ImStarFull 
      key={item}
      className={clicked[item] && 'black'}
      onClick={() => handleStarClick(item)}
      />)
      }
    </RatingBox>
    <form onSubmit={postReviewDataHandler}>
      <textarea name="content" placeholder="후기를 작성해주세요"></textarea>
      <button type="submit">저장</button>
    </form>
    </>
  )
}

const UpdateReview = ({content, rating, id}) => {
  const [clicked, setClicked] = useState([true,true,true,true,true]);
  const [reviewContent, setReviewContent] = useState(content);
  const navigate = useNavigate();

  const showRating = () => {
    let clickStates = [...clicked];
    clickStates.map((i, idx) => clickStates[idx] = idx <= rating-1 ? true : false)
    setClicked(clickStates);
  }

  useEffect(()=>{
    setReviewContent(content);
    showRating();
  },[content, rating]);

  const handleStarClick = index => {
    let clickStates = [...clicked];
    clickStates.forEach((i, idx) => clickStates[idx] = idx <= index ? true : false)
    setClicked(clickStates);
   };

   const updateReviewHandler = async(e) => {
    try {
      await userApi.patch(`//localhost:3500/api/review/${id}`, {
        status: '예약취소',
      });
      alert('수정되었습니다.');
      navigate('/myreview');
    } catch (err) {
      console.log(err.response.data.Error)
    }
  }

  return (
    <>
    <RatingBox>
      {[0,1,2,3,4].map(item =>
      <ImStarFull 
      key={item}
      className={clicked[item] && 'black'}
      onClick={() => handleStarClick(item)}
      />)
      }
    </RatingBox>
      <textarea 
        value={reviewContent}
        onChange={(e) => setReviewContent(e.target.value)}
      ></textarea>
    </>
  )
}

export  {CreateReview, ShowReservation, UpdateReview};