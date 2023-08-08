import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {requestCategories } from '../../store/actions/index';
import Spinner from '../common/spinner'
import { useAppContext } from '../../AppContext'
import { AnalyticsTrack } from "../common/segment/analytics";
import { ANALYTICS_TRACK_TYPE, ANALYTICS_TRACK_CATEGORY } from "../../constants/segment";

const NowPowSection = () => {
    const [showMore, setShowMore] = useState(false);
    const [splitData, setSplitData] = useState([]);
    const [enteredZip, setEnteredZip] = useState("")
    const [zipInputError, setZipInputError] = useState("")

    const { innerWidth } = useAppContext()

    const history = useHistory();
    const dispatch = useDispatch();

    const categories = useSelector((state) => state.myHealth.categories);
    const loading = useSelector((state) => state.myHealth.loading);
    const iconObject = useSelector((state) => state.myHealth.icon);
    const customerInfo = useSelector((state) => state.customerInfo.data);

    // on mount get the categories result from the service
    useEffect(() => {
        dispatch(requestCategories())
    }, []);

    useEffect(() => {
      setEnteredZip(customerInfo.zipcode)
  }, [customerInfo.zipcode]);

    useEffect(() => {
        const categoriesList = [...categories]
        let splitData = [];
        const len = innerWidth >= 768 ? 3 : 2;

        while (categoriesList && categoriesList.length) {
        splitData.push(categoriesList.splice(0, len));
        }
        setSplitData(splitData);
    }, [categories, innerWidth]);

    const handleCategory = async (id, iconId, title) => {
        // Segment Track
        AnalyticsTrack(
          title + " Community Resources Category Button Clicked", 
          { data: {...customerInfo} },
          {
              "raw_text": title, 
              "description": title,
              "destination_url": window.location.origin + "/communityResources/category", 
              "category": ANALYTICS_TRACK_CATEGORY.myHealth, 

              "type": ANALYTICS_TRACK_TYPE.buttonClicked, 
              "targetMemberId": customerInfo.memberId,
              "location": {
                  "desktop":{
                      "width": 1024,
                      "value": "bottom center"
                  },
                  "tablet":{
                      "width": 768,
                      "value": "bottom center"
                  },
                  "mobile":{
                      "width": 0,
                      "value": "bottom center"
                  }
              }
          }
        );

        if(!enteredZip || enteredZip.length !== 5) return setZipInputError("Invalid zip.");
        await getLatLngByZipcode(enteredZip).then((response) => {
          history.push({
            pathname: "/communityResources/category",
            state: {
              categoryId: id,
              iconId,
              title,
              lat: response[0],
              lon: response[1],
              zip: enteredZip
            }
          });
        });
    }

    const getLatLngByZipcode = async (zipcode) => {
        let geocoder = new google.maps.Geocoder();
        let address = zipcode;
        let latitude, longitude;
        return new Promise((resolve, reject) => {
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              latitude = results[0].geometry.location.lat();
              longitude = results[0].geometry.location.lng();
              resolve([latitude, longitude]);
            } else {
              if(status === google.maps.GeocoderStatus.ZERO_RESULTS) {
                setZipInputError("Nothing found. Try different zip.")
              } else {
                setZipInputError("Something went wrong. Try again.")
              }
            }
        });
        });
    }
    const displayCategories = () => {
        const maxIdx = innerWidth >= 768 ? 3 : 5;
        let origIndex = 0;
        let cardData = splitData?.map((data, index) => {
        if(index < maxIdx) {
            return (
            <CardRow key={index}>
            {
                data?.map((row, index) => {
                return (<Card innerWidth={innerWidth} key={index} space={data.length === (index+1)} onClick={() => handleCategory(row.id, row.iconId, row.name)} >
                    { iconObject && <CardImg src={`data:image/svg;base64,${iconObject[origIndex++]?.data?.icon}`} />}
                    <Text>{row?.name}</Text>
                </Card>)
                }) 
            }
            </CardRow>
            )
        }
        })
        return cardData;
    }

    const handleShowMore = () => {
        setShowMore(true);
    }

    const displayAllCategories = () => {
        const maxIdx = innerWidth >= 768 ? 3 : 5;
        let origIndex = innerWidth >= 768 ? 9 : 10;
        let displayComp = splitData?.map((data, index) => {
        if(index >= maxIdx) {
            return (
            <CardRow key={index}>
            {
                data.map((row, index) => {
                return (<Card innerWidth={innerWidth} key={index} space={data.length === (index+1)} onClick={() => handleCategory(row.id, row.iconId, row.name)} >
                    { iconObject && <CardImg src={`data:image/svg;base64,${iconObject[origIndex++]?.data?.icon}`} />}
                    <Text>{row?.name}</Text>
                </Card>)
                }) 
            }
            </CardRow>
            )
        }
        })
        return displayComp;
    }

    const handleZipCodeChange = (e) => {
      const value = e.target.value;
      if(value.length > 5) return;
      setZipInputError("");
      setEnteredZip(value)
    }
    
    return (
        <ReactAppWrapper>
            <Container>
                <Header>Community Resources</Header>
                <SubText>The Community Resources are provided for your information only and are not covered by your Healthfirst plan.</SubText>
                <SubHeader>Find Resources Near</SubHeader>
                <InputOuter hasError={zipInputError.length}>
                  <MapImg src={`/react/images/${zipInputError.length ? "icn-map-red.svg" : "icn-map.svg"}`}/>
                  <InputBox type="number" onChange={handleZipCodeChange} value={enteredZip} placeholder="Enter a Zip Code" hasError={zipInputError.length}></InputBox>
                </InputOuter>
                { zipInputError.length > 0 && <ZipErrorText>{zipInputError}</ZipErrorText>}
                <HorizontalDivider />
                <Browse>Browse by Category</Browse>
                { loading ? <Spinner /> : displayCategories() }
                { splitData.length > 3 ?
                !showMore ? <ShowMore onClick={handleShowMore}>Show More</ShowMore> :
                displayAllCategories() : ''}
            </Container>
        </ReactAppWrapper>
    )
}

