import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { MyDocuments, SubTitle } from "./style";
import { useDispatch, useSelector } from "react-redux";
import useOnClickOutside from "../documents/useOnClickOutside";
import { Language, DependentBlockWrapper } from "../common/styles";
import DependentBlock from "../common/dependentBlock";
import Spinner from "../common/spinner";
import { requestCCFormsDocs } from "../../store/actions";
import { NoFormsAndDocument } from "./formsAndDocumentErrors";
import { SHOW_DIGITAL_FORMS } from "../../constants/splits";
import { FeatureTreatment } from "../../libs/featureFlags";
import DigitalForm from "./digitalForm";

const FormsAndDocumentsModel = ({
  onBack,
  splitAttributes,
  enableDigitalForms,
  templateId,
  setTemplateId,
}) => {
  const dispatch = useDispatch();
  const ccForms = useSelector((state) => state.ccFormsDoc);
  const [rowID, setRowId] = useState();
  const ref = useRef();
  const [memberSelection, setMemberSelection] = useState({});
  const customerInfo = useSelector((state) => state.customerInfo);
  const { memberId, customerId } = memberSelection;

  useEffect(() => {
    if (memberId) {
      const data = {
        memberId: memberSelection.memberId
          ? memberSelection.memberId
          : memberSelection.memberId,
        benefitPackage: memberSelection.benefitPackage
          ? memberSelection.benefitPackage
          : memberSelection.benefitPackage,
        companyCode: memberSelection.companyCode
          ? memberSelection.companyCode
          : memberSelection.CompanyNumber,
        lob: memberSelection.lob ? memberSelection.lob : memberSelection.lob,
        groupNumber: memberSelection.groupNumber
          ? memberSelection.groupNumber
          : memberSelection.groupNumber,
        year: memberSelection.memberYear,
      };
      dispatch(requestCCFormsDocs(data));
    }
  }, [memberId]);

  useOnClickOutside(ref, (event) => {
    if (!event.target.id.startsWith("languageSelection")) {
      setRowId();
    }
  });

  useEffect(() => {
    setMemberSelection({
      ...memberSelection,
      memberId: customerInfo.data.memberId,
      planName: customerInfo.data.planName,
      membershipStatus: customerInfo.data.membershipStatus,
      membershipEffectiveDate: customerInfo.data.membershipEffectiveDate,
      membershipExpirationDate: customerInfo.data.membershipExpirationDate,
      companyCode: customerInfo.data.companyCode,
      lob: customerInfo.data.sessLobCode,
      groupNumber: customerInfo.data.groupNumber,
      benefitPackage: customerInfo.data.benefitPackage,
      firstName: customerInfo.data.firstName,
      lastName: customerInfo.data.lastName,
      memberYear: customerInfo.data.memberYear,
    });
  }, [customerInfo]);

  const renderCommonlyUserForms = () => (
    <>
      <SubTitle>Commonly Used Forms</SubTitle>
      {ccForms?.ccFormsDocDetails?.data[0].cc_commonly_used_forms.map(
        (item) => (
          <FormsWrapper>
            <CommonImg src="/react/images/documents-pdf-icon.svg" />
            <DocumentType>{item.Name}</DocumentType>
            <Text>
              Complete this form if you want to give someone (such as a family
              member, caregiver, or another company) access to your health or
              coverage information.
            </Text>
            {item.id === rowID ? (
              <DownloadImg
                onClick={() => setRowId(item.id)}
                src="/react/images/download_blue.svg"
              />
            ) : (
              <DownloadImg
                onClick={() => setRowId(item.id)}
                src="/react/images/download_pdf.svg"
              />
            )}

            <LangWrapper
              id="languageSelection"
              isOpen={item.id === rowID}
              last={false}
              ref={ref}
            >
              <Language
                id="languageSelectionEN"
                onClick={() => {
                  window.open(item.assetUrl.en);
                  setRowId();
                }}
              >
                English
              </Language>

              <Language
                id="languageSelectionES"
                onClick={() => {
                  window.open(item.assetUrl.es);
                  setRowId();
                }}
              >
                Spanish
              </Language>

              <Language
                id="languageSelectionZH"
                onClick={() => {
                  window.open(item.assetUrl.zh);
                  setRowId();
                }}
              >
                Chinese
              </Language>
            </LangWrapper>
          </FormsWrapper>
        ),
      )}
    </>
  );

  return (
    <Container>
      <Wrapper onClick={() => onBack(false)}>
        <ButtonWrapper>
          <ButtonImg src="/react/images/back_arrow.svg" />
          <ButtonText>Back</ButtonText>
        </ButtonWrapper>
      </Wrapper>

      {(ccForms.ccFormsDocDetails?.data?.length === 0 ||
        ccForms.ccFormsDocDetails?.data?.length === undefined) &&
      ccForms.ccFormsDocLoading === false ? (
        <NoFormsAndDocument />
      ) : (
        <>
          {ccForms?.ccFormsDocDetails?.data != null &&
          ccForms.ccFormsDocLoading === false ? (
            <>
              <MyDocuments>Forms and Plan Documents</MyDocuments>
              <DependentBlockWrapper>
                {
                  <DependentBlock
                    memberSelection={memberSelection}
                    setMemberSelection={setMemberSelection}
                    halfWidth
                    activeOnly={
                      memberSelection?.accountStatus === "active" ? false : true
                    }
                    minorsOnly={true}
                    activeDepsOnly={false}
                  />
                }
              </DependentBlockWrapper>
              {enableDigitalForms ? (
                <FeatureTreatment
                  treatmentName={SHOW_DIGITAL_FORMS}
                  onLoad={() => {}}
                  onTimedout={() => {}}
                  attributes={splitAttributes}
                >
                  <DigitalForm
                    memberId={memberId}
                    customerId={customerId}
                    templateId={templateId}
                    setTemplateId={setTemplateId}
                    stepperId="dfw-main-stepper"
                    cardsId="dfw-main-cards"
                  />

                  <div id="dfw-main-cards"></div>
                </FeatureTreatment>
              ) : null}

              {enableDigitalForms ? (
                <FeatureTreatment
                  treatmentName={SHOW_DIGITAL_FORMS}
                  onLoad={() => {}}
                  onTimedout={() => {}}
                  attributes={splitAttributes}
                  invertBehavior
                >
                  {renderCommonlyUserForms()}
                </FeatureTreatment>
              ) : (
                <>{renderCommonlyUserForms()}</>
              )}

              {!templateId ? (
                <>
                  {" "}
                  <SubTitle>General Forms</SubTitle>
                  <DocsList
                    data={ccForms?.ccFormsDocDetails?.data[0].cc_general_forms}
                  />
                  <SubTitle>Plan Documents</SubTitle>
                  <DocsList
                    data={ccForms?.ccFormsDocDetails?.data[0].cc_plan_documents}
                  />
                  <SubTitle>Additional Resources</SubTitle>
                  <DocsList
                    data={
                      ccForms?.ccFormsDocDetails?.data[0]
                        .cc_additional_resources
                    }
                  />
                </>
              ) : null}
            </>
          ) : (
            <ProgressWrapper>
              <Spinner />
            </ProgressWrapper>
          )}
        </>
      )}
    </Container>
  );
};

