import React, { useState, useEffect, componentDidMount } from "react";
import styled, { keyframes } from "styled-components";

const Spinner = ({ margin, width, height }) => {

    return (
        <ProgressSpinner margin={margin} width={width} height={height}></ProgressSpinner>
    );
};

export default Spinner

const SpinnerRotate = keyframes`
  from {transform: rotate(0deg);}
  to {transform: rotate(360deg);}
`;

const ProgressSpinner = styled.div`
  text-align: center;
  margin: auto;
  margin-top: 10em;
  margin-bottom: 10em;
  border: 3px solid #e6e6e6;
  border-top: .5em solid #4b6f32;
  border-radius: 50%;
  width: 4em;
  height: 4em;
  animation-name: ${SpinnerRotate};
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  margin: ${props => props.margin && props.margin};
  width: ${props => props.width && props.width};
  height: ${props => props.height && props.height};
`;
