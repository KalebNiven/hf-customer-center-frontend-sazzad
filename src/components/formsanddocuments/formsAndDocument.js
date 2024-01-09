import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { MyDocuments, SubTitle } from "./style";
import { useDispatch, useSelector } from "react-redux";
import { requestCCFormsDocs } from "../../store/actions";
import useOnClickOutside from "../documents/useOnClickOutside";
import { LanguageSelect, Language } from "../common/styles";

const FormsAndDocumentsModel = ({ onBack }) => {
  const dispatch = useDispatch();
  const ccForms = useSelector((state) => state.ccFormsDoc);
  const customerInfo = useSelector((state) => state.customerInfo);

  // useEffect(() => {
  //   const data = {
  //     memberId: customerInfo.data.memberId,
  //     benefitPackage: customerInfo.data.benefitPackage,
  //     companyCode: customerInfo.data.companyCode,
  //     lob: customerInfo.data.sessLobCode,
  //     groupNumber: customerInfo.data.groupNumber,
  //     year: 2024
  //   };
  //   dispatch(requestCCFormsDocs(data));
  // }, []);

  const [rowID, setRowId] = useState();
  const ref = useRef();
  useOnClickOutside(ref, (event) => {
    //if(event.toElement.contains())
    console.log(
      "event",
      event.target.contains(ref.current),
      ref.current,
      event.target
    );
    if (event.target.contains(ref.current)) {
      setRowId();
    }
  });

  return (
    <Container>
      {ccForms?.ccFormsDocDetails?.data != null ? (
        <>
          <Wrapper>
            <ButtonWrapper>
              <ButtonImg src="/react/images/back_arrow.svg" />
              <ButtonText onClick={() => onBack(false)}>Back</ButtonText>
            </ButtonWrapper>
          </Wrapper>
          <MyDocuments>Forms and Documents</MyDocuments>
          <SubTitle>Commonly Used Forms</SubTitle>
          {ccForms?.ccFormsDocDetails?.data[0].cc_commonly_used_forms.map(
            (item) => (
              <FormsWrapper>
                <CommonImg src="/react/images/documents-pdf-icon.svg" />
                <DocumentType>{item.Name}</DocumentType>
                <Text>
                  Complete this form if you want to give someone (such as a
                  family member, caregiver, or another company) access to your
                  health or coverage information.
                </Text>
                <DownloadImg
                  onClick={() => setRowId(item.id)}
                  src="/react/images/download_pdf.svg"
                />
                <LangWrapper isOpen={item.id === rowID} last={false}>
                  <Language
                    onClick={() => {
                      window.open(item.assetUrl.en);
                    }}
                  >
                    English
                  </Language>

                  <Language onClick={() => window.open(item.assetUrl.es)}>
                    Spanish
                  </Language>

                  <Language
                    ref={ref}
                    onClick={() => window.open(item.assetUrl.zh)}
                  >
                    Chinese
                  </Language>
                </LangWrapper>
              </FormsWrapper>
            )
          )}

          <SubTitle>General Forms</SubTitle>
          <DocsList
            data={ccForms?.ccFormsDocDetails?.data[0].cc_general_forms}
          />
          {/* {ccForms?.ccFormsDocDetails?.data[0].cc_general_forms.map(
            (item) => (
           
          )
          )} */}
          <SubTitle>Plan Documents</SubTitle>
          <DocsList
            data={ccForms?.ccFormsDocDetails?.data[0].cc_plan_documents}
          />
          <SubTitle>Additional Resources</SubTitle>
          <DocsList
            data={ccForms?.ccFormsDocDetails?.data[0].cc_additional_resources}
          />
        </>
      ) : null}
    </Container>
  );
};

const DocsList = (props) => {
  const [rowName, setRowName] = useState("");
  const ref = useRef();
  useOnClickOutside(ref, (event) => {
    //if(event.toElement.contains())
    console.log(
      "event",
      event.target.contains(ref.current),
      ref.current,
      event.target
    );
    if (event.target.contains(ref.current)) {
      setRowName("");
    }
  });

  const handleOpen = (item) => {
    if (
      (item.assetUrl.en != null || item.assetUrl.en != "") &&
      (item.assetUrl.es === null || item.assetUrl.es === "") &&
      (item.assetUrl.zh === null || item.assetUrl.zh === "")
    ) {
      window.open(item.assetUrl.en);
      setRowName("")
    }
  };

  return (
    <>
      {props.data.map((item) => (
        <FormsWrapper>
          <GeneralFormWrapper>
            <FormImg src="/react/images/documents-pdf-icon.svg"></FormImg>
            <GeneralFormText>{item.Name}</GeneralFormText>
          </GeneralFormWrapper>
          <DownloadImg
            onClick={() => {
              setRowName(item.Name), handleOpen(item);
            }}
            src="/react/images/download_pdf.svg"
          />
          <LangWrapper isOpen={item.Name === rowName} last={false}>
            {item.assetUrl.en != null && item.assetUrl.en != "" && (
              <Language
                onClick={() => {
                  window.open(item.assetUrl.en);
                }}
              >
                English
              </Language>
            )}

            {item.assetUrl.es != null && item.assetUrl.es != "" && (
              <Language onClick={() => window.open(item.assetUrl.es)}>
                Spanish
              </Language>
            )}

            {item.assetUrl.zh != null && item.assetUrl.zh != "" && (
              <Language ref={ref} onClick={() => window.open(item.assetUrl.zh)}>
                Chinese
              </Language>
            )}
          </LangWrapper>
        </FormsWrapper>
      ))}
      ;
    </>
  );
};

const LangModel = (props) => {
  return (
    <LangWrapper isOpen={props.data.Name === props.rowName} last={false}>
      <Language
        onClick={() => {
          window.open(props.data.assetUrl.en);
        }}
      >
        English
      </Language>

      <Language onClick={() => window.open(props.data.assetUrl.es)}>
        Spanish
      </Language>

      <Language
        ref={props.ref}
        onClick={() => window.open(props.data.assetUrl.zh)}
      >
        Chinese
      </Language>
    </LangWrapper>
  );
};

export default FormsAndDocumentsModel;

const Container = styled.div``;

const ButtonImg = styled.img``;

const FormImg = styled.img`
  //margin-top: -41px;
`;

const LangWrapper = styled.div`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: absolute;
  //margin: ${(props) => (props.last ? "5px -80px" : "25px -80px")};
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
  font-feature-settings: "clig" off, "liga" off;
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
`;

const CommonImg = styled.img`
  margin-top: 5px;
`;

const ButtonWrapper = styled.div`
  display: flex;
`;
const Wrapper = styled.div`
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
  font-feature-settings: "clig" off, "liga" off;

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
