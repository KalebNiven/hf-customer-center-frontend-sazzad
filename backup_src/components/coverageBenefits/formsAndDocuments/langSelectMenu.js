import React from 'react'
import { LanguageSelect, Language } from '../styles'
import { LANG_CODE_EN, LANG_CODE_ES, LANG_CODE_ZH } from "../../common/constants";

const LangSelectMenu = ({ btnIndex, index, urls, count, menuOpen, docName }) => {
    return (
        <LanguageSelect last={ index === (count - 1) } isOpen={index === btnIndex && menuOpen}>
            <Language data-langid={LANG_CODE_EN} value={urls["en"]} data-title={docName}>English</Language>
            {
                urls["es"] && <Language data-langid={LANG_CODE_ES} value={urls["es"]} data-title={docName}>Español</Language>
            }
            {
                urls["zh"] && <Language data-langid={LANG_CODE_ZH} value={urls["zh"]} data-title={docName}>中文</Language>
            }
        </LanguageSelect>
    )
}

export default LangSelectMenu
