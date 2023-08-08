import React, { useCallback, Suspense } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import styled from "styled-components";
import Spinner from "../common/spinner";

const mapContainerStyle = {
  height: "100%",
  width: "100%",
};

const options = {
  disableDefaultUI: true,
  zoomControl: false,
  clickableIcons: false,
  draggable: false,
  styles: [
    {
      featureType: "poi.business",
      stylers: [{ visibility: "off" }],
    },
  ],
};

const DetailsMap = ({ mapRef, location }) => {

  /* callbacks */
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  return (
    location != null &&
    <MapContainer>
      <Suspense fallback={<Spinner />}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={18}
          center={location}
          options={options}
          onLoad={onMapLoad}
        >
          <Marker
            key={`${location.lat}-${location.lng}`}
            position={{ lat: location.lat, lng: location.lng }}
          />
        </GoogleMap>
      </Suspense>
    </MapContainer>
  );
};

const MapContainer = styled.div`
  width: 100%;
  height: 200px;
`;

export default React.memo(DetailsMap);