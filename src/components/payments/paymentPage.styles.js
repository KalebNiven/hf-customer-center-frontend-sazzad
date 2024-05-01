import styled from "styled-components";

export const Container = styled.div`
position:relative;
color:#f4f4f4;
height:100%;
margin: 0 144px;
  width:calc(100% - 288px);
  @media only screen and (max-width: 1200px) {
    margin: 0 86px;
    width:calc(100% - 172px);
  };
  @media only screen and (max-width: 768px) {
    display:block;
    margin: 0 16px;
    width:calc(100% - 32px);
  };
`;

export const PaymentTypeTxt = styled.div`
margin: 40px 0 24px 0;
margin-left:auto;
margin-right:auto;
font-size: 20px;
font-weight: 500;
font-stretch: normal;
font-style: normal;
line-height: 1.6;
letter-spacing: normal;
color: #003863;
display: flex;
width: 896px;
justify-content: flex-start;
@media only screen and (max-width: 768px) {
  width:100%;
  overflow-wrap: break-word;
};
`;

export const InnerContainer = styled.div`
  display: flex;
  gap:10px;
  flex: 1 1 auto;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
  @media only screen and (max-width: 768px) {
    display:block;
  };
`;

export const LeftContainer = styled.div`
  display: block;
  width:448px;
  @media only screen and (max-width: 768px) {
    width:100%;
  };
`;

export const RightContainer = styled.div`
  display: block;
  width:448px;
  @media only screen and (max-width: 768px) {
    width:100%;
  };
`;

export const Card = styled.div`
  height:100%;
  flex-grow: 0;
  padding: 24px;
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px 0 #d8d8d8;
  @media only screen and (max-width: 768px) {
    margin-bottom: 21px;
  };
`;

export const Heading = styled.div`
  @media only screen and (min-width: 768px) and (max-width: 1069px) {
    height: 2.5rem;
  };
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #003863;
`;

export const Description = styled.div`
padding: 0 0 12px;
  max-height: 50px;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  color: #474b55;
`;

export const PaymentButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40px;
  margin: 30px 0 0;
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #3e7128;
  border: 1px solid #3e7128;
  color: #ffffff;
  font-weight: bold;
  font-size: 1.25rem;
  line-height: 1.5rem;
  @media only screen and (max-width: 768px) {
    margin: 0;
  };
`;

export const FirstPaymentButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40px;
  margin: 30px 0 0;
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #3e7128;
  border: 1px solid #3e7128;
  color: #ffffff;
  font-weight: bold;
  font-size: 1.25rem;
  line-height: 1.5rem;
  @media only screen and (max-width: 768px) {
    margin: 6px 0 0;
  };
`;

export const PaymentPortalWrapper = styled.div`
  display: block;
  width: 100%;
  background-color: none;
  color: #000;
  font-weight: 400;
  font-size: 16px;
  line-height: normal;
  position:relative;
  height:100%;
`;

export const Banner = styled.div`
  height: 240px;
  margin: auto;
  @media only screen and (max-width: 480px) {
    height: 240px;
  }
  background-image: linear-gradient(to bottom,#003863, rgba(238, 238, 238, 0)),linear-gradient(
  101deg, #0377a3, #0377a3, #367c19);
`;

export const BrandingContainer = styled.span`
  position:absolute;
  padding-top: 40px;
  margin: 3px 0 0px 0px;
  width:100%;
  @media only screen and (max-width: 960px) {
    margin-top: 21px;
    padding-top: 20px;
  };
  @media only screen and (max-width: 768px) {
    margin-top: 21px;
    padding-top: 20px;
  };
  @media only screen and (max-width: 480px) {
    // margin-top: -34px;
    margin-left: 0px;
    // padding-top:20px
  }
`;

export const BrandingInnerContainer = styled.div`
  display: flex;
  margin: 0 144px;
  width:calc(100% - 288px);
  gap:35px;
  flex: 1 1 auto;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
  @media only screen and (max-width: 1200px) {
    margin: 0 86px;
    width:calc(100% - 172px);
  };
  @media only screen and (max-width: 960px) {
    display: contents;
    margin: 0;
    width:100%;
  };
`;

export const BrandingLeftContainer = styled.div`

  display: block;
  width:950px;
    @media only screen and (max-width: 960px) {
      margin: 0 86px;
      width: calc(100% - 172px);
    };

    @media only screen and (max-width: 668px) {
      margin: 0 16px;
      width:calc(100% - 32px);
    };

`;

export const LeafIcon = styled.img`
  width: 240px;
  float: left;
  margin-left: -144px;
  object-fit: contain;
  position:absolute;
  margin-top :0px;
  @media only screen and (max-width: 960px) {
     margin-left: -144px;
     float:right;
    position:relative;
    margin-top: -60px;
  }
  @media only screen and (max-width: 480px) {
    padding-right:8px;
    width:240px;
    height:240px;
    padding-top:0;
    top:0px;
    margin-top: -30px;
  }
`;

export const Div = styled.div`
  margin-top: 40px;
`;

export const BrandingRightContainer = styled.div`
  display: block;
`;

export const BrandingImage = styled.img`
  width: 240px;
  padding-top: 20px;
  @media only screen and (max-width: 960px) {
    margin-left: auto;
  }
  @media only screen and (min-width: 960px) {
    margin-right: auto;
  }
`;

export const BrandingTitle = styled.h1`
  height: 60px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  font-size: 48px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.25;
  letter-spacing: normal;
  color: white;text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  display: block;
  @media only screen and (max-width: 768px) {
    font-size: 48px;
  };
`;

export const ProgressWrapper = styled.div`
  width:100%;
  margin-top: 10px;
  margin-bottom: 10px;
`;
