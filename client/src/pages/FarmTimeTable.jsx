import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { showModal, closeModal } from '../store/ModalSlice';
import { initDate } from '../store/FormSlice';
import ModalContainer from '../components/Modal'
import FarmPeriod from '../components/FarmPeriod';
import UpdatePeriod from '../components/UpdatePeriod';
import FarmFormat from '../components/FarmFormat';
import FarmTime from '../components/FarmTime';
import Pagination from '../components/TimeTablePagination';
import styled from 'styled-components';
import {ConfirmButton, DeleteButton, ContentContainer, NormalButton} from '../styles/Styled';
import { HOST } from '../global-variables';

import * as API from '../lib/userApi';

const Subject = styled.h2`
	text-align: center;
	margin-top: 7%;
	margin-bottom: 3%;
`;
const TimeTableList = styled(ContentContainer)`
    border : 2px lightgray solid;
    border-radius : 10px;
    padding 15px;
    margin : 2% 0;
`;
const FarmImg = styled.img`
    margin-right: 20px;
    width: 20%;
`;
const TimTableContent = styled.div`
    display:block
    width: 100%;
`; 
const TimTableItem = styled.div`
    display:flex;
`;
const AddTimTable = styled(NormalButton)`
    display:block;
    margin-left:auto;
    margin-bottom:10px;
`;
const TimeTableButtons = styled.div`
    display:flex;
    flex-direction:column;
    margin-left:auto;
`;
const UpdateButton =styled(ConfirmButton)`
    display: block;
    width: 100%;
    + button {
        margin-left: 0px;
    }
    :not(:last-child) {
        margin-bottom:10px;
    }
`;
const DelButton = styled(DeleteButton)`
    display: block;
    width: 100%;
    + button {
        margin-left: 0px;
    }
`;
const H3 = styled.h3`
    margin : 30px 0 10px;
    font-size : 1.3rem;
`;
const SubmitBtn = styled.button`
    margin-top : 20px;
`;
const FailAnnouncement = styled.p`
	text-align: center;
	margin-top: 5rem;
`;

