import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
  DropdownFieldContainer,
  DropdownField,
  DropdownFieldText,
  DropdownSecondFieldText,
  DropdownFieldTextContainer,
  UserIconContainer,
  DropdownIconContainer,
  DropdownIcon,
  DropdownList,
  DropdownListItem,
  DropdownErrorMsg,
  UserCircleIcon,
  DropdownFieldTitle,
} from "./styles";

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
      setSelection({ label: values[0].label, id: values[0].value });
    } else if (props.selected) {
      setSelection({
        label: props.selected.label,
        id: props.selected.memberId,
      });
    }
  }, []);

  /* functions */

  // handler for when user selects a value
  const handleSelect = (item, e) => {
    setIsOpen(!isOpen);
    setSelection({ label: item.label, id: item.value });
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
    <DropdownContainer>
      <DropdownFieldTitle>Select Member</DropdownFieldTitle>
      <DropdownFieldContainer ref={dropdownRef}>
        <DropdownField
          className={`${error && "error"}`}
          onClick={handleDropdownClick}
        >
          <DropdownFieldTextContainer>
            <UserIconContainer>
              <UserCircleIcon
                alt=""
                src="/react/images/icons-solid-user-dark-grey.svg"
              />
            </UserIconContainer>
            <DropdownFieldText
              className={`${selection?.id && "selected"} ${error && "error"}`}
            >
              {selection?.label || placeholder}
              <DropdownSecondFieldText>
                {props.selected.planName}
              </DropdownSecondFieldText>
            </DropdownFieldText>
            <DropdownIconContainer>
              <DropdownIcon
                alt=""
                src={
                  !isOpen
                    ? "/react/images/icn-dropdown.svg"
                    : "/react/images/icn-dropdown-up.svg"
                }
              />
            </DropdownIconContainer>
          </DropdownFieldTextContainer>
          <DropdownList
            className="hf-preference-center-dropdown-content"
            isOpen={isOpen}
          >
            {values.map((item, index) => (
              <React.Fragment key={index}>
                <DropdownListItem
                  onClick={(e) => handleSelect(item, e)}
                  name={item.label}
                  value={item.value}
                  currentSelection={selection?.id}
                >
                  <UserIconContainer>
                    <UserCircleIcon
                      alt=""
                      src="/react/images/icons-solid-user-dark-grey.svg"
                    />
                  </UserIconContainer>
                  {item.planName === "" ? (
                    <div>
                      <h1>{item.label}</h1>
                    </div>
                  ) : (
                    <div>
                      <h2>{item.label}</h2>
                      <p>{item.planName}</p>
                    </div>
                  )}
                </DropdownListItem>
              </React.Fragment>
            ))}
          </DropdownList>
        </DropdownField>
        {error && <DropdownErrorMsg>{errorMessage}</DropdownErrorMsg>}
      </DropdownFieldContainer>
    </DropdownContainer>
  );
}

export default React.memo(DependentDropdown);

const DropdownContainer = styled.div``;

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
