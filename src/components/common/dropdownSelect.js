import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

function DropdownSelect(props) {
  /* props */
  const {
    placeholder = "Select Option",
    values = [],
    onSelect = () => {},
    error = false,
    errorMessage = "Invalid selection",
    onInvalidateError = () => {},
    onDropdownExpand = () => {},
    defaultSelected = false,
    fullWidth = false,
    showImage,
    selectedHighlight,
    heightPixels,
  } = props;

  /* states */
  const [selection, setSelection] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [memberSelectionClicked, setMemberSelectionClicked] = useState(false);

  /* refs */
  const dropdownRef = useRef();

  /* effects */

  // effect to listen to mouse clicks when component is mounted
  useEffect(() => {
    // add when mounted
    document.addEventListener("mousedown", handleOutsideDropdownClick);
    // return function to be called when unmounted
    return () => {
      document.removeEventListener("mousedown", handleOutsideDropdownClick);
    };
  }, []);

  useEffect(() => {
    if (defaultSelected) {
      setSelection(values[0].label);
    }
    else if(props.selected){
      setSelection(props.selected.label);
    }
  }, []);

  /* functions */

  // handler for when user selects a value
  const handleSelect = (item, e) => {
    setIsOpen(!isOpen);
    setSelection(item.label);
    onSelect(item.value);
    onInvalidateError();
  };

  // handler for when the user clicks outside the dropdown
  const handleOutsideDropdownClick = (e) => {
    if (dropdownRef.current.contains(e.target)) return;
    // clicked outside
    setIsOpen(false);
  };

  // handler for when user clicks the dropdown
  const handleDropdownClick = () => {
    setMemberSelectionClicked(true);
    if (values.length > 0) {
      if (!isOpen) onDropdownExpand();
      setIsOpen(!isOpen);
    }
  };

  return (
    <DropdownFieldContainer ref={dropdownRef} fullWidth={fullWidth}>
      <DropdownField showImage={showImage} error={error}
        className={`${error && "error"}`}
        onClick={handleDropdownClick}
        isOpen={isOpen}
        className={`${memberSelectionClicked && "selected"}`}
      >
        <DropdownFieldTextContainer showImage={showImage}>
          <DropdownFieldText
            className={`${selection && "selected"} ${error && "error"}`}
          >
            {selection || placeholder}
          </DropdownFieldText>
          <DropdownIconContainer>
            <DropdownIcon alt = "" src={!isOpen ? "/react/images/icn-dropdown.svg" : "/react/images/icn-dropdown-up.svg"} />
          </DropdownIconContainer>
        </DropdownFieldTextContainer>
        <DropdownList className="hf-preference-center-dropdown-content" isOpen={isOpen} heightPixels={heightPixels}>
          {values.map((item, index) => (
            <React.Fragment key={Math.random()}>
              <DropdownListItem 
                selection={selection} 
                selectedHighlight={selectedHighlight}
                onClick={(e) => handleSelect(item, e)}
                name={item.label}
                value={item.value}
              >
                {item.planName === "" ?
                <h1>{item.label}</h1>
                :
                <div>
                <h2>{item.label}</h2>
                <p>{item.planName}</p>
                </div>
                }
              </DropdownListItem>
            </React.Fragment>
          ))}
        </DropdownList>
      </DropdownField>
      {error && <DropdownErrorMsg>{errorMessage}</DropdownErrorMsg>}
    </DropdownFieldContainer>
  );
}

export default React.memo(DropdownSelect);

DropdownSelect.propTypes = {
  placeholder: PropTypes.string,
  values: PropTypes.oneOfType([PropTypes.array.isRequired]).isRequired,
  onSelect: PropTypes.func,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  onInvalidateError: PropTypes.func,
  onDropdownExpand: PropTypes.func,
  defaultSelected: PropTypes.bool,
  fullWidth: PropTypes.bool,
  showImage: PropTypes.bool,
  selectedHighlight: PropTypes.bool,
  heightPixels: PropTypes.number,
};

DropdownSelect.defaultProps = {
  placeholder: "Select Option",
  onSelect: () => {},
  error: false,
  errorMessage: "Invalid selection",
  onInvalidateError: () => {},
  onDropdownExpand: () => {},
  defaultSelected: false,
  fullWidth: false,
  showImage: false,
  selectedHighlight: false,
  heightPixels: 298,
};

