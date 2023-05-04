import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

const LongLoadSpinner = ({ show }) => {
  const [longLoadSpinnerShow, setLongLoadSpinnerShow] = useState(show);
  useEffect(() => {
    setLongLoadSpinnerShow(show)
  })

  return (
    JSON.parse(longLoadSpinnerShow) ? (

      <Overlay>
        <Container>
          <LeafImg src="/react/images/ico-leaf-green.svg" >
          </LeafImg>
          <LongLoadSpin>

          </LongLoadSpin>
        </Container ></Overlay>) : null
  );
};

export default LongLoadSpinner
const LeafImg = styled.img`

position: absolute;
top: 15%;
left: 15%;

  height: 50px;
  width:50px;
  @media only screen and (max-width: 768px) {
    top: 15%;
left: 15%;

  height: 30px;
  width:30px;
  };
  @media only screen and (max-width: 480px) {
    top: 15%;
left: 15%;

  height: 20px;
  width:20px;
  }
`;
const ImgContainer = styled.div`
display:inline-block;
vertical-align:middle;`
const Container = styled.div`
width:78px;
height:77px;
border-radius:10px;
background-color:white !important;
position:relative;
top:50%;
left:50%;
opacity:1 !important;
z-index:99989;
display:inline-block;
vertical-align:middle;
@media only screen and (max-width: 768px) {
  width:58px;
height:57px;
};
@media only screen and (max-width: 480px) {
  width:38px;
height:37px;
}
`;
const SpinnerRotate = keyframes`
  from {transform: rotate(0deg);}
  to {transform: rotate(360deg);}
`;
const Overlay = styled.div`
position:fixed;
top:0px;
left:0px;
height:100%;
width:100%;
background-color:black;
opacity:0.5;
z-index:9999;
`;
const LongLoadSpin = styled.div`
margin:auto;
width:76px;
height:76px;
border-radius: 50%;
border:2px solid white;
border-bottom: 2px solid #3e7128;
animation: ${SpinnerRotate} 0.6s infinite;
position: absolute;
top: 0px;
left: 0px;
@media only screen and (max-width: 768px) {
  width:56px;
height:56px;
};
@media only screen and (max-width: 480px) {
  width:36px;
height:36px;
}
`;