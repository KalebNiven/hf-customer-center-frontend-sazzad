import React from "react";
import { useSelector } from "react-redux";
import {
  Name,
  MainCard,
  DocCard,
  DocView,
  Icon,
  IconRight,
  DocRow,
  HorizontalDivider,
  DataDocBlock,
  DocText,
} from "../styles";
import LangSelectMenu from "./langSelectMenu";

const DocBenefitsBlock = ({ showLangMenu, menuOpen, benfBtnIndex }) => {
  const docsData = useSelector((state) => state.coverageBenefits.documents);

  const benefitDocs = docsData && docsData[0];
  const docsCount = benefitDocs && benefitDocs.benefits.length;

  return (
    <MainCard>
      <DocCard>
        <Name documents>Benefits Documents</Name>
        {benefitDocs &&
          benefitDocs.benefits.map((doc, index) => {
            return (
              <DocView key={index}>
                <DocRow>
                  <DataDocBlock>
                    <Icon alt="" right src="/react/images/icn-pdf.svg" />
                    <DocText>{doc.name}</DocText>
                    <IconRight
                      selected={index === benfBtnIndex ? true : false}
                      onClick={() => showLangMenu(1, index)}
                    >
                      <LangSelectMenu
                        btnIndex={benfBtnIndex}
                        index={index}
                        urls={doc.assetUrl}
                        count={0}
                        menuOpen={menuOpen}
                        docName={doc.name}
                      />
                    </IconRight>
                  </DataDocBlock>
                </DocRow>
                {index !== docsCount - 1 && <HorizontalDivider noMargin />}
              </DocView>
            );
          })}
      </DocCard>
    </MainCard>
  );
};

export default DocBenefitsBlock;
