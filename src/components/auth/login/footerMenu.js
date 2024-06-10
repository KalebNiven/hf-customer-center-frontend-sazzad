import React from "react";
import styled from "styled-components";
import { handleSegmentClick } from "../../../libs/segment";
import Index from "../../documents";
const { MIX_REACT_APP_FOOTER_WEB_PRIVACY } = process.env;
const { MIX_REACT_APP_FOOTER_NY_PRIVACY } = process.env;
const { MIX_REACT_APP_FOOTER_HIPAA } = process.env;
const { MIX_REACT_REG_CONTACT_LINK } = process.env;
const { MIX_REACT_APP_FOOTER_TERMS_AND_CONDITIONS } = process.env;

const links = [
  {
    label: "Contact Us",
    href: MIX_REACT_REG_CONTACT_LINK,
  },
  {
    label: "Terms & Conditions",
    href: MIX_REACT_APP_FOOTER_TERMS_AND_CONDITIONS,
  },
  {
    label: "Web Privacy Statement",
    href: MIX_REACT_APP_FOOTER_WEB_PRIVACY,
  },
  {
    label: "New York Privacy Notice",
    href: MIX_REACT_APP_FOOTER_NY_PRIVACY,
  },
  {
    label: "HIPAA Privacy Notice",
    href: MIX_REACT_APP_FOOTER_HIPAA,
  },
];
const FooterMenu = () => {
  const handleClick = (link) => {
    handleSegmentClick(
      link.href ? link.href : "",
      link.label,
      link.label + " Link Clicked",
      "link",
      "bottom",
      "",
      "registration"
    );
  };

  return (
    <Wrapper>
      <List>
        {links.map((link, index) => (
          <ListItem key={index} isLink>
            <a onClick={() => handleClick(link)} href={link.href}>
              {link.label}
            </a>
          </ListItem>
        ))}
      </List>
      <Copyright>© {new Date().getFullYear()} Healthfirst</Copyright>
    </Wrapper>
  );
};

export const Wrapper = styled.div``;

export const List = styled.ul`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
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

export const Copyright = styled.div`
  margin-top: 20px;
  font-size: 14px;
  line-height: 16px;
  color: #ffffff;
  text-align: center;
`;

export default FooterMenu;
