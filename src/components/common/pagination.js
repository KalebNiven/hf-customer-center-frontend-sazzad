import React,{useState, useEffect, useRef} from "react";
import styled from "styled-components";
import {  Hidden } from "@material-ui/core";

const Pagination = ({onChangeRowsPerPage,rowsPerPage,currentPage,rowCount,onChangePage})=> {

const totalPages = Math.ceil(rowCount/rowsPerPage);
//alert(rowsPerPage)
const selectOptions = [10,25,50].map((num, idx) => {
  return (
    <SelectOption
      data-page={num}
      value={num}
      selected={rowsPerPage == num ? true : false}
      key={idx}
    >
      {num}
    </SelectOption>
 )});

  const filterPages = (visiblePages, totalPages) => {
    return visiblePages.filter(page => page <= totalPages);
  };

  const getVisiblePages = (page, total) => {
    if (total <= 5) {
      return filterPages([1,2,3,4,5],total);
    } else {
      if (page < 4) {
        return [1, 2, 3, 4, total];
      } 
      else if (page >= 4 && (page+3 < total)) {
        return [page,page+1,page+2,page+3,total];
      }
      else if (page+1 === total) {
        return [1,-1,page-1,page,total];
      }
      else if (page >= 4 && (page+3 === total)) {
        return [page-1,page,page+1,page+2,total];
      }
      else if (page >= 4 && (page+2 === total)) {
        return [page-2,page-1,page,page+1,total];
      }
      else{
        return [1,-1,page-2,page-1,page];
      }
    }
  };

const changePage = (page) => {
    if (page === currentPage) {
      return;
    }
    const visiblePages = getVisiblePages(page, totalPages);

    setVisiblePages(filterPages(visiblePages, totalPages));
   
    onChangePage(page,totalPages);
  }

const [visiblePages,setVisiblePages] = useState(getVisiblePages(null, totalPages));
const [dropdownClick,setdropdownClick] = useState(false);

const selectRef = useRef(null);

// effect to listen to mouse clicks when component is mounted
useEffect(() => {
  document.addEventListener("mousedown", handleOutsideDropdownClick);

  // return function to be called when unmounted
  return () => {
    document.removeEventListener("mousedown", handleOutsideDropdownClick);
  };
}, []);

useEffect(() => {
  setVisiblePages(getVisiblePages(null, totalPages));
},[rowsPerPage,rowCount]);


// handler for when the user clicks outside the dropdown
const handleOutsideDropdownClick = (e) => {
  if (e.target.getAttribute('data-page')) {
    onChangeRowsPerPage(e.target.getAttribute('value'), currentPage);
    setdropdownClick(false);
    return;
  }
  if(selectRef.current && e.target.name === selectRef.current.name)
    setdropdownClick(!dropdownClick);
  else
    setdropdownClick(false);
};

return (
      rowCount >= 11 &&
        <PaginationWrapper >
          <Hidden only = {["xs"]}>
          <FooterWrapper>
            
          <RowLabel>Items Per Page:</RowLabel>
          <Select ref={selectRef} name="select" isOpen={dropdownClick} type="text" placeholder="" value={rowsPerPage} aria-label="Select Page" onChange={()=>{}}/>
          <SelectBox isOpen={dropdownClick}>{selectOptions}</SelectBox>
    </FooterWrapper></Hidden>
      <PageList>
        <Button
          id="pagination-first-page"
          type="button"
          aria-label="First Page"
          onClick={() => {
            if (currentPage === 1) return;
            changePage(currentPage-1);
          }}
          disabled={currentPage === 1}
        >
        <ArrowButton>
          <IconImg disable = {currentPage === 1} src = "react/images/icn-arrow-left.svg"/></ArrowButton>
        </Button>
        {visiblePages.length <=4 && visiblePages.map((page) => {
          return (
            <Button
              key={page}
              onClick={() => changePage(page)}
            >
              {<NumberButton isCurrent = {currentPage === page}>{page}</NumberButton>}
            </Button>
          );
        })}
        {visiblePages.length > 4 && visiblePages.map((page) => {
          return (
            <Button
              key={page}
              onClick={() => changePage(page)}
            >
              {(totalPages === page && currentPage!=page && currentPage+4 < totalPages) ? `of ${page}` : (page === -1 ? `...`:
              <NumberButton isCurrent = {currentPage === page}>{page}</NumberButton>)}
            </Button>
          );
        })}
        

        <Button
          id="pagination-last-page"
          type="button"
          aria-label="Last Page"
          onClick={() => {
            if (currentPage === totalPages) return;
            changePage(currentPage + 1);
          }}
          disabled={currentPage === totalPages}
        >
        <ArrowButton>
          <IconImg disable ={currentPage === totalPages} src = "react/images/icn-arrow-right.svg"/></ArrowButton>
        </Button>
      </PageList>
      <Hidden only = {["xl","lg","md","sm"]}>
          <FooterWrapper>
            
          <RowLabel>Items Per Page:</RowLabel>
          <Select ref={selectRef} name="select" isOpen={dropdownClick} type="text" placeholder="" value={rowsPerPage} aria-label="Select Page" onChange={()=>{}}/>
          <SelectBox isOpen={dropdownClick}>{selectOptions}</SelectBox>
    </FooterWrapper></Hidden>
    </PaginationWrapper>

        )
}

