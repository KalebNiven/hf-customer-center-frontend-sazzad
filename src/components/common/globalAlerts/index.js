import React from 'react'
import styled from 'styled-components';
import { ALERT_STYLES, ALERT_TYPES, LINK_TYPES } from './config'
import ExternalSiteLink from '../../common/externalSiteLink'
import { SHOW_GLOBAL_ALERTS } from "../../../constants/splits";
import { FeatureTreatment } from "../../../libs/featureFlags";

const GlobalAlerts = ({ alertsList }) => {
    const generateBackgroundColor = (alertType) => {
        switch(alertType) {
            case ALERT_TYPES.WARNING:
                return ALERT_STYLES.WARNING;
            default:
                return ALERT_STYLES.DEFAULT;
        }
    }

    const generateLinkComponent = (link, styles) => {
        if(link.link_type === LINK_TYPES.INTERNAL) {
            const handleClick = (url) => {
                return window.location.href = url;
            }
            return <BannerLink key={link.id} onClick={() => handleClick(link.link_url)} textColor={styles.textColor}>{link.link_text}</BannerLink>
        }
        if(link.link_type === LINK_TYPES.EXTERNAL) {
            return <ExternalSiteLink key={link.id} link={link.link_url} target="_blank" label = "GlobalAlerts"  styles={{cursor: "pointer"}}>
                <BannerLink textColor={styles.textColor}>{link.link_text}</BannerLink>
            </ExternalSiteLink>
        }
    }

    return (
        <FeatureTreatment
            treatmentName={SHOW_GLOBAL_ALERTS}
            onLoad={() => { }}
            onTimedout={() => { }}
        >
            <Wrapper>
                {
                    alertsList.map(alert => {
                        const { id, alert_type, alert_data: { alert_message, alert_links } } = alert;
                        const styles = generateBackgroundColor(alert_type);
                        return (
                            <Banner className="no-print" id="bannerContent" key={id}>
                                <BannerContent bgColor={styles.bgColor}>
                                    <BannerIcon alt = "" src={styles.icon} />
                                    <BannerText textColor={styles.textColor}>{alert_message}{alert_links.map(link => 
                                        generateLinkComponent(link, styles)
                                    )}</BannerText>
                                </BannerContent>
                            </Banner>
                        )
                    })
                }
            </Wrapper>
        </FeatureTreatment>
    )
}

export const Wrapper = styled.div`
    position: relative;
    z-index: 201;
`;

export const Banner = styled.div`
`;

export const BannerContent = styled.div`
    min-height: 48px;
    background-color: ${props => props.bgColor && props.bgColor};
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 14px 16px;
`;

export const BannerText = styled.p`
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.43;
    letter-spacing: normal;
    color: ${props => props.textColor && props.textColor};
`;

export const BannerIcon = styled.img`
  margin-right: 12px;
  align-self: baseline;
`;

export const BannerLink = styled.span`
    font-weight: 700;
    text-decoration: underline;
    color: ${props => props.textColor && props.textColor};
    margin-left: 3px;
    cursor: pointer;
`;

export default GlobalAlerts
