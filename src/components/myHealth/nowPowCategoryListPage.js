import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getCategoryDetails,
  getCategoryIcon,
  getCategoryDetailsAll,
} from "../../store/actions/index";
import Grid from "@material-ui/core/Grid";
import Spinner from "../common/spinner";
import Slider from "react-slick";
import { truncateString } from "../../utils/strings";
import { useAppContext } from "../../AppContext";
import { AnalyticsTrack } from "../common/segment/analytics";
import {
  ANALYTICS_TRACK_TYPE,
  ANALYTICS_TRACK_CATEGORY,
} from "../../constants/segment";
import { MainContentContainer } from "../common/styles";
import { SHOW_MYHEALTH } from "../../constants/splits";
import { FeatureTreatment } from "../../libs/featureFlags";
import GlobalError from "../common/globalErrors/globalErrors";
import { getSplitAttributes } from "../../utils/misc";

const NowPowCategoryListPage = () => {
  const [selectedIndex, setSelectedIndex] = useState([]);
  const [splitData, setSplitData] = useState([]);
  const [viewAllFlag, setViewAllFlag] = useState(false);
  const [viewData, setViewData] = useState();
  const [pageTitle, setPageTitle] = useState();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const { innerWidth } = useAppContext();

  const myHealth = useSelector((state) => state.myHealth);
  const icon = useSelector((state) => state.myHealth.currentCategIcon);
  const customerInfo = useSelector((state) => state.customerInfo);
  const splitAttributes = getSplitAttributes(customerInfo?.data);
  const { categoryDetails, categoryDetailsAll, loading } = myHealth;
  const details = categoryDetails;

  // on mount get the categories result from the service
  useEffect(() => {
    let state = location.state;
    setPageTitle(state.title);
    // PASS CATEGORY PAYLOAD
    dispatch(
      getCategoryDetails({
        categoryId: state.categoryId,
        lat: state.lat,
        lon: state.lon,
        categoryIconId: state.iconId,
        categoryName: state.title,
        address: state.zip,
        csrf: customerInfo?.data?.csrf,
      }),
    );
    dispatch(getCategoryIcon(state.iconId));
  }, []);

  // handle "view all" data
  const [allSelectedState, setAllSelectedState] = useState(null);
  useEffect(() => {
    if (!allSelectedState) return;
    let state = location.state;
    dispatch(
      getCategoryDetailsAll({
        categoryId: state.categoryId,
        lat: state.lat,
        lon: state.lon,
        categoryIconId: state.iconId,
        categoryName: state.title,
        address: state.zip,
        resourceTypeId: allSelectedState.resourceTypeId,
        resourceTypeName: allSelectedState.resourceTypeName,
        csrf: customerInfo?.data?.csrf,
      }),
    );
  }, [allSelectedState]);

  useEffect(() => {
    let indices = [];
    let split = [];
    details.forEach((data) => {
      let res = data.resources.slice(0);
      let index = res.length > 3 ? 0 : -1;
      indices.push(index);
      let tempData = [];
      while (res && res.length) {
        tempData.push(res.splice(0, 3));
      }
      split.push(tempData);
    });
    setSplitData(split);
    setSelectedIndex(indices);
  }, [details]);

  const displayCategories = () => {
    const settings = {
      dots: true,
      infinite: false,
      slidesToShow: 3,
      slidesToScroll: 3,
      // set false on mobile width < 768
      arrows: true,
      draggable: false,
      // variableWidth: true,
      nextArrow: <NextArrow alt="" src="/react/images/icn-arrow-right.svg" />,
      prevArrow: <PrevArrow alt="" src="/react/images/icn-arrow-left.svg" />,
      responsive: [
        {
          breakpoint: 769,
          settings: { arrows: false, slidesToShow: 1, slidesToScroll: 1 },
        },
        {
          breakpoint: 1024,
          settings: { arrows: false, slidesToShow: 2, slidesToScroll: 1 },
        },
      ],
    };

    return (
      splitData.length > 0 &&
      splitData.map((card, index) => {
        let mapArray =
          card[0] && card[1]
            ? [...card[0], ...card[1]]
            : card[0]
              ? [...card[0]]
              : card[1]
                ? [...card[1]]
                : [];
        return (
          <div key={index}>
            <MainDiv>
              <MainHeader>{details[index].resourceTypeName}</MainHeader>
              {selectedIndex[index] !== -1 && (
                <ViewAll
                  onClick={(e) => handleViewAll(e)}
                  data-resource-id={details[index].resourceTypeId}
                  data-resource-name={details[index].resourceTypeName}
                >
                  View All
                </ViewAll>
              )}
            </MainDiv>
            <CardRow>
              <Slider {...settings} className="now-pow-resources-slider">
                {mapArray.map((elem, ind) => (
                  <Div key={ind}>
                    <Card
                      onClick={() =>
                        handleCardClick(
                          details[index].resourceTypeId,
                          elem.id,
                          elem.name,
                        )
                      }
                    >
                      <Title>{truncateString(pageTitle, 45)}</Title>
                      <SubHeader>{truncateString(elem.name, 65)}</SubHeader>
                      <Address>{truncateString(elem.address, 45)}</Address>
                    </Card>
                  </Div>
                ))}
              </Slider>
            </CardRow>
          </div>
        );
      })
    );
  };

  const handleCardClick = (resourceTypeId, elemId, elemName) => {
    // Segment Track
    AnalyticsTrack("Community Resource Card Clicked", customerInfo, {
      raw_text: elemName,
      description: elemName,
      destination_url:
        window.location.origin + "/my-health/community-resources/details",
      category: ANALYTICS_TRACK_CATEGORY.myHealth,
      type: ANALYTICS_TRACK_TYPE.buttonClicked,
      targetMemberId: customerInfo?.data?.memberId,
      location: {
        desktop: {
          width: 1024,
          value: "center",
        },
        tablet: {
          width: 768,
          value: "center",
        },
        mobile: {
          width: 0,
          value: "center",
        },
      },
    });

    showDetails(resourceTypeId, elemId, elemName);
  };

  const showDetails = (resId, id, name) => {
    let state = location.state;
    history.push({
      pathname: "/my-health/community-resources/details",
      state: {
        categoryId: state.categoryId,
        iconId: state.iconId,
        title: state.title,
        lat: state.lat,
        lon: state.lon,
        resTypeId: resId,
        resId: id,
        zip: state.zip,
      },
    });
  };

  const handleViewAll = (e) => {
    const dataset = e.target.dataset;
    setViewAllFlag(true);
    setAllSelectedState({
      resourceTypeId: dataset.resourceId,
      resourceTypeName: dataset.resourceName,
    });
  };

  useEffect(() => {
    setViewData({ resources: categoryDetailsAll });
  }, [categoryDetailsAll]);

  const handleBack = () => {
    history.push({
      pathname: "/my-health/community-resources",
    });
  };
  const displayAllDetails = () => {
    let allDetails = viewData.resources;
    return myHealth.loading ? (
      <Spinner />
    ) : (
      <>
        <Grid container direction="row">
          {allDetails.map((data, idx) => {
            return (
              <Grid item xs={12} key={idx}>
                <ResultItemWrapper
                  onClick={() =>
                    handleCardClick(
                      allSelectedState.resourceTypeId,
                      data.id,
                      data.name,
                    )
                  }
                >
                  <InlineInnerFixedContainer align="center">
                    <ProviderIconContainer>
                      <ProviderIcon
                        src={`data:image/svg;base64,${icon}`}
                        width="50"
                        height="50"
                        alt=""
                      />
                    </ProviderIconContainer>
                  </InlineInnerFixedContainer>
                  <InlineInnerContainer>
                    <Grid container direction="column">
                      <Grid item>
                        <ProviderName type="submit">
                          {innerWidth < 768
                            ? truncateString(data.name, 12)
                            : data.name}
                        </ProviderName>
                        {data.phoneNumber && (
                          <ProviderPhone>
                            <PhoneNumberWrapper>
                              <PhoneNumberIcon
                                src="/react/images/icn-blue-call.svg"
                                width="13px"
                                height="12px"
                                alt=""
                              />
                              <PhoneNumberText>
                                {data.phoneNumber}
                              </PhoneNumberText>
                            </PhoneNumberWrapper>
                          </ProviderPhone>
                        )}
                        {data.address && (
                          <ProviderAddress>{data.address}</ProviderAddress>
                        )}
                      </Grid>
                    </Grid>
                  </InlineInnerContainer>
                  <InlineInnerFixedContainer>
                    <Distance>{`${data.distance.toFixed(2)} miles`}</Distance>
                  </InlineInnerFixedContainer>
                </ResultItemWrapper>
              </Grid>
            );
          })}
        </Grid>
      </>
    );
  };

  return (
    <ReactAppWrapper>
      <FeatureTreatment
        treatmentName={SHOW_MYHEALTH}
        onLoad={() => {}}
        onTimedout={() => {}}
        attributes={splitAttributes}
      >
        {loading ? (
          <Spinner />
        ) : (
          <Container>
            <BackLink onClick={handleBack}>
              <BackImg src="/react/images/icn-full-arrow.svg" />
              <BackText>BACK</BackText>
            </BackLink>
            <MainHeading isViewAllScreen={viewAllFlag}>
              {!viewAllFlag && (
                <MainImg src={`data:image/svg;base64,${icon}`} />
              )}
              <Text
                viewAllFlag={viewAllFlag}
              >{`${pageTitle} near ${location.state.zip}`}</Text>
            </MainHeading>
            {viewAllFlag
              ? displayAllDetails()
              : details.length > 0 && displayCategories()}
          </Container>
        )}
      </FeatureTreatment>
      <FeatureTreatment
        treatmentName={SHOW_MYHEALTH}
        onLoad={() => {}}
        onTimedout={() => {}}
        attributes={splitAttributes}
        invertBehavior
      >
        <GlobalError />
      </FeatureTreatment>
    </ReactAppWrapper>
  );
};

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <NextArrowImg
      alt=""
      className={className}
      onClick={onClick}
      src="/react/images/icn-arrow-right.svg"
      id="next-arrow-now-pow-slider"
    />
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <PrevArrowImg
      className={className}
      onClick={onClick}
      src="/react/images/icn-arrow-left.svg"
    />
  );
}

