import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { DropdownFieldContainer, DropdownField, DropdownFieldText, DropdownSecondFieldText, DropdownFieldTextContainer, UserIconContainer, DropdownIconContainer, DropdownIcon, DropdownList, DropdownListItem, DropdownErrorMsg, UserCircleIcon, DropdownFieldTitle, UserInfoContainer } from './styles'

function DependentDropdown(props) {  
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
  } = props;

  /* states */
  const [selection, setSelection] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

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
    onSelect(item);
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
    if (values.length > 0) {
      if (!isOpen) onDropdownExpand();
      setIsOpen(!isOpen);
    }
  };

  return (
    <>
    <DropdownFieldTitle>Select Member</DropdownFieldTitle>
    <DropdownFieldContainer ref={dropdownRef}>
      <DropdownField
        className={`${error && "error"}`}
        onClick={handleDropdownClick}
      >
        <DropdownFieldTextContainer>
          <UserIconContainer>
            <UserCircleIcon src="react/images/icons-solid-user-dark-grey.svg" />
          </UserIconContainer>
          <DropdownFieldText className={`${selection && "selected"} ${error && "error"}`}>
              {selection || placeholder}
            <DropdownSecondFieldText>{props.selected.planName}</DropdownSecondFieldText>
          </DropdownFieldText>
          <DropdownIconContainer>
            <DropdownIcon src={!isOpen ? "react/images/icn-dropdown.svg" : "react/images/icn-dropdown-up.svg"} />
          </DropdownIconContainer>
        </DropdownFieldTextContainer>
        <DropdownList className="hf-preference-center-dropdown-content" isOpen={isOpen}>
          {values.map((item, index) => (
            <React.Fragment key={Math.random()}>
              <DropdownListItem
                onClick={(e) => handleSelect(item, e)}
                name={item.label}
                value={item.value}
              >
                <UserIconContainer>
                  <UserCircleIcon src="react/images/icons-solid-user-dark-grey.svg" />
                </UserIconContainer>
                <UserInfoContainer>
                  {item.planName === "" ?
                  <h1>{item.label}</h1>
                  :
                  <div>
                  <h2>{item.label}</h2>
                  <p>{item.planName}</p>
                  </div>
                  }
                </UserInfoContainer>
              </DropdownListItem>
            </React.Fragment>
          ))}
        </DropdownList>
      </DropdownField>
      {error && <DropdownErrorMsg>{errorMessage}</DropdownErrorMsg>}
    </DropdownFieldContainer>
    </>
  );
}

export default React.memo(DependentDropdown);

DependentDropdown.propTypes = {
  placeholder: PropTypes.string,
  values: PropTypes.oneOfType([PropTypes.array.isRequired]).isRequired,
  onSelect: PropTypes.func,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  onInvalidateError: PropTypes.func,
  onDropdownExpand: PropTypes.func,
  defaultSelected: PropTypes.bool,
};

DependentDropdown.defaultProps = {
  placeholder: "Select Option",
  onSelect: () => {},
  error: false,
  errorMessage: "Invalid selection",
  onInvalidateError: () => {},
  onDropdownExpand: () => {},
  defaultSelected: false,
};