//memo 지혜 : TimeTable
const TimeTable = ()=>{
    const [timeTable, setTimeTable] = useState([]);
    const [postData, setPostData] = useState({});
    const [date, setDate] = useState([]);
    const [maxHeadCount, setMaxHeadCount] = useState([]);
    const [cost, setCost] = useState('');

    // memo : 수정
    const [target,setTarget] = useState('');

    // memo 지혜 : 페이지네이션
    const [page, setPage] = useState(1);    
    const [lastId, setLastId] = useState([0]);
    const [first,setFirst] = useState(1);
    const [last,setLast] = useState(1);
    const [pageGroup, setPageGroup] = useState(0);
    const limit = 20;
    const perpage = 5;
    const pageCount = limit / perpage;
    const offset = ((page-1) - (pageCount * pageGroup) )* perpage;


    const dispatch = useDispatch();
    const modalOpen = useSelector(({modal}) => modal);

    const fetchData = async () => {
        try {
            await API.get(`${HOST}/api/timetables/owner?lastId=${lastId[pageGroup]}&limit=${limit}`).then((res) => {
                const data = res.data;
                // console.log(data);
                // console.log(lastId);
                setTimeTable([...data]);
                
            });
        }
        catch(e){
            console.log(e);
        }
    };
    
    const LiftingHeadCount = state =>{
        setMaxHeadCount([...maxHeadCount,...state]);
    }
    const LiftingDate = state =>{
        setDate([state,...date]);
    }

    const stateLifting = state => {
        setPostData({...postData,...state});
    }

    // memo 지혜 : 체험테이블 생성
    const handleSubmit = async(e , target) =>{   
        console.log(target);
        e.preventDefault();

        if (target === ''){
            if(postData.timeList.length < 1 || cost < 1 || !postData.startDate || !postData.endDate) {
                alert('모든 값을 올바르게 기입해주세요');
                return;
            };
            
            const {timeList,startDate,endDate} = postData;
            const d1 = new Date(startDate);
            const d2 = new Date(endDate);
            
            let diffDate = d1.getTime() - d2.getTime();
            diffDate = Math.abs(diffDate /(1000*60*60*24));

            for (let i = 0; i <= diffDate ; i++ ){
                const date = `${d1.getFullYear()}-${d1.getMonth() + 1}-${d1.getDate()+i}`;
                
                for (let j = 0; j< timeList.length; j++){

                    const start_time = timeList[j][0];
                    const end_time = timeList[j][1];
                    const personnel = maxHeadCount[j];

                    try {
                        const res = await API.post(`${HOST}/api/timetables`,{
                            'date': date,
                            'personnel':personnel,
                            'price':cost,
                            'start_time':start_time,
                            'end_time':end_time
                        });
                        console.log(res);
                    }
                    catch(e){
                        console.log(e);
                    }
                }
            }
        }
        else {
            try {
                const res = await API.put(`{HOST}/api/timetables/${target}`,{
                    'date': date[0],
                    'personnel':maxHeadCount[0],
                    'price':cost,
                    'start_time':postData.timeList[0][0],
                    'end_time':postData.timeList[0][1]
                });
                console.log(res);
            }
            catch(e){
                console.log(e);
            }
        }
        
        alert(`체험시간표 ${target === '' ? '등록' : '수정'}완료`);
        dispatch(closeModal());
        dispatch(initDate());
        setDate('');
        setCost('');
        setTarget('');
        fetchData();
    };

    const onTimeTableDelete = async(id) => {
        await API.delete(`${HOST}/api/timetables/${id}`);
        fetchData();
    };

    const onTimeTableUpdate = (id)=>{
        setTarget(id);
        console.log(id);
        dispatch(showModal());
    };

    const handleCreate = () => {
        setTarget('');
        dispatch(showModal());
    }

    useEffect (() => {
        fetchData();
    }, [lastId,pageGroup]);
    
    return (
        <>
        <FarmFormat>
            
            <Subject>체험시간표</Subject>
            <AddTimTable type='button' onClick = {() => handleCreate()}>추가하기</AddTimTable>
            { timeTable.length > 0 
            && <Pagination pageCount={pageCount} timeTable={timeTable} 
                perpage={perpage} page={page} setPage={setPage}
                pageGroup={pageGroup} setPageGroup={setPageGroup} 
                first={first} last={last} 
                setFirst={setFirst} setLast={setLast} 
                fetchData={fetchData} lastId = {lastId} setLastId={setLastId}/>}

            { timeTable.length > 0 ? 

                    timeTable.slice(offset, offset + perpage).map((table,idx) =>{
                        return(
                            <TimeTableList key={idx}>
                                <TimTableItem>
                                    <FarmImg src={table.farm? table.farm.url:''} alt='농장이미지'></FarmImg>
                                    <TimTableContent>
                                        <div>
                                            <span>날짜 : </span>
                                            <span>{table.date}</span>
                                        </div>
                                        <div>
                                            <span>시작시간 : </span>
                                            <span>{table.start_time}</span>
                                        </div>

                                        <div>
                                            <span>끝나는시간 : </span>
                                            <span>{table.end_time}</span>
                                        </div>
                                        
                                        <div>
                                            <span>가격 : </span>
                                            <span>{(table.price).toLocaleString('ko-KR')}</span>  
                                        </div>
                                            
                                        <div>
                                            <span>인원수 : </span>
                                            <span>{table.personnel}</span>
                                        </div>
                                    </TimTableContent>
                                    <TimeTableButtons>
                                        <UpdateButton type='button' onClick={()=>onTimeTableUpdate(table.id)}>수정</UpdateButton>
                                        <DelButton type='button' onClick={()=>onTimeTableDelete(table.id)}>삭제</DelButton>
                                    </TimeTableButtons>
                                </TimTableItem>
                            </TimeTableList>
                        )
                    }) 
                    : (<FailAnnouncement>체험시간표를 추가하세요</FailAnnouncement>) 
            }
        </FarmFormat>

        { modalOpen && <ModalContainer>
                <form onSubmit={(e) => handleSubmit(e , target)}>
                    <h1>체험시간표</h1>
                    <div>
                        <H3>체험 날짜</H3>
                        {target==='' ? <FarmPeriod onStateLifting ={stateLifting}/> : <UpdatePeriod timeTable={timeTable} target={target}  LiftingDate ={LiftingDate}/>}
                    </div>

                    <div>
                        <H3>체험 시간</H3>
                        <FarmTime onStateLifting={stateLifting} LiftingHeadCount={LiftingHeadCount} target={target}></FarmTime>
                        
                    </div>
                    <div>
                        <H3>체험 비용</H3>
                        <input type='text' placeholder='체험비용을 입력하세요' value={cost} onChange={(e)=>setCost(e.target.value)}></input>
                    </div>
                    <SubmitBtn type='submit'>{target=='' ? '등록하기' : '수정하기'}</SubmitBtn>
                </form>
            </ModalContainer>
        }
        </>
    )
}

export default TimeTable;