const DocsList = (props) => {
  const [rowName, setRowName] = useState("");
  const ref = useRef();
  useOnClickOutside(ref, (event) => {
    if (!event.target.id.startsWith("languageSelection")) {
      setRowName("");
    }
  });

  return (
    <>
      {props.data.map((item, i) => (
        <FormsWrapper key={i}>
          <GeneralFormWrapper>
            <FormImg src="/react/images/documents-pdf-icon.svg"></FormImg>
            <GeneralFormText>{item.Name}</GeneralFormText>
          </GeneralFormWrapper>

          {item.Name === rowName ? (
            <DownloadImg
              onClick={() => setRowName(item.Name)}
              src="/react/images/download_blue.svg"
            />
          ) : (
            <DownloadImg
              onClick={() => setRowName(item.Name)}
              src="/react/images/download_pdf.svg"
            />
          )}
          <LangWrapper
            id="languageSelection"
            isOpen={item.Name === rowName}
            last={false}
            ref={ref}
          >
            {item.assetUrl.en != null && item.assetUrl.en != "" && (
              <Language
                id="languageSelectionEN"
                onClick={() => {
                  window.open(item.assetUrl.en);
                  setRowName("");
                }}
              >
                English
              </Language>
            )}

            {item.assetUrl.es != null && item.assetUrl.es != "" && (
              <Language
                id="languageSelectionES"
                onClick={() => {
                  window.open(item.assetUrl.es);
                  setRowName("");
                }}
              >
                Spanish
              </Language>
            )}

            {item.assetUrl.zh != null && item.assetUrl.zh != "" && (
              <Language
                id="languageSelectionZH"
                onClick={() => {
                  window.open(item.assetUrl.zh);
                  setRowName("");
                }}
              >
                Chinese
              </Language>
            )}
          </LangWrapper>
        </FormsWrapper>
      ))}
    </>
  );
};

export default FormsAndDocumentsModel;

const Container = styled.div``;

const ButtonImg = styled.img``;

const FormImg = styled.img``;

const LangWrapper = styled.div`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: absolute;
  border-radius: 4px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.23);
  background-color: #ffffff;
  list-style-type: none;
  padding: 4px 0;
  z-index: 1;
  width: 132px;
  bottom: ${(props) => (props.last ? "100%" : "")};
`;

const GeneralFormText = styled.div`
  margin-left: 10px;
  color: var(--Colors-Primary-Slate-500, #474b55);
  font-feature-settings:
    "clig" off,
    "liga" off;
  font-family: "museo-sans", san-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px; /* 150% */
  text-transform: capitalize;
`;

const GeneralFormWrapper = styled.div`
  display: flex;
`;

const DownloadImg = styled.img`
  margin-top: 5px;
  margin-left: -16px;
  //height: 32px;
  //width: 144px;
`;

const CommonImg = styled.img`
  margin-top: 5px;
`;

const ButtonWrapper = styled.div`
  display: flex;
`;
const Wrapper = styled.div`
  cursor: pointer;
  width: fit-content;
  padding: 8px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  background: var(--Colors-Neutrals-White, #fff);

  /* Shadow_1 */
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
`;

const ButtonText = styled.div`
  padding: 3px;
  color: var(--Colors-Primary-Cerulean-500, #008bbf);
  font-family: "museo-sans", san-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 16px; /* 114.286% */
`;

const FormsWrapper = styled.div`
  margin-bottom: 8px;
  padding: 16px;
  background: var(--Colors-Neutrals-White, #fff);

  /* lvl-1 */
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
`;

const DocumentType = styled.div`
  margin-top: 5px;
  color: var(--Colors-Primary-Blue-500, #003863);
  font-feature-settings:
    "clig" off,
    "liga" off;

  /* Web/H3/h3.bold */
  font-family: "museo-sans", san-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px; /* 150% */
`;

const Text = styled.div`
  margin-top: 5px;
  color: #474b55;
  font-family: "museo-sans", san-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
`;

const ProgressWrapper = styled.div`
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
`;