const DropdownFieldContainer = styled.div`

  display: ${(props) => (props.fullWidth ? "inline-block" : "flex")};
  flex: auto;
  width: ${(props) => (props.fullWidth ? "100%" : "25%")};
  margin-right: 10px;
  color: #474b55;
  *{
    box-sizing: border-box!important;
  }
  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;

const DropdownField = styled.div`
  border-radius: 4px;
  border: ${(props) => (props.isOpen ? "2px solid rgb(0, 56, 99)" : "solid 1px #a8abac")};
  background-color: #ffffff;
  cursor: pointer;
  text-align: left;
  margin: auto;
  width: 100%;
  position: relative;
  margin-bottom: 8px;
width: -webkit-fill-available;
padding: ${(props) => (props.showImage ? "9px 0px 9px 0px" : "6px 0px 6px 0px")};
background-color: #ffffff;
font-size: 16px;
font-weight: 300;
font-family: "museo-sans";
background: ${(props) => (props.showImage ? "url(react/images/icons-solid-user.svg) no-repeat scroll #ffffff 10px 13px" : "")};
border: ${(props) => (props.error ? "solid 1px #ad122a" : "")};
  &:focus {
    box-shadow: none;
  }
  &:focus .hf-preference-center-dropdown-content {
    display: block;
  }
  &.selected{
    background: ${(props) => (props.showImage ? "url(react/images/icons-solid-user-dark-grey.svg) no-repeat scroll #ffffff 10px 13px" : "")};
  }
`;

const DropdownFieldText = styled.div`
  font-size: 16px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #a8abac;
  padding: 0px 0px 0px 0px;
  display: inline-block;
  vertical-align: middle;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 24px;
  width: calc(100% - 40px);
  &.selected {
    color: #474b55;
  }
  &.error {
    color: #ad122a;
  }
`;

const DropdownFieldTextContainer = styled.div`
  width: 100%;
  padding: ${(props) => (props.showImage ? "0px 0px 0px 35px" : "0px 0px 0px 1rem")};
`;

const DropdownIconContainer = styled.div`
  display: inline-block;
`;

const DropdownIcon = styled.img`
  position: relative;
  width: 20px;
  height: 20px;
  object-fit: cover;
  overflow: hidden;
  margin: -5px 8px -4px 8px;
  vertical-align: middle;
  &.selected {
    color: #474b55;
  }
`;

const DropdownList = styled.div`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: absolute;
  background-color: #ffffff;
  max-height: ${(props) => (props.heightPixels ? props.heightPixels+"px" : "298px")};
  margin: 13px 0px;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 #d8d8d8;
  background-color: #ffffff;
  list-style-type: none;
  padding: 6px 0px;
  overflow: hidden;
  overflow-y: auto;
  z-index: 1;
  width: 100%;
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb {
    background: #d8d8d8;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #c3c3ce;
  }
  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;

const DropdownListItem = styled.button`
  font-size: 16px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: #474b55;
  text-align: left;
  border: none;
  background-color: ${(props) => (props.selectedHighlight && props.name == props.selection ? "#e5e5e5" : "#ffffff")};
  padding: 9px 12px;
  display: block;
  cursor: pointer;
  z-index: 2;
  width: inherit;
  &:focus {
    box-shadow: none;
  }
  &:hover {
    background-color: #f8f8f8;
  }
  h1{
    font-weight: 500;
    font-family: "museo-sans";
    font-size: 16px;
    color: #474b55;
    padding: 0;
    margin: 0;
  }
  h2{
    font-weight: ${(props) => (props.selectedHighlight && props.name == props.selection ? "500" : "300")};
    font-family: "museo-sans";
    font-size: 16px;
    color: #474b55;
    padding: 0;
    margin: 0;
  }
  p{
    font-weight: 300;
    font-family: "museo-sans";
    font-size: 12px;
    color: #474b55;
    padding: 0;
    margin: 0;
  }
`;

const DropdownErrorMsg = styled.div`
  font-size: 12px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #a0252c;
`;

const HorizontalLine = styled.div`
  border-bottom: solid 1px #d8d8d8;
  margin: 0px 12px;
`;