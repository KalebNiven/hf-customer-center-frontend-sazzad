import styled from "styled-components";

export const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 42, 74, 0.72);
  z-index: 9999;
  overflow: auto;
`;

export const ModalInnerWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 480px;
  height: 100vh;
  overflow: auto;
  padding-top: 2rem;
  padding-bottom: 2rem;
  &::-webkit-scrollbar {
    display: none;
  }
  @media only screen and (max-width: 960px) {
    top: 50%;
  }

  @media only screen and (max-width: 600px) {
    width: 100%;
  }
`;

export const ModalContent = styled.div`
  position: relative;
  border-radius: 4px;
  background-color: white;
  border: 1px solid darkgrey;
  padding: 25px;
  @media only screen and (max-width: 600px) {
    margin: 10px;
  }
`;

export const Button = styled.button`
  padding-left: 1rem;
  padding-right: 1rem;
  height: 40px;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: -0.08px;
  text-align: center;
  color: ${(props) => (props.green ? `white` : `#3e7128`)};
  background-color: ${(props) => (props.green ? `#3e7128` : `#ffffff`)};
  border-radius: 4px;
  margin-left: ${(props) => (props.green ? `20px` : ``)};
  border: solid 1px #3e7128;
  float: right;
  cursor: pointer;
`;

export const ButtonWrapper = styled.div`
  display: block;
  @media only screen and (max-width: 600px) {
  }
  margin-bottom: 4.5rem;
`;

export const Header = styled.div`
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.6;
  letter-spacing: normal;
  color: #003863;
  margin-top: 15px;
`;

export const Text = styled.div`
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #474b55;
  margin: 15px 0 25px;
`;

export const CloseIcon = styled.img`
  width: 15px;
  height: 15px;
  position: relative;
  float: right;
  right: 0px;
  &:hover {
    cursor: pointer;
  }
`;
