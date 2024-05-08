import React, { useEffect } from "react";
import styled from "styled-components";
import useQuery from "../../../hooks/useQuery";
const { MIX_APP_DOMAIN } = process.env;
const { MIX_REACT_LOFL_LANGUAGE_EN_URL } = process.env;
const { MIX_REACT_LOFL_LANGUAGE_ES_URL } = process.env;
const { MIX_REACT_LOFL_LANGUAGE_ZH_URL } = process.env;

const setLoginLang = (langCode) => {
  let isSupportedLang = false;
  switch (langCode) {
    case "en":
      isSupportedLang = true;
      break;
    case "es":
      isSupportedLang = true;
      break;
    case "zh":
      isSupportedLang = true;
  }
  if (isSupportedLang) {
    localStorage.setItem("loginLang", langCode);
  }
};

const setSelectedLang = (langCode) => {
  let isSupportedLang = false;
  switch (langCode) {
    case "en":
      isSupportedLang = true;
      break;
    case "es":
      isSupportedLang = true;
      break;
    case "zh":
      isSupportedLang = true;
  }
  if (isSupportedLang) {
    localStorage.setItem("selectedLang", langCode);
  }
};

export const getLoginLang = () => {
  let selectedLang = localStorage.getItem("loginLang");
  let isSupportedLang = false;
  switch (selectedLang) {
    case "en":
      isSupportedLang = true;
      break;
    case "es":
      isSupportedLang = true;
      break;
    case "zh":
      isSupportedLang = true;
  }
  if (isSupportedLang) {
    return selectedLang;
  }
};

export const getSelectedLang = () => {
  let selectedLang = localStorage.getItem("selectedLang");
  let isSupportedLang = false;
  switch (selectedLang) {
    case "en":
      isSupportedLang = true;
      break;
    case "es":
      isSupportedLang = true;
      break;
    case "zh":
      isSupportedLang = true;
  }
  if (isSupportedLang) {
    return selectedLang;
  }
};

export const HandleLanguageSelection = () => {
  const loginLang = useQuery().get("loginLang");
  const selectedLang = useQuery().get("selectedLang");
  const domainURLObject = new URL(MIX_APP_DOMAIN);
  const generateURL = (langCode) => {
    switch (langCode) {
      case "es":
        return MIX_REACT_LOFL_LANGUAGE_ES_URL + `/home`;
      case "zh":
        return MIX_REACT_LOFL_LANGUAGE_ZH_URL + `/home`;
      default:
        // Defaults to English
        return MIX_REACT_LOFL_LANGUAGE_EN_URL + `/home`;
    }
  };

  if (loginLang) {
    setLoginLang(loginLang);
  }
  if (selectedLang) {
    setSelectedLang(selectedLang);
  }

  location.href = generateURL(selectedLang);

  return null;
};

const LanguageSelection = () => {
  const domainURLObject = new URL(MIX_APP_DOMAIN);
  const generateURL = (langCode) => {
    switch (langCode) {
      case "en":
        return (
          MIX_REACT_LOFL_LANGUAGE_EN_URL + `/selectLanguage?selectedLang=en`
        );
      case "es":
        return (
          MIX_REACT_LOFL_LANGUAGE_ES_URL + `/selectLanguage?selectedLang=es`
        );
      case "zh":
        return (
          MIX_REACT_LOFL_LANGUAGE_ZH_URL + `/selectLanguage?selectedLang=zh`
        );
      default:
        return "";
    }
  };
  return (
    <List>
      <ListItem isLink>
        <a href={generateURL("en")}>EN</a>
      </ListItem>
      <ListItem isLink>
        <a href={generateURL("es")}>ES</a>
      </ListItem>
      <ListItem isLink>
        <a href={generateURL("zh")}>中文</a>
      </ListItem>
    </List>
  );
};

export const List = styled.ul`
  display: flex;
`;

export const ListItem = styled.li`
  font-size: 14px;
  line-height: 16px;
  color: #ffffff;

  &:not(:last-child)::after {
    content: "|";
    margin: 0 5px;
    font-weight: 700;
  }

  & > a {
    font-weight: 700;
    color: #ffffff;
    text-decoration: none;
  }

  &:hover {
    text-decoration: ${(props) => props.isLink && "underline"};
  }
`;

export default LanguageSelection;
