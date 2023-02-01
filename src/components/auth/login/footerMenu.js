import React from 'react'
import styled from 'styled-components';

const FooterMenu = () => {
    return (
        <Wrapper>
            <List>
                <ListItem isLink><a href="#">Contact Us</a></ListItem>
                <ListItem isLink><a href="https://healthfirst.org/terms-of-use">Terms & Conditions</a></ListItem>
                <ListItem isLink><a href="http://assets.healthfirst.org/api/pdf?id=pdf_267ff1120f&key=2a057fc3de988ef49277dcc39931e7444611493e">Web Privacy Statement</a></ListItem>
                <ListItem isLink><a href="http://assets.healthfirst.org/api/pdf?id=pdf_53b845cf68&key=990ce7f9a53a3c552ac2fa2ca16f0dd7a9cdac0b&_ga=2.262813516.1197467741.1496254267-1737878043.1427400676">New York Privacy Notice</a></ListItem>
                <ListItem isLink><a href="http://assets.healthfirst.org/api/pdf?id=pdf_ffc2ec5002&key=747d08e9f76a07931acd9d93fd2370fac86900e7&_ga=2.259676362.1197467741.1496254267-1737878043.1427400676">HIPAA Privacy Notice</a></ListItem>
            </List>
            <Copyright>© 2022 Healthfirst</Copyright>
        </Wrapper>
    )
}

export const Wrapper = styled.div`
`;

export const List = styled.ul`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
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

export const Copyright = styled.div`
    margin-top: 20px;
    font-size: 14px;
    line-height: 16px;
    color: #FFFFFF;
    text-align: center;
`;

export default FooterMenu
