import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Container } from "./styles";
import styled from "styled-components";
import VideoPopupPlayer from "./videoPopupPlayerModal";
import { AnalyticsTrack } from "../common/segment/analytics";
import {
  ANALYTICS_TRACK_CATEGORY,
  ANALYTICS_TRACK_TYPE,
} from "../../constants/segment";
import { getCoverageBenefitsVideos } from "../../store/saga/apis";
import { getSelectedLang } from "../auth/login/languageSelection.js";

const CoverageBenefitsVideoCards = (props) => {
  const customerInfo = useSelector((state) => state.customerInfo);
  const [videoData, setVideoData] = useState([]);
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentEmbedLink, setCurrentEmbedLink] = useState("");
  const [currentVideoName, setCurrentVideoName] = useState("");

  useEffect(() => {
    let isMounted = true;
    let language;
    switch (getSelectedLang()) {
      case "es":
        language = "Spanish";
        break;
      case "zh":
        language = "Chinese";
        break;
      default:
        language = "English";
    }
    getCoverageBenefitsVideos(
      language,
      props.companyCode,
      props.benefitPackage,
      props.membershipStatus
    ).then((data) => {
      if (isMounted) {
        setVideoData(data);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [
    customerInfo.data.language,
    props.companyCode,
    props.membershipStatus,
    props.benefitPackage,
  ]);

  const handleVideoCardClick = (videoName, embedUrl) => {
    //segment tracker
    AnalyticsTrack(videoName + " video clicked", customerInfo, {
      raw_text: videoName,
      destination_url: null,
      description: videoName,
      category: ANALYTICS_TRACK_CATEGORY.coverageAndBenefits,
      type: ANALYTICS_TRACK_TYPE.videoClicked,
      targetMemberId: customerInfo.memberId,
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

    displayVideo(videoName, embedUrl);
  };

  const displayVideo = (videoName, embedLink) => {
    setShowPlayer(true);
    setCurrentEmbedLink(embedLink);
    setCurrentVideoName(videoName);
  };

  const formatDuration = (duration) => {
    let durationMinutes = Math.floor(duration / 60);
    let durationSeconds = duration % 60;
    durationSeconds =
      durationSeconds < 10 ? `0${durationSeconds}` : durationSeconds;

    let time = `${durationMinutes}:${durationSeconds}`;

    return time;
  };

  const toggleVideo = () => {
    //segment tracking
    AnalyticsTrack(
      currentVideoName + " video close icon clicked",
      customerInfo,
      {
        raw_text: "video close icon",
        destination_url: null,
        category: ANALYTICS_TRACK_CATEGORY.coverageAndBenefits,
        type: ANALYTICS_TRACK_TYPE.buttonClicked,
        targetMemberId: customerInfo.memberId,
        location: {
          desktop: {
            width: 1024,
            value: "right",
          },
          tablet: {
            width: 768,
            value: "right",
          },
          mobile: {
            width: 0,
            value: "right",
          },
        },
      }
    );

    setShowPlayer(false);
    setCurrentEmbedLink("");
  };
  return (
    videoData.length > 0 && (
      <BenefitVideoContainer>
        <VideoContainerHeader>
          How to Utilize Your Benefits
        </VideoContainerHeader>
        <VideoCardContainer>
          {videoData &&
            videoData.map((video) => (
              <VideoCard
                key={video.videoId}
                onClick={() => {
                  handleVideoCardClick(video.name, video.player_embed_url);
                }}
              >
                <VideoCardImgContainer>
                  <VideoCardImg
                    onMouseOver={(e) =>
                      (e.currentTarget.src =
                        video.pictures.sizes[5].link_with_play_button)
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.src = video.pictures.sizes[5].link)
                    }
                    alt={video.name}
                    src={video.pictures.sizes[5].link}
                  ></VideoCardImg>
                  <VideoDurationContainer>
                    {formatDuration(video.duration)}
                  </VideoDurationContainer>
                </VideoCardImgContainer>
                <VideoCardTitle>{video.name}</VideoCardTitle>
              </VideoCard>
            ))}
        </VideoCardContainer>
        {showPlayer && (
          <VideoPopupPlayer
            toggleVideo={toggleVideo}
            embedLink={currentEmbedLink}
          ></VideoPopupPlayer>
        )}
      </BenefitVideoContainer>
    )
  );
};

export default CoverageBenefitsVideoCards;

const BenefitVideoContainer = styled(Container)`
  margin-top: 2.5rem;
  @media only screen and (min-width: 768px) {
    margin-bottom: 2.5rem;
  }
  @media only screen and (max-width: 768px) {
    margin-bottom: 56px;
  }
`;

const VideoCardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  @media only screen and (max-width: 768px) {
    justify-content: space-between;
  }
  @media only screen and (max-width: 480px) {
    justify-content: center;
  }
`;

const VideoCard = styled.div`
  width: 30%;
  margin-right: 2rem;
  margin-top: 1rem;
  @media only screen and (max-width: 768px) {
    width: 49%;
    margin-right: 0;
  }
  @media only screen and (max-width: 480px) {
    width: 95%;
  }
  &:hover > p {
    color: #008bbf;
  }
`;
const VideoCardImgContainer = styled.div`
  overflow: hidden;
  display: inline-block;
  border-radius: 8px;
  position: relative;
`;

const VideoCardImg = styled.img`
  width: 100%;
  transition: 0.3s all ease-in-out;
  &:hover {
    cursor: pointer;
    transform: scale(1.1);
  }
`;

const VideoContainerHeader = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #003863;
  margin-bottom: 1.125rem;
  @media only screen and (max-width: 480px) {
    padding-left: 16px;
  }
`;

const VideoCardTitle = styled.p`
  color: #003863;
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
`;

const VideoDurationContainer = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 0.5rem;
  display: block;
  background-color: black;
  color: white;
  padding: 4px;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  border-radius: 4px;
`;
