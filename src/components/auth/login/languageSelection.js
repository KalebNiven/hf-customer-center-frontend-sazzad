import React from 'react'
import styled from 'styled-components';
const { REACT_APP_MIX_APP_DOMAIN } = process.env;

const LanguageSelection = () => {
    const domainURLObject = new URL(REACT_APP_MIX_APP_DOMAIN);
    const generateURL = (langCode) => {
        switch(langCode) {
            case "en": 
                return `https://` + domainURLObject.hostname + `/selectLanguage?selectedLang=en`;
            case "es": 
                return `https://` + `es.` + domainURLObject.hostname + `/selectLanguage?selectedLang=es`;
            case "zh": 
                return `https://` + `zh.` + domainURLObject.hostname + `/selectLanguage?selectedLang=zh`;
            default:
                return "";
        }
    }
    return (
        <List>
            <ListItem isLink><a href={generateURL("en")}>EN</a></ListItem>
            <ListItem isLink><a href={generateURL("es")}>ES</a></ListItem>
            <ListItem isLink><a href={generateURL("zh")}>中文</a></ListItem>
        </List>
    )
}

export const List = styled.ul`
    display: flex;
`;

export const ListItem = styled.li`
    font-size: 14px;
    line-height: 16px;
    color: #FFFFFF;

    &:not(:last-child)::after {
        content: "|";
        margin: 0 5px;
        font-weight: 700;
    }

    & > a {
        font-weight: 700;
        color: #FFFFFF;
        text-decoration: none;
    }

    &:hover {
        text-decoration: ${props => props.isLink && "underline"};
    }
`;

export default LanguageSelection
