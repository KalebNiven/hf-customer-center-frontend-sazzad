import React from 'react'
import styled from 'styled-components'

const Tooltip = ({
    continuous,
    index,
    step,
    size,
    backProps,
    closeProps,
    primaryProps,
    tooltipProps
  }) => (
    <TooltipBody {...tooltipProps} index={index} isDesktop={step.stepType === "desktop"}>
      {(step.stepType !== "desktop" && index === 0) ? null : <CloseButton src="/react/images/icn-close.svg" {...closeProps} />}
      {step.title && <TooltipTitle>{step.title}</TooltipTitle>}
      <TooltipContent>{step.content}</TooltipContent>
      {step.hideControlls ? null : <TooltipFooter>
        <ProgressWrapperMobile>
          {generateStepProgressBar(size, index)}
        </ProgressWrapperMobile>
        {(
          <Button {...backProps} outlined>
            Back
          </Button>
        )}
        <ProgressWrapper>
          {generateStepProgressBar(size, index)}
        </ProgressWrapper>
        {continuous && (
          <Button {...primaryProps}>
            Continue
          </Button>
        )}
      </TooltipFooter>}
    </TooltipBody>
);

const generateStepProgressBar = (size, activeIndex) => {
    const stepsProgressBar = []
    for(let i = 0; i < size; i++) {
      stepsProgressBar.push(<ProgressDot active={i == activeIndex ? true : false} key={i} />)
    }
    return stepsProgressBar 
}

export const TooltipBody = styled.div`
  max-width: 448px;
  background: #fff;
  padding: 20px;
  border-radius: 6px;
  position: relative;

  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #474b55;

  @media only screen  and (max-width: 480px) {
    width: auto;
    max-width: none;
    margin-left: 20px;
  }

  @media only screen  and (max-width: 878px) {
  }
`;

export const TooltipTitle =  styled.h3`
  font-size: 20px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.6;
  letter-spacing: normal;
  color: #003863;

  margin-top: 7px;
  max-width: 90%;
`;

export const TooltipFooter =  styled.div`
  display: flex;
  justify-content: space-between;

  @media only screen  and (max-width: 480px) {
    flex-direction: column-reverse;
    justify-content: center;
  }
`;

export const ProgressWrapper =  styled.div`
  display: flex;
  align-items: center;
  margin: 0 20px;

  @media only screen  and (max-width: 480px) {
    display: none;
  }
`;

export const ProgressWrapperMobile =  styled.div`
  display: none;
  
  @media only screen  and (max-width: 480px) {
    display: flex;
    align-items: center;
    margin-top: 20px;
    justify-content: center;
  }
`;

export const ProgressDot =  styled.div`
  border: 1px solid #a8abac;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  margin: 0 5px;
  background: ${props => props.active ? "#a8abac" : "#fff" };
`;

export const Button =  styled.button`
  padding: 8px 16px;
  border: 1px solid #3e7128;
  border-radius: 4px;
  background-color: ${props => props.outlined ? "#fff" : "#3e7128" };
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: -0.08px;
  text-align: center;
  color: ${props => props.outlined ? "#3e7128" : "#fff" };
  margin-top: 8px;
  cursor: pointer;

  &:hover {
    background-color:  ${props => props.outlined ? "rgba(62, 113, 40, 0.05)" : "#517f3d" };
  }
`;

export const TooltipContent =  styled.p`
  margin: 8px 0 20px 0;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #474b55;
`;

export const CloseButton =  styled.img`
  position: absolute;
  right: 20px;
  cursor: pointer;
`;

export default Tooltip;