const Div = styled.div``;

const NextArrowImg = styled.div`
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.23);
  background-color: #fff;
  position: absolute;
  right: -15px;
  padding: 10px;
  border-radius: 50%;

  &::before {
    display: block;
    content: " ";
    background-image: ${(props) => props.src && `url(${props.src})`};
    background-size: 20px 20px;
    height: 20px;
    width: 20px;
    position: absolute;
    opacity: 1;
  }
`;

const PrevArrowImg = styled.div`
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.23);
  background-color: #fff;
  left: -15px;
  position: absolute;
  z-index: 2;
  padding: 10px;
  border-radius: 50%;

  &::before {
    display: block;
    content: " ";
    background-image: ${(props) => props.src && `url(${props.src})`};
    background-size: 20px 20px;
    height: 20px;
    width: 20px;
    position: absolute;
    opacity: 1;
  }
`;

const Container = styled.div`
  * {
    box-sizing: content-box;
  }
  /* overflow:hidden; */
  background-color: #f4f4f4;
  margin: 24px 15px 40px 15px;

  @media only screen and (min-width: 481px) and (max-width: 768px) {
    margin: 40px 100px;
  }

  @media only screen and (min-width: 769px) and (max-width: 1024px) {
    margin: 40px 50px;
  }

  @media only screen and (min-width: 1024px) {
    margin: 40px 50px;
  }
`;

