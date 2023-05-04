import styled from 'styled-components';

export const CardHeader = styled.div`
  padding: 16px 16px 0 16px;
`;

export const CardBody = styled.div`
  padding: 0 16px;
`;

export const CardFooter = styled.div`
  margin-top: 16px;
  padding: 16px;
  text-align: right;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

export const Card = styled.div`
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
  position: relative;
`;

export const FooterActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const FooterBody = styled.div`
  margin-bottom: 12px;
`;

export const TooltipIcon = styled.div`
  display: block;
  margin-left: 8px;
  content: "";
  background-image: url("/react/images/info-circle-icon.svg");
  background-position: center;
  background-size: cover;
  width: 16px;
  height: 16px;
  cursor: pointer;
  right:0em;
  margin-top:7.33px;
  margin-right:13.33px;

  &:hover {
    background-image: url("/react/images/info-circle-icon-blue.svg");
  }
`;