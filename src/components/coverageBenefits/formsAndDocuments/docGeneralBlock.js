import React from 'react'
import { useSelector } from "react-redux";
import { Name, MainCard, DocCard, DocView, Icon, IconRight, DocRow, HorizontalDivider, DataDocBlock, DocText } from '../styles';
import LangSelectMenu from './langSelectMenu';

const DocGeneralBlock = ({ showLangMenu, menuOpen, genBtnIndex }) => {
    const docsData = useSelector((state) => state.coverageBenefits.documents);

    const generalDocs = docsData && docsData[0];
    const docsCount = generalDocs && generalDocs.general.length;

    return (
        <MainCard>
        <DocCard>
          <Name documents>General Documents</Name>
          {
            generalDocs && generalDocs.general.map((doc, index) => {
              return (
                <DocView key={index}>
                  <DocRow>
                    <DataDocBlock>
                      <Icon right src="react/images/icn-pdf.svg" />
                      <DocText>{doc.name}</DocText>
                      <IconRight selected={ index === genBtnIndex ? true : false} onClick={() => showLangMenu(0, index)}>
                        <LangSelectMenu btnIndex={genBtnIndex} index={index} urls={doc.assetUrl} count={docsCount} menuOpen={menuOpen} docName={doc.name} />
                      </IconRight>
                    </DataDocBlock>
                  </DocRow>
                  { index !== (docsCount - 1) && <HorizontalDivider noMargin/>}
                </DocView>
              )
            })
          }
        </DocCard>
      </MainCard>
    )
}

export default DocGeneralBlock