import React, { useEffect } from "react";
import {
  ModalWrapper,
  ModalCard,
  ModalCloseIcon,
  ModalCardTitle,
  ModalCardBody,
  ModalControlsWrapper,
  ModalCloseBtn,
  ModalParagraph,
} from "../styles";

const Modal = ({ modal, closeModal }) => {
  useEffect(() => {
    if (modal.isVisible) {
      document.querySelector("body").style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      document.querySelector("body").style.overflow = null;
    }
  }, [modal.isVisible]);

  return (
    <>
      {modal.isVisible && (
        <ModalWrapper>
          <ModalCard>
            <ModalCloseIcon
              src="/react/images/icn-close-bold.svg"
              onClick={closeModal}
            />
            <ModalCardTitle>{modal?.info?.title}</ModalCardTitle>
            <ModalCardBody>{modal?.info?.content}</ModalCardBody>
            <ModalControlsWrapper>
              <ModalCloseBtn onClick={closeModal}>Close</ModalCloseBtn>
            </ModalControlsWrapper>
          </ModalCard>
        </ModalWrapper>
      )}
    </>
  );
};

export default Modal;