export default Pagination;

const IconImg = styled.img`
width: 20px;
  height: 20px;
  object-fit: contain;
  margin-top: 5px;
  display: initial;
${props => props.disable && `cursor:context-menu;opacity:0.5` };
`;

const PageList = styled.div`
  display: flex;
  align-items: center;
  border-radius: 4px;
  white-space: nowrap;
 @media only screen and (max-width: 666px) {
  margin-top:20px;
 margin-bottom:20px;
  }
`;

const PaginationWrapper = styled.div`
@media only screen and (min-width: 667px) {
  display: flex;
  }
  display: contents;
  flex: 1 1 auto;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  margin: 14px 0px 102px 0px;
  padding: 0 1px 0 0;
`;

const RowLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color:#474b55;
  margin-right: 10px;
`;

const FooterWrapper = styled.div`
text-align:center;
input{
  cursor: pointer;
  margin: auto;
}
`;

const Button = styled.button`
cursor: pointer;
font-size: 15px;
font-family: "museo-sans";
font-weight: 500;
font-stretch: normal;
font-style: normal;
line-height: 1.56;
letter-spacing: -0.08px;
text-align: center;
color: #474b55;
margin: auto;
border:none;
background-color:#f4f4f4;
&:disabled {
  color: #d8d8d8;
}
padding: 1px 6px;
`;

const NumberButton = styled.p`
  width:40px;
  height: 40px;
  ${props => !props.isCurrent && `border-radius: 4px` };
  ${props => props.isCurrent ? `border:none`: `border: solid 1px #a8abac`};
  ${props => !props.isCurrent ? `background-color: #ffffff` : `background-color: #f4f4f4`};
  font-size:16px;
  ${props => props.isCurrent ? `color:#474b55`: `color:#008bbf`};
  font-weight: bold;
  vertical-align:middle;
  display:table-cell;
  &:hover {
    background-color: #f3f3f3;
  }
  &:active {
    background-color: #e6e6e6;
  }
`;

const ArrowButton = styled.p`
width:40px;
  height: 40px;
   border-radius: 4px;
   border: solid 1px #a8abac;
 background-color: #ffffff;
  vertical-align:middle;
  display:table-cell;
`;

const SelectBox = styled.div`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: absolute;
  margin: 0px 112px;
  border-radius: 4px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.23);;
  background-color: #ffffff;
  list-style-type: none;
  padding: 0px;
  z-index: 1001;
  width: 75px;
  @media only screen and (max-width: 600px) {
    margin: -10px 184px;
  }
`;
const SelectOption = styled.div`
  padding: 8px 12px 8px 16px;
  font-size: 16px;
  font-weight: ${(props) => (props.selected ? '500' : '300')};
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: #474b55;
  text-align: left;
  background-color: ${(props) => (props.selected ? 'rgba(0, 0, 0, 0.1)' : '')};
  &:hover {
    cursor: pointer;
    background-color: ${(props) => (props.selected ? 'rgba(0, 0, 0, 0.1)' : '#f3f3f3')};
  }
  
`;

const Select = styled.input`
  border-radius: 4px;
  border: ${(props) => (props.isOpen ? 'solid 1px #003863' : 'solid 1px #a8abac')};
  width: 6rem;
  caret-color: transparent;
  padding: 8px 0px 8px 15px;
  margin-bottom: 10px;
  margin-right: 10px;
  background-color:#ffffff;
  font-size: 16px;
  font-weight: 300;
  font-family: "museo-sans";
  background: ${(props) => (props.isOpen ? 
    'url(react/images/icn-dropdown-up.svg) no-repeat scroll #ffffff 50px 11px':
    'url(react/images/icn-dropdown.svg) no-repeat scroll #ffffff 50px 11px')}
`;
