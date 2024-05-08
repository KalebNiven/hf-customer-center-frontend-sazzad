import styled from "styled-components";
import { IconButton } from "@material-ui/core";

export const Container = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  z-index: 999;
  height: 100%;
`;

export const Nav = styled.div`
  padding: 20px 16px;
  border-bottom: 1px solid #d8d8d8;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .filters {
    color: #003863;
    font-size: 18px;
    font-weight: 600;
  }
`;

export const Footer = styled.div`
  padding: 20px 16px;
  border-top: 1px solid #d8d8d8;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .clearAll {
    font-weight: 600;
    font-size: 14px;
    color: #008bbf;
    cursor: pointer;
  }

  .apply {
    background: #3e7128;
    border-radius: 4px;
    padding: 8px 16px;
    width: max-content;
    color: white;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
  }
`;

export const DateRangeWrapper = styled.div`
  display: flex;
  padding: 32px 16px;
  flex-direction: column;
  justify-content: flex-start;

  .name {
    color: #003863;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
  }
`;

export const FromDateWrapper = styled.div`
  display: flex;
  flex-direction: column;

  span {
    color: #474b55;
    font-size: 16px;
    font-weight: 300;
  }
`;

export const EndDateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  margin-bottom: 22px;

  span {
    color: #474b55;
    font-size: 16px;
    font-weight: 300;
  }
`;

export const ImgIcon = styled.img`
  cursor: pointer;
`;

export const styleWithMargin = (border) => {
  return {
    height: 45,
    border: border ? "2px solid #003863" : "1px solid #a8abac",
    fontFamily: "museo-sans",
    fontColor: "#a8abac",
    backgroundColor: "#ffffff",
    marginTop: "21px",
    width: "100%",
    borderRadius: "4px",
    outline: 0,
  };
};

export const styleWithoutMargin = (border) => {
  return {
    height: 45,
    border: border ? "2px solid #003863" : "1px solid #a8abac",
    fontFamily: "museo-sans",
    fontColor: "#a8abac",
    backgroundColor: "#ffffff",
    width: "100%",
    borderRadius: "4px",
    outline: 0,
  };
};

export const Highlight = styled.div`
  background-color: #3e7128;
  border-radius: 50%;
  color: #ffffff !important;
`;

export const NoHighlight = styled.div``;

export const Day = styled(IconButton)`
  width: 36px;
  height: 36px;
  font-size: 12px !important;
  font-family: "museo-sans";
  margin: 0px 0px !important;
  font-weight: 500;
  color: ${(props) =>
    props.highlight ? "#ffffff !important" : "rgba(0, 0, 0, 0.87) !important"};
`;

export const Clear = styled.button`
  border: 0;
  padding: 0;
  color: #008bbf;
  background: none;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  width: fit-content;
`;