const Header = styled.div`
  font-family: "museo-sans", san-serif;
  font-size: 24px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #003863;

  @media only screen and (max-width: 480px) {
    margin: 0 15px;
  }
`;

const Container = styled.div`
  * {
    box-sizing: content-box;
  }
  background-color:#f4f4f4;
  margin: 20px 0 40px 0;

  @media only screen and (min-width: 481px) and (max-width: 769px) {
    margin: 20px 100px 40px 100px;
  }

  /* @media only screen and (min-width: 769px) and (max-width: 1024px) {
    margin: 40px 50px;
  } */
`;

const ReactAppWrapper = styled.div`
  max-width: 1024px;
  position: relative;
  margin: auto;
`;

const HorizontalDivider = styled.div`
  height: 1px;
  background-color: #d8d8d8  ;
  width:100%;
  margin: 20px 0;

  @media only screen and (max-width: 480px) {
    margin: 10px 15px;
    width: auto;
  }
`;

const SubText = styled.div`
  margin: 24px 0px;
  flex-grow: 0;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  text-align: left;
  color: #474b55;

  @media only screen and (max-width: 480px) {
    margin: 24px 15px;
  }
`;

const SubHeader = styled.div`
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #003863;

  @media only screen and (max-width: 480px) {
    margin: 0 15px;
  }
`;

const Browse = styled.div`
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #003863;
  margin: 45px 0 20px 0;

  @media only screen and (max-width: 480px) {
    margin: 45px 15px 20px;
  }
`;

const InputOuter = styled.div`
  border-radius: 4px;
  border: ${props => props.hasError ? "solid 1px #ad122a" : "solid 1px #a8abac"};
  background-color: #ffffff;
  display:flex;
  height: 40px;
  margin-top: 9px;
  max-width: 338px;

  @media only screen and (max-width: 480px) {
    margin: 10px 15px 15px 15px;
    max-width: none;
  }
`;

const ZipErrorText = styled.div`
  font-size: 12px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #ad122a;
  margin-top: 10px;
`;

const MapImg = styled.img`
  width: 16px;
  height: 16px;
  padding: 10px;
`;

const InputBox = styled.input`
  background-color: #ffffff;
  height: 38px;
  border: none;
  font-size: 16px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: ${props => props.hasError ? "#ad122a" : "#474b55"};

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type=number] {
    -moz-appearance: textfield;
  }
`;

const CardRow = styled.div`
  display: flex;
  margin-bottom: 15px;

  @media only screen and (max-width: 480px) {
    margin: 0 15px 8px 15px;
  }

  @media only screen and (max-width: 768px) {
    margin-bottom: 8px;
  }
`;

const Card = styled.div`
  padding: 16px 8px 26px;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 #d8d8d8;
  background-color: #ffffff;
  /* width: 33%; */
  flex: 33% 1 1;
  cursor: pointer;
  ${props => !props.space && 'margin-right: 16px'};
  flex: ${props => props.innerWidth >= 768 ? "33% 1 1" : "flex: 45% 1 1"};
  width: ${props => props.innerWidth <= 768 && "45%"};
  padding: ${props => props.innerWidth <= 768 && "16px"};
  margin-right: ${props => props.innerWidth <= 768 && "8px"};
`;

const CardImg = styled.img`
  width: 32px;
  height: 32px;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

const Text = styled.div`
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: center;
  color: #474b55;
  margin-top: 10px;
`;

const ShowMore = styled.div`
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #008bbf;
  cursor: pointer;
  padding-top: 10px;
  &:hover{
    color: #2A6A9E;
    text-decoration: underline;
  }
`;

export default NowPowSection