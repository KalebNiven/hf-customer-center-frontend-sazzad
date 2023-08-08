import styled from 'styled-components';

export const Loading = styled.div`
  color: red;
  font-size: 4rem;
`;

export const Container = styled.div`
  display: flex;
  height: 100%;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

export const ErrorContainer = styled.div`
    position: relative;
    width: 100%;
    min-height: 1px;
    padding: 16px;
    padding-right: 31px;
    padding-left: 31px;
    display: table;
    margin-top: auto;
    margin-bottom: auto;
    height: 336px;
    padding: 40px 24px;
    border-radius: 4px;
    box-shadow: 0 2px 8px 0 #d8d8d8;
    background-color: #ffffff;
`;

export const ErrorWrapper = styled.div`
    display: table-cell;
    text-align: center;
`;

export const ErrorCard = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    @media (min-width: 768px){
        width: 480px;
    }
    max-width: 480px;
`;

export const ErrorCardTitle = styled.h6`
    font-size: 20px;
    font-weight: 500;
    line-height: 1.6;
    color: #003863;
    margin-bottom: 1rem;
`;

export const ErrorCardText = styled.p`
    font-weight: 500; 
    color: #474b55;
    font-size: 14px;
    letter-spacing: 0;
    line-height: 16px;
    margin-bottom: .25rem;
`;

export const ErrorCodeText = styled.p`
    margin-bottom: 1.5rem!important;
    color: #474b55;
    font-size: 12px;
    letter-spacing: 0;
    line-height: 16px;
`

export const Icon = styled.img`
    width: 80px;
    height: 80px;
`;

export const ControllersWrapper = styled.div`
    display: flex;
    gap: 20px;
    justify-content: center;
    margin-top: 30px;
`;

export const ControllersButton = styled.span`
    height: 40px;
    padding: 8px 16px;
    border-radius: 4px;
    border: solid 1px #3e7128;
    background-color: #fff;
    color: #3e7128;
    font-size: 18px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    text-align: center;
    cursor: pointer;

    &:hover {
        background: #3e7128;
        color: #fff;
    }
`;