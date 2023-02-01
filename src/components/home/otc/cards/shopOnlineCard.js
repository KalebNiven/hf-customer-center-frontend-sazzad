import React from 'react'
import styled from 'styled-components';
import ExternalSiteLinkSSO from '../../../common/externalSiteLinkSSO'
const { MIX_REACT_APP_NATIONS_OTC_HREF_V2 } = process.env;

const ShopOnlineCard = () => {
  return (
    <>
      {
        <ExternalSiteLinkSSO link={MIX_REACT_APP_NATIONS_OTC_HREF_V2} label="Nations OTC" target="_blank">
          <ShopOnlineCardWrapper>
              <ShopOnlineCardLeft>
                  <ShopOnlineTitle>NationsOTC</ShopOnlineTitle>
                  <ShopOnlineDescription>Use your OTC card to order health and wellness products online.</ShopOnlineDescription>
              </ShopOnlineCardLeft>
              <ShopOnlineCardRight>
                  <ShopOnlineIcon src="react/images/icon-chevron-right.svg" />
              </ShopOnlineCardRight>
          </ShopOnlineCardWrapper>
        </ExternalSiteLinkSSO>
      }
    </>
  )
}

export const ShopOnlineCardWrapper = styled.div`
  display: flex;
  margin-top: 8px;
  padding: 19px 16px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  background: #fff;
  cursor: pointer;
  justify-content: space-between;
`;

export const ShopOnlineCardLeft = styled.div`
`;

export const ShopOnlineCardRight = styled.div`
  align-self: center;
`;

export const ShopOnlineCardMiddle = styled.div`
`;

export const ShopOnlineTitle = styled.h4`
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 20px;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
`;

export const ShopOnlineDescription = styled.p`
  font-size: 14px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 20px;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
  margin-top: 8px;
`;

export const ShopOnlineIcon = styled.img`
`;

export default ShopOnlineCard
