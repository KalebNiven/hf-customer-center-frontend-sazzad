import React, { useRef, useEffect, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { useLocation } from "react-router-dom";

import Details from "./details";
import { getIndMapDetails } from '../../store/actions/index';
import Spinner from "../common/spinner";

import DetailsMap from './detailsMap'
import { MainContentContainer } from "../common/styles";
import { SHOW_MYHEALTH } from "../../constants/splits";
import { FeatureTreatment } from "../../libs/featureFlags";
import GlobalError from "../common/globalErrors/globalErrors";

const NowPowDetailsView = () => {
    /* states */
    const mapRef = useRef();
    const details = useSelector((state) => state.myHealth.indMapDetails);
    const customerInfo = useSelector((state) => state.customerInfo);

    const splitAttributes = {
      lob: customerInfo.data.sessLobCode,
      companyCode: customerInfo.data.companyCode,
      benefitPackage: customerInfo.data.benefitPackage,
      membershipStatus: customerInfo.data.membershipStatus,
      accountStatus: customerInfo.data.accountStatus,
    }

    /* hooks */
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        let state = location.state;
        //Get Details Map page data from API
        dispatch(getIndMapDetails({ resourceTypeId: state.resTypeId, resourceId: state.resId, lat: state.lat, lon: state.lon, categoryId: state.categoryId, categoryIconId: state.iconId, csrf: customerInfo?.data?.csrf }));
    }, []);

    return (
        <Suspense fallback={<Spinner />}>
        <MainContainer>
        <FeatureTreatment
            treatmentName={SHOW_MYHEALTH}
            onLoad={() => { }}
            onTimedout={() => { }}
            attributes={splitAttributes}
          >
           { details?.location && <DetailsMap mapRef={mapRef} location={{ lat: details.location.latitude, lng: details.location.longitude }} /> }
            <Container>
                <Details
                historyState={location.state}
                />
            </Container>
          </FeatureTreatment>
          <FeatureTreatment
            treatmentName={SHOW_MYHEALTH}
            onLoad={() => { }}
            onTimedout={() => { }}
            attributes={splitAttributes}
            invertBehavior
          >
            <GlobalError/>
          </FeatureTreatment>
            
            </MainContainer>
            

        </Suspense>
    );
}
const MainContainer = styled(MainContentContainer)``;

const Container = styled.div`
  position: relative;
  margin-top: -120px;
  padding: 0px 144px;
  background-color: transparent;
  width: -webkit-fill-available;

  @media only screen and (max-width: 1280px) {
    padding: 0px 144px;
  }

  @media only screen and (max-width: 960px) {
    padding: 0px 150px;
  }

  @media only screen and (max-width: 600px) {
    padding: 0px 16px;
  }
`;

export default React.memo(NowPowDetailsView);
