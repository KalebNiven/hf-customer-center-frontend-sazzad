import React from 'react';
import styled from "styled-components";
import GlobalStyle from "../../styles/GlobalStyle";
import Slider from "react-slick";
import { useSelector } from "react-redux";
import { useAppContext } from '../../AppContext';
import { SHOW_SLIDES } from "../../constants/splits";
import { FeatureTreatment } from "../../libs/featureFlags";
import { useHistory } from 'react-router-dom';
import { useHomeContext } from './homeContext';
import { Tooltip } from "@material-ui/core";
import ReactMarkdown from 'react-markdown';
import ExternalSiteLink from '../common/externalSiteLink';

const Carousel = () => {

  const history = useHistory();
  const slideItems = useSelector((state) => state.homeDetails.carouselItems);
  const customerInfo = useSelector((state) => state.customerInfo.data);
  const { innerWidth } = useAppContext();
  const LINK_TYPE = { external: "External", cc: "CC" }
  const { showSlides, setShowSlides } = useHomeContext()
  const settings = {
    dots: false,
    infinite: true,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const getAssessmentLink = () => {
    let hrefLink;
    if (customerInfo.companyCode == "30" && ["SIGD", "SIGO", "SIGT"].some(x => x == customerInfo.benefitPackage)) {
      hrefLink = { type: LINK_TYPE.external, link: "https://myhfsignaturesurvey.com/healthfirst/hralogin/" }
    }
    else if (customerInfo.companyCode == "30" && ["NY65", "IBP1", "CBP1", "LIP1", "DMCR"].some(x => x == customerInfo.benefitPackage)) {
      hrefLink = { type: LINK_TYPE.external, link: "https://s.morpace.com/m170018&i.user1=2" }
    }
    else {
      hrefLink = { type: LINK_TYPE.cc, link: `/hra/${customerInfo?.memberId}` }
    };

    if(hrefLink.type === LINK_TYPE.cc) {
      history.push({ pathname: `${hrefLink.link}` })
    } else {
      window.location.href = hrefLink.link
    }
  }

  return (
    (showSlides && Array.isArray(slideItems) && slideItems.length > 0) &&
    <FeatureTreatment
      treatmentName={SHOW_SLIDES}
      onLoad={() => { }}
      onTimedout={() => { }}
    >
      <Card >
        <GlobalStyle />
        <Slider {...settings} className="now-pow-resources-carousel">
          {
            slideItems.map((item, index) => (
              <div key={index}>
                <Paper innerWidth={innerWidth}>
                  {
                    (item.slideImage.length > 0 ) ?
                      ((innerWidth > 480 ) ?
                      <Images src={item.slideImage.length > 0 ? item.slideImage[0].url : ""} />
                       : <Images src={item.slideImage.length > 1 ? item.slideImage[1].url : ""} />
                      )
                      : null
                  }
                  <Content>
                    <ContentText >
                      <ContentTitle>{item.slideTitle}</ContentTitle>
                      {item.slideContent.replace(/<\/?span[^>]*>/g, "").length >= (innerWidth > "480px" ? 173 : 206) ?
                      <Tooltip
                      title = {<ReactMarkdown children={item.slideContent.replace(/<\/?span[^>]*>/g, "") }/>}
                     >
                      <ContentDesc><ReactMarkdown
                        components={{
                          p: ({node, ...props}) => <p style={{color: "#474b55", lineHeight: "1.29", fontSize: "14px" }} {...props} />
                        }}
                        children={item.slideContent.replace(/<\/?span[^>]*>/g, "")}/>
                        </ContentDesc></Tooltip> : <ContentDesc><ReactMarkdown
                        components={{
                          p: ({node, ...props}) => <p style={{color: "#474b55", lineHeight: "1.29", fontSize: "14px" }} {...props} />
                        }}
                        children={item.slideContent.replace(/<\/?span[^>]*>/g, "")}/>
                        </ContentDesc>}

                    </ContentText>

                    {
                      item.linkVerbiage === "Take Assessment" ?
                      <SlideLink onClick={() => getAssessmentLink() }>
                        {item.linkVerbiage}
                      </SlideLink>
                      : item.linkType === 'External' ?
                      <ExternalSiteLink link={item.slideLink} label={item.linkVerbiage} target="_blank" >
                        <SlideLink>
                          {item.linkVerbiage}
                        </SlideLink>  
                      </ExternalSiteLink>
                      :
                      <SlideLink onClick={() => window.location.href = item.slideLink} >
                        {item.linkVerbiage}
                      </SlideLink>
                    }
                  </Content>
                </Paper>
              </div>
            ))}
        </Slider>
        <CloseIcon src="react/images/icn-close.svg" onClick={() => setShowSlides(false)} />
      </Card>
    </FeatureTreatment>
  );
};

function NextArrow(props) {
  const { style, onClick } = props;
  return (
    <NextArrowImg
      src="react/images/arrow-right.svg"
      style={props.currentSlide + 1 === props.slideCount ? { ...style, display: "block", pointerEvents: "none", filter: "opacity(0.4) drop-shadow(0 0 0 #474b55)" } : { ...style, display: "block",cursor:"pointer" }}
      onClick={onClick}
    />
  );
}

function PrevArrow(props) {
  const { style, onClick } = props;
  return (
    <PrevArrowImg
      src="react/images/arrow-left.svg"
      style={props.currentSlide === 0 ? { ...style, display: "block", pointerEvents: "none", filter: "opacity(0.4) drop-shadow(0 0 0 #474b55)" } : { ...style, display: "block",cursor:"pointer"}}
      onClick={onClick}
    />
  );
}



const Card = styled.div`
  background-color: #ffffff;
  word-break: break-word;
  margin-bottom:40px;
  border-radius: 4px;
  box-shadow:  0 0 8px 0 rgba(0, 0, 0, 0.23);
  position: relative;
  @media only screen and (max-width: 668px) {
    padding-bottom: 20px;
  }
`;

const Images = styled.img`
  @media only screen and (max-width: 668px) {
    order:2;
    margin-bottom: 25px;
    width: 100%;
  }
  width: 160px;
  height: 160px;
  flex-grow: 0;
  object-fit: cover;
`;

const Paper = styled.div`
  @media only screen and (max-width: 668px) {
    display:flex;
    flex-direction:column;
    margin-bottom: 10px;
    min-height:343px;
  }
  display:flex;
  flex-direction:row;
`;

const Content = styled.div`
  @media only screen and (max-width: 668px) {
    order:1;
  }
`;

const ContentText = styled.div`
@media only screen and (max-width: 668px) {
  padding: 24px 0px 18px 15px;
}
    padding:10px;
    min-height:140px;
    padding: 24px 16px 18px 24px;
`;

const ContentTitle = styled.div`
  @media only screen and (max-width: 668px) {
    margin: 15px 16px 8px 0px;
  }
  flex-grow: 0;
  font-size: 18px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
  color: #003863;
  height:24px;
  display:inline;
`;

const ContentDesc = styled.div`
  @media only screen and (max-width: 668px) {
    margin: 15px 16px 14px 0px;
  }
  margin-top: 8px;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;
  height: 54px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;


const SlideLink = styled.div`
  @media only screen and (min-width: 667px) {
    bottom: 2px;
    margin-left: 24px;
    top: 126px;
  }
  @media only screen and (max-width: 668px) {
    margin-left: 15px;
  }
  bottom: 2px;
  margin-left: 16px;
  bottom: 2px;
  position: absolute;
  height: 16px;
  flex-grow: 0;
  margin-top:-5px;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #008bbf;
  &:hover{
      color:#2A6A9E;
      text-decoration:underline;
      cursor:pointer;
    }
`;


const CloseIcon = styled.img`
   margin: 16px 0 88px 12px;
   object-fit: contain;
   width: 15px;
   height: 15px;
   position: absolute;
  right: 1rem;
  top: 0;
   &:hover {
    cursor: pointer;
   }
   bottom:150px;
   @media only screen and (max-width: 668px) {
    top: 0;
    right: 1rem;
   };
`;

const NextArrowImg = styled.div`
    position: absolute;
    right: 18px;
    padding: 10px;
    bottom: 8px;
    &::before {
      display:block;
      content: " ";
      background-image: ${props => props.src && `url(${props.src})`};
      background-size: 20px 20px;
      height: 20px;
      width: 20px;
      position: absolute;
      opacity: 1;
    }
    @media only screen and (min-width: 667px) {
      bottom:8px;
      top:70%;
    }
`;

const PrevArrowImg = styled.div`
  right: 40px;
  bottom: 8px;
  position: absolute;
  z-index: 2;
  padding: 10px;
  &::before {
    display: block;
    content: " ";
    background-image: ${props => props.src && `url(${props.src})`};
    background-size: 20px 20px;
    height: 20px;
    width: 20px;
    position: absolute;
    opacity: 1;
  }
  @media only screen and (min-width: 667px) {
    bottom:8px;
    top:70%;
  }
`;

export default Carousel;