const ReactAppWrapper = styled(MainContentContainer)`
  max-width: 1024px;
  position: relative;
  margin: auto;
  width: 100%;
`;

const MainDiv = styled.div`
  display: flex;
  padding-left: 5px;
  margin-bottom: 16px;
`;

const MainHeading = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  margin: ${(props) => props.isViewAllScreen && "20px 0 40px 0"};
`;

const BackLink = styled.a`
  display: flex;
  text-decoration: none !important;
  margin-bottom: 12px;
`;

const BackImg = styled.img`
  width: 20px;
  height: 20px;
  margin-top: -3px;
  margin-right: 2px;
`;

const BackText = styled.div`
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  color: #474b55;
`;

const MainImg = styled.img`
  width: 30px;
  height: 30px;
  margin-top: 10px;
`;

const Text = styled.div`
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #003863;
  margin-top: ${(props) => !props.viewAllFlag && "15px"};
  margin-left: ${(props) => !props.viewAllFlag && "10px"};
  word-break: break-word;
`;

const MainHeader = styled.div`
  font-size: 12px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 2;
  letter-spacing: 2px;
  color: #757575;
  width: 80%;
  word-break: break-word;
  text-transform: uppercase;

  @media only screen and (max-width: 1024px) {
    margin-top: 0px;
  }
`;

const CardRow = styled.div`
  margin-bottom: 40px;
`;

const Card = styled.div`
  padding: 16px 12px;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 #d8d8d8;
  background-color: #ffffff;
  height: 100px;
  overflow-y: auto;
  margin: 0 5px;
  cursor: pointer;
  word-break: break-word;
  /* -ms-overflow-style: none;
  scrollbar-width: none;
  
  &::-webkit-scrollbar { 
      display: none;
  } */
