import React from "react";
import styled from "styled-components";

const DotNavComponent = ( { count = 2, index }) => {
  
  let rows = [];
  for (let i = 0; i < count; i++) {
    let data = i === index ? <Dot selected /> : <Dot />
    rows.push(data);
  }
  
  return (
    <Main>
      {rows}
    </Main>
  )
}

const Main = styled.div`
  display: -webkit-box;
  -webkit-box-pack: center;
  -webkit-box-align: center;
  margin: 5px;
`;

const Dot = styled.div`
  border-radius: 8px;
  border: 1px solid #474b55;
  background-color: ${props => props.selected ? '#474b55' : '#ffffff'};
  width: 8px;
  height: 8px;
  margin: 2px;
`;

export default DotNavComponent;