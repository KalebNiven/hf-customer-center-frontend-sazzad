import React, { useState, useEffect } from "react";
import Spinner from "../common/spinner";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { requestDigitalIdCard } from "../../store/actions/index";
import { useHistory } from "react-router-dom";
import customerInfo from "../../store/reducer/customerInfoReducer";
import { AnalyticsTrack } from "../../components/common/segment/analytics";
import {
    ANALYTICS_TRACK_TYPE,
    ANALYTICS_TRACK_CATEGORY,
} from "../../constants/segment";

const DigitalId = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const digitalIdCard = useSelector((state) => state.digitalIdCard.idCard);
    const digitalIdCardLoading = useSelector(
        (state) => state.digitalIdCard.loading
    );
    const customerInfo = useSelector((state) => state.customerInfo);
    useEffect(() => {
        dispatch(requestDigitalIdCard(props.member.memberId));
    }, []);
    const checkBenefitPackPPOM = () =>
        customerInfo.data.benefitPackage === "PPOM";
    const handleSegment = (label, data) => {
        AnalyticsTrack(label + " " + "link clicked", customerInfo, {
            raw_text: label,
            destination_url: window.location.pathname,
            description: data,
            category: ANALYTICS_TRACK_CATEGORY.memberIdCard,
            type: ANALYTICS_TRACK_TYPE.buttonClicked,
            targetMemberId: customerInfo?.data?.memberId,
            location: {
                desktop: {
                    width: 960,
                    value: "left",
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
        });
    };

    return (
        <DigitalIDContainer className="no-print">
            {digitalIdCardLoading == false ? (
                digitalIdCard["memberId"] == null ? null : (
                    <Container>
                        <div className="col-md-12 no-print">
                            <div className="digitalId-container">
                                <div className="row no-gutters">
                                    <div className="col-6">
                                        <img
                                            src="/react/images/Healthfirst Logo@2x.svg"
                                            alt=""
                                            width="100px"
                                        />
                                    </div>
                                </div>
                                <br />
                                <div className="row no-gutters">
                                    <div className="col-6 text-left">
                                        <div className="hf-text-heading-lg">
                                            {digitalIdCard["firstName"] +
                                                " " +
                                                digitalIdCard["lastName"]}
                                        </div>
                                        <div className="caption-bold">
                                            {digitalIdCard["planName"]}
                                        </div>
                                    </div>
                                </div>

                                <hr />
                                <div className="row no-gutters">
                                    <div className={window.innerWidth <= 820 ? "col-12" : "col-7"} style={window.innerWidth <= 820 ? {} : {paddingBottom : '1rem'}}>
                                        <div style={window.innerWidth <= 820 ? {} : {height : '100%', paddingBottom : '1rem'}}>
                                            <div className="row no-gutters">
                                                <div className="col-6 text-left caption-normal light-bold">
                                                    MEMBER ID
                                                </div>
                                                <div className="col-6 text-right caption-bold">
                                                    {digitalIdCard["memberId"]}
                                                </div>
                                            </div>

                                            {digitalIdCard["shouldShowGroupNumber"] !=
                                            null ? (
                                                <div className="row no-gutters">
                                                    <div className="col-6 text-left caption-normal light-bold">
                                                        GROUP NUMBER
                                                    </div>
                                                    <div className="col-6 text-right caption-bold">
                                                        {digitalIdCard["planGroupNumber"]}
                                                    </div>
                                                </div>
                                            ) : null}

                                            {digitalIdCard["individualDeductible"] !==
                                            null ? (
                                                <div className="row no-gutters">
                                                    <div className="col-6 text-left caption-normal light-bold pr-4">
                                                        INDIVIDUAL {(digitalIdCard["isIndividualOnly"] !== true && digitalIdCard["familyDeductible"] !== null) ? "/FAMILY " : ""} DEDUCTIBLE
                                                    </div>
                                                    <div className="col-6 text-right caption-bold">
                                                        {"$" + digitalIdCard["individualDeductible"]
                                                            + ((digitalIdCard["isIndividualOnly"] !== true && digitalIdCard["familyDeductible"] !== null) ? "/$" + digitalIdCard["familyDeductible"]: "")}
                                                        {checkBenefitPackPPOM() && (
                                                            <sup>*</sup>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="row no-gutters"></div>
                                            )}
                                        </div>
                                        <BottomDivider />
                                    </div>
                                    <div className={window.innerWidth <= 820 ? "col-12" : "col-5"} style={window.innerWidth <= 820 ? {} : {paddingLeft : '2rem', paddingBottom : '1rem'}}>
                                        {digitalIdCard["showPharmacyBlock"] ? (
                                            <div style={window.innerWidth <= 820 ? {} : {height : '100%', paddingBottom : '1rem'}}>
                                                {digitalIdCard["pharmacyRXBin"] !=
                                                null ? (
                                                    <div className="row no-gutters">
                                                        <div className="col-6 text-left caption-normal light-bold">
                                                            RX BIN
                                                        </div>
                                                        <div className="col-6 text-right caption-bold">
                                                            {
                                                                digitalIdCard[
                                                                    "pharmacyRXBin"
                                                                ]
                                                            }
                                                        </div>
                                                    </div>
                                                ) : null}

                                                {digitalIdCard["pharmacyRXPNC"] !=
                                                null ? (
                                                    <div className="row no-gutters">
                                                        <div className="col-6 text-left caption-normal light-bold">
                                                            RX PCN
                                                        </div>
                                                        <div className="col-6 text-right caption-bold">
                                                            {
                                                                digitalIdCard[
                                                                    "pharmacyRXPNC"
                                                                ]
                                                            }
                                                        </div>
                                                    </div>
                                                ) : null}

                                                {digitalIdCard["pharmacyGroup"] !=
                                                null ? (
                                                    <div className="row no-gutters">
                                                        <div className="col-6 text-left caption-normal light-bold">
                                                            RX GROUP
                                                        </div>
                                                        <div className="col-6 text-right caption-bold">
                                                            {
                                                                digitalIdCard[
                                                                    "pharmacyGroup"
                                                                ]
                                                            }
                                                        </div>
                                                    </div>
                                                ) : null}
                                            </div>
                                        ) : null}
                                        <BottomDivider />
                                    </div>
                                </div>
                                <div className="row no-gutters">
                                {digitalIdCard["showProviderBlock"] == true ? (
                                    <div className={window.innerWidth <= 820 ? "col-12" : "col-7"}>
                                        <div>
                                            <div className="caption-normal light-bold">
                                                PRIMARY CARE PROVIDER
                                            </div>
                                            {digitalIdCard["providerName"] !=
                                                null ||
                                            digitalIdCard["providerName"] != "" ? (
                                                <div>
                                                    <div className="caption-large mb-3">
                                                        {digitalIdCard[
                                                            "providerName"
                                                        ] +
                                                            ", " +
                                                            digitalIdCard[
                                                                "providerTitle"
                                                            ]}
                                                    </div>

                                                    <IconBulletItem
                                                        className="icon-bullet-item mb-3"
                                                        onClick={() =>
                                                            handleSegment(
                                                                "GoogleAddress",
                                                                digitalIdCard[
                                                                    "providerAddress"
                                                                ]
                                                            )
                                                        }
                                                    >
                                                        <img
                                                            src="/react/images/other/ico-pin.svg"
                                                            height="14"
                                                            alt=""
                                                        />
                                                        <p className="body-text link-blue2">
                                                            {
                                                                digitalIdCard[
                                                                    "providerAddress"
                                                                ]
                                                            }
                                                        </p>
                                                    </IconBulletItem>

                                                    <IconBulletItem
                                                        className="icon-bullet-item mb-3"
                                                        onClick={() =>
                                                            handleSegment(
                                                                "PhoneNumber",
                                                                digitalIdCard[
                                                                    "providerPhone"
                                                                ]
                                                            )
                                                        }
                                                    >
                                                        <img
                                                            src="/react/images/other/ico-phone.svg"
                                                            height="14"
                                                            alt=""
                                                        />
                                                        <Tel
                                                            href={`tel:${digitalIdCard["providerPhone"]}`}
                                                        >
                                                            {" "}
                                                            {
                                                                digitalIdCard[
                                                                    "providerPhone"
                                                                ]
                                                            }
                                                        </Tel>
                                                    </IconBulletItem>
                                                </div>
                                            ) : (
                                                <div>PCP Info Unavailable</div>
                                            )}
                                        </div>
                                    </div>
                                ) : null}
                                
                                <div className={window.innerWidth <= 820 ? "col-12" : "col-5"} style={window.innerWidth <= 820 ? {} : {paddingLeft : '2rem'}}>
                                {digitalIdCard["showOutOfPocketBlock"] ==
                                true ? (
                                    <>
                                        <div className="col-12 caption-small light-bold mb-2" style={{paddingLeft : '0'}}>
                                            OUT OF POCKET COSTS
                                        </div>

                                            {digitalIdCard["pcpTotal"] !==
                                            null ? (
                                                <div className="row no-gutters caption-small light-bold mb-2 digital-card-field">
                                                    <div className="col-11 text-left" style={{paddingLeft : '0'}}>
                                                        <span>
                                                            PCP Office Visit{' '}
                                                        </span>
                                                        {digitalIdCard[
                                                            "pcpIsAdmitted"
                                                        ] ? (
                                                            <EmerRoomLabel className="caption-small">
                                                                (Waived if
                                                                admitted)
                                                            </EmerRoomLabel>
                                                        ) : null}
                                                    </div>
                                                    <div className="col-1 text-right">
                                                        <span className="bold">
                                                            {digitalIdCard[
                                                                "pcpIsPercentage"
                                                            ]
                                                                ? digitalIdCard[
                                                                      "pcpTotal"
                                                                  ] + "%"
                                                                : "$" +
                                                                  digitalIdCard[
                                                                      "pcpTotal"
                                                                  ]}
                                                        </span>
                                                        {checkBenefitPackPPOM() && (
                                                            <sup>*</sup>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : null}

                                            {digitalIdCard[
                                                "specialistVisitTotal"
                                            ] !== null ? (
                                                <div className="row no-gutters caption-small light-bold mb-2 digital-card-field">
                                                    <div className="col-11 text-left">
                                                        <span>
                                                            Specialist Office
                                                            Visit{' '}
                                                        </span>
                                                        {digitalIdCard[
                                                            "specialistVisitIsAdmitted"
                                                        ] ? (
                                                            <EmerRoomLabel className="caption-small">
                                                                (Waived if
                                                                admitted)
                                                            </EmerRoomLabel>
                                                        ) : null}
                                                    </div>
                                                    <div className="col-1 text-right">
                                                        <span className="bold">
                                                            {digitalIdCard[
                                                                "specialistVisitIsPercentage"
                                                            ]
                                                                ? digitalIdCard[
                                                                      "specialistVisitTotal"
                                                                  ] + "%"
                                                                : "$" +
                                                                  digitalIdCard[
                                                                      "specialistVisitTotal"
                                                                  ]}
                                                        </span>
                                                        {checkBenefitPackPPOM() && (
                                                            <sup>*</sup>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : null}

                                            {digitalIdCard[
                                                "urgentCareTotal"
                                            ] !== null ? (
                                                <div className="row no-gutters caption-small light-bold mb-2 digital-card-field">
                                                    <div className="col-11 text-left">
                                                        <span>Urgent Care{' '}</span>
                                                        {digitalIdCard[
                                                            "urgentCareIsAdmitted"
                                                        ] ? (
                                                            <EmerRoomLabel className="caption-small">
                                                                (Waived if
                                                                admitted)
                                                            </EmerRoomLabel>
                                                        ) : null}
                                                    </div>
                                                    <div className="col-1 text-right">
                                                        <span className="bold">
                                                            {digitalIdCard[
                                                                "urgentCareIsPercentage"
                                                            ]
                                                                ? digitalIdCard[
                                                                      "urgentCareTotal"
                                                                  ] + "%"
                                                                : "$" +
                                                                  digitalIdCard[
                                                                      "urgentCareTotal"
                                                                  ]}
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : null}
                                            {digitalIdCard["emergencyTotal"] !==
                                            null ? (
                                                <div className="row no-gutters caption-small light-bold mb-2 digital-card-field">
                                                    <div className="col-11 text-left">
                                                        <span>
                                                            Emergency Room{' '}
                                                        </span>
                                                        {digitalIdCard[
                                                            "emergencyIsAdmitted"
                                                        ] ? (
                                                            <EmerRoomLabel className="caption-small">
                                                                (Waived if
                                                                admitted)
                                                            </EmerRoomLabel>
                                                        ) : null}
                                                    </div>
                                                    <div className="col-1 text-right">
                                                        <span className="bold">
                                                            {digitalIdCard[
                                                                "emergencyIsPercentage"
                                                            ]
                                                                ? digitalIdCard[
                                                                      "emergencyTotal"
                                                                  ] + "%"
                                                                : "$" +
                                                                  digitalIdCard[
                                                                      "emergencyTotal"
                                                                  ]}
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : null}

                                            {digitalIdCard["teladocTotal"] !==
                                            null ? (
                                                <div className="row no-gutters caption-small light-bold mb-2 digital-card-field">
                                                    <div className="col-11 text-left">
                                                        <span>Teladoc{' '}</span>
                                                        {digitalIdCard[
                                                            "teladocIsAdmitted"
                                                        ] ? (
                                                            <EmerRoomLabel className="caption-small">
                                                                (Waived if
                                                                admitted)
                                                            </EmerRoomLabel>
                                                        ) : null}
                                                    </div>
                                                    <div className="col-1 text-right">
                                                        <span className="bold">
                                                            {digitalIdCard[
                                                                "teladocIsPercentage"
                                                            ]
                                                                ? digitalIdCard[
                                                                      "teladocTotal"
                                                                  ] + "%"
                                                                : "$" +
                                                                  digitalIdCard[
                                                                      "teladocTotal"
                                                                  ]}
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : null}

                                            {digitalIdCard[
                                                "nurseHelplineTotal"
                                            ] !== null ? (
                                                <div className="row no-gutters caption-small light-bold mb-2 digital-card-field">
                                                    <div className="col-11 text-left">
                                                        <span>
                                                            Nurse Help Line{' '}
                                                        </span>
                                                        {digitalIdCard[
                                                            "nurseHelplineIsAdmitted"
                                                        ] ? (
                                                            <EmerRoomLabel className="caption-small">
                                                                (Waived if
                                                                admitted)
                                                            </EmerRoomLabel>
                                                        ) : null}
                                                    </div>
                                                    <div className="col-1 text-right">
                                                        <span className="bold">
                                                            {digitalIdCard[
                                                                "nurseHelplineIsPercentage"
                                                            ]
                                                                ? digitalIdCard[
                                                                      "nurseHelplineTotal"
                                                                  ] + "%"
                                                                : "$" +
                                                                  digitalIdCard[
                                                                      "nurseHelplineTotal"
                                                                  ]}
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : null}
                                        {checkBenefitPackPPOM() && (
                                            <div className="light-bold col-6 caption-small light-bold mb-2 digital-card-field">
                                                <sup>*</sup>In network cost
                                                shares
                                            </div>
                                        )}
                                        </>
                                ) : null}

                                {digitalIdCard["prescriptionsTierOneTotal"] !==
                                null ? (
                                        <div className="row no-gutters caption-small light-bold mb-2 digital-card-field">
                                            <div className="col-6 text-left">
                                                <span>Prescriptions Room</span>
                                            </div>
                                            <div className="col-6 text-right">
                                                <span className="bold">
                                                    {digitalIdCard[
                                                        "prescriptionsTierOneIsPercentage"
                                                    ]
                                                        ? digitalIdCard[
                                                              "prescriptionsTierOneTotal"
                                                          ] + "%"
                                                        : "$" +
                                                          digitalIdCard[
                                                              "prescriptionsTierOneTotal"
                                                          ]}
                                                    {"/"}
                                                    {digitalIdCard[
                                                        "prescriptionsTierTwoIsPercentage"
                                                    ]
                                                        ? digitalIdCard[
                                                              "prescriptionsTierTwoTotal"
                                                          ] + "%"
                                                        : "$" +
                                                          digitalIdCard[
                                                              "prescriptionsTierTwoTotal"
                                                          ]}
                                                    {"/"}
                                                    {digitalIdCard[
                                                        "prescriptionsTierThreeIsPercentage"
                                                    ]
                                                        ? digitalIdCard[
                                                              "prescriptionsTierThreeTotal"
                                                          ] + "%"
                                                        : "$" +
                                                          digitalIdCard[
                                                              "prescriptionsTierThreeTotal"
                                                          ]}
                                                </span>
                                            </div>
                                        </div>
                                ) : null}
                                </div>
                                <hr />

                                <div className="row no-gutters">
                                    <div className="col-12">
                                        <p className="caption-small">
                                            To avoid penalties and ensure timely
                                            care management, your provider must
                                            call Healthfirst at least{" "}
                                            <strong>24 hours</strong> in advance
                                            for any services requiring{" "}
                                            <strong>prior authorization </strong>
                                            and within <strong>
                                                48 hours
                                            </strong>{" "}
                                            of{" "}
                                            <strong>
                                                emergency admissions
                                            </strong>
                                            . Failure to call may reduce your
                                            benefits. Services requiring prior
                                            authorization are described in your
                                            benefit materials.
                                        </p>
                                        <div style={{ lineHeight: "1rem" }}>
                                            <br />
                                        </div>
                                        <p className="caption-small">
                                            This card does not guarantee
                                            coverage. You must comply with all
                                            terms and conditions of the plan.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </Container>
                )
            ) : (
                <Container>
                    <ProgressWrapper>
                        <Spinner />
                    </ProgressWrapper>
                </Container>
            )}
        </DigitalIDContainer>
    );
};

const IconBulletItem = styled.div`
    &:hover {
        text-decoration: underline;
    }
    &:hover p {
        color: #2a6a9e;
    }
`;
const DigitalIDContainer = styled.div`
    height: 100%;
    max-width: 1024px;
    position: relative;
    margin: auto;
`;

const Container = styled.div`
    font-family: museo-sans;
    > div {
        @media only screen and (max-width: 480px) {
            padding: 0;
        }
    }
`;

const BottomDivider = styled.div`
    @media only screen and (max-width: 820px) {
        margin-top: 1rem;
        margin-bottom: 1rem;
    }
    border: 0;
    border-bottom: 1px solid rgba(0,0,0,.1);
`;

const ProgressWrapper = styled.div`
    width: 100%;
    margin-top: 10px;
    margin-bottom: 10px;
`;

const Tel = styled.a`
    cursor: default;
    text-decoration: none;
    color: #008bbf !important;
`;

const EmerRoomLabel = styled.span`
    color: #707173;
    font-size: 12px;
    line-height: 16px;
`;

export default DigitalId;