`;

const Title = styled.div`
  font-size: 12px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #003863;
  text-transform: uppercase;
`;

const SubHeader = styled.div`
  font-size: 15px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #474b55;
  margin-top: 10px;
`;

const Address = styled.div`
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #474b55;
  margin-top: 10px;
  cursor: pointer;
`;

const RightNav = styled.div`
  padding: 11px 10px 9px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.23);
  background: white url("/react/images/icn-arrow-right.svg") no-repeat center;
  border-radius: 25px;
  position: absolute;
  right: -7px;
  height: 20px;
  width: 20px;
  cursor: pointer;
  align-self: center;

  /* @media only screen and (max-width: 480px) {
    display: none;
  } */
`;

const LeftNav = styled.div`
  padding: 11px 10px 9px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.23);
  background: white url("/react/images/icn-arrow-left.svg") no-repeat center;
  border-radius: 25px;
  position: absolute;
  left: -7px;
  height: 20px;
  width: 20px;
  align-self: center;
  cursor: pointer;

  /* @media only screen and (max-width: 480px) {
    display: none;
  } */
`;

const ViewAll = styled.div`
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #008bbf;
  align-self: center;
  width: 20%;
  text-align: right;
  cursor: pointer;
`;

const ResultCount = styled.span`
  height: 18px;
  font-size: 14px;
  font-weight: 900;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  color: #474b55;
`;
const ResultLabel = styled.p`
  width: 100%;
  height: 18px;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  color: #474b55;
  padding: 8px 0px 8px 24px;
  margin: 10px 0px;
`;

const SortBy = styled.p`
  font-size: 12px;
  font-weight: 300;
  font-stretch: normal;
  font-style: italic;
  line-height: 1.5;
  letter-spacing: normal;
  color: #757575;
  padding: 10px 24px 8px 0px;
  margin: 8px 0px;
  text-align: right;
`;

const HorizontalDivider = styled.div`
  margin: 0px ${(props) => (props.hMargin ? props.hMargin : "0")}px;
  padding: 0px 0px;
  width: calc(100% - ${(props) => (props.hMargin ? props.hMargin * 2 : "0")}px);
  height: 1px;
  background-color: #eaeaea;
`;

const ResultItemWrapper = styled.div`
  padding: 14px 24px 14px 14px;
  display: flex;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 #d8d8d8;
  background-color: #ffffff;
  margin-bottom: 15px;
  cursor: pointer;
  word-break: break-word;
`;

const Distance = styled.div`
  height: 18px;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: italic;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: right;
  color: #474b55;
  padding: 0px;
  margin: 0px;
  white-space: nowrap;
`;

const ProviderIconContainer = styled.div`
  width: 40px;
  height: 40px;
  margin-right: 20px;
  display: list-item;
  ::marker {
    color: transparent;
  }
`;

const ProviderIcon = styled.img`
  width: 35px;
  height: 35px;
  display: list-item;
  object-fit: scale-down;
  position: relative;
  overflow: hidden;
  background-color: #ffffff;
  padding-left: 5px;
`;

const InlineInnerFixedContainer = styled.div`
  display: table-cell;
  align-self: ${(props) => props.align && props.align};
`;

const InlineInnerContainer = styled.div`
  display: table-cell;
  width: 100%;
  margin-right: 10px;
`;

const ProviderName = styled.p`
  width: 100%;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #474b55;
  padding: 0px;
  margin: 0px;
  line-height: 1.07;
  font-size: 15px;
`;

const ProviderPhone = styled.p`
  width: 100%;
  font-size: 13px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.42;
  letter-spacing: normal;
  color: #008bbf;
  margin: 10px 0px;
`;

const PhoneIcon = styled.img`
  height: 12px;
  display: inline-block;
  margin: 0px 2px 0px 0px;
`;

const PhoneNumberWrapper = styled.a`
  color: #008bbf !important;
  text-decoration: none;
  display: flex;
  align-items: center;
`;

const PhoneNumberIcon = styled.img`
  margin-right: 4px;
`;

const PhoneNumberText = styled.div``;

const ProviderAddress = styled.p`
  width: 100%;
  font-size: 12px;
  font-weight: 800;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #474b55;
  padding: 0px;
  margin-top: 6px;
`;

export default NowPowCategoryListPage;
