const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "button_inactive",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error",
};

const hasInvalidInput = (inputList) => {
  return inputList.some((input) => {
    return !input.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonElement, config) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add(config.inactiveButtonClass);
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove(config.inactiveButtonClass);
    buttonElement.disabled = false;
  }
};
const disabledButton = (buttonElement) => {
  buttonElement.disabled = true;
};

const hideInputError = (formElement, inputElement, settings) => {
  const errorMsgEl = formElement.querySelector(
    "#" + inputElement.id + "-error",
  );
  errorMsgEl.textContent = "";
  inputElement.classList.remove(settings.inputErrorClass);
};

const checkInputValidity = (formElement, inputElement) => {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage);
  } else {
    hideInputError(formElement, inputElement, settings);
  }
};
const showInputError = (formElement, inputElement, errorMessage) => {
  const errorMsgID = inputElement.id + "-error";
  const errorMsgEl = formElement.querySelector("#" + errorMsgID);
  errorMsgEl.textContent = errorMessage;
  errorMsgEl.classList.add(settings.errorClass);
  inputElement.classList.add(settings.inputErrorClass);
};

const enableValidation = (settings) => {
  const formList = document.querySelectorAll(settings.formSelector);
  formList.forEach((formElement) => {
    const inputList = Array.from(
      formElement.querySelectorAll(settings.inputSelector),
    );
    const buttonElement = formElement.querySelector(
      settings.submitButtonSelector,
    );

    inputList.forEach((inputElement) => {
      inputElement.addEventListener("input", function () {
        checkInputValidity(formElement, inputElement);
        toggleButtonState(inputList, buttonElement, settings);
      });
    });

    toggleButtonState(inputList, buttonElement, settings);
  });
};
enableValidation(settings);
