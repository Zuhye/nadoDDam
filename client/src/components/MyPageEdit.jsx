import { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components'
import { StyledButton, StyledUserInfo, StyledUserInfoWrap } from '../pages/MyPage1';
import * as userApi from "../lib/userApi";
import { useNavigate } from 'react-router-dom';

const Input = styled.input`
  border-radius: 10px;
  border: 1px solid lightgray;
  padding: 10px;
`

const MyPageEdit = ({id, name, title, userId,  userPassword}) => {
  const [reName, setReName] = useState({});
  const [change, setChange] = useState(false);
  const textInput = useRef();
  const navigate = useNavigate()

  const setReplaceName = () => {
    let replaceName = '';
    
    if(id === 'password'){
      replaceName =  "*".repeat(name.length)
    }else{
      replaceName = name;
    };
    
    setReName({
      value: replaceName,
    });
  };

  useEffect(() => {
    setReplaceName();
  },[name]);
 
  const changeEditMode = (e) => {
    setChange(cur => !cur);
  };

  const upDateComponents = async() => {
    setChange(cur => !cur);
    setReName({
      ...reName,
      value: textInput.current.value,
    });

    await userApi.patch(`//localhost:3500/api/myInfo/${userId}`, {
      [textInput.current.dataset.id]: textInput.current.value,
    });
    navigate('/mypage')
  }

  const DefaultView = () => {
    return (
      <StyledUserInfo>
        <div><span>{reName.value}</span></div>
        <div>
          <StyledButton onClick={changeEditMode}>수정</StyledButton> 
        </div>
      </StyledUserInfo>
    )
  };

  const RenderEditView = () => {
    return (
      <StyledUserInfo>
        <div>
          <Input 
            id={id}
            name={id} 
            type={id === "password" ? "password" : "text"} 
            defaultValue={reName.value}
            ref={textInput}
            data-id={id}
          />
        </div>
        <div>
          <StyledButton onClick={upDateComponents}>확인</StyledButton> 
          <StyledButton onClick={changeEditMode}>취소</StyledButton>
        </div>
      </StyledUserInfo>
    )
  };

  return(
    <StyledUserInfoWrap>
      <div><h4>{title}</h4></div>
      {change ? <RenderEditView/> : <DefaultView />}
    </StyledUserInfoWrap>  
  )
}

export default MyPageEdit;