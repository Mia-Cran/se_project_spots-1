import enableValidation  from "../utils/validation.js";
import './index.css';
import headerLogo from '../images/header-logo.svg';
import profilePic from '../images/profilepic.jpg';  
import plusSign from '../images/plus-sign.svg';
import Api from "../utils/Api.js";

document.querySelector('.header__logo-image').src = headerLogo;
document.querySelector('.profile__picture').src = profilePic;
document.querySelector('.plus-sign').src = plusSign;

const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Landscape view",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
];


const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "button_inactive",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error",
};

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "6396738b-559a-4b24-8df0-2d3b78f72214",
    "Content-Type": "application/json"
  },
});

const previewModal = document.getElementById("preview-image-modal");
const previewImage = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");
const previewCloseButton = previewModal.querySelector(
  ".modal__close-btn.modal__close-btn_type_preview",
);
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

function renderCard(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const likeButton = cardElement.querySelector(".card__like-button");
  likeButton.addEventListener("click", function () {
    likeButton.classList.toggle("card__like-button_is-liked");
  });

  const deleteButton = cardElement.querySelector(".card__delete-button");
  deleteButton.addEventListener("click", function () {
    deleteButton.closest(".card").remove();
    openModal(deletePopupModal);
  });
  cardImageEl.addEventListener("click", () => {
    previewCaption.textContent = data.name;
    previewImage.src = data.link;
    previewImage.alt = data.name;
    openModal(previewModal);
  });

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;
  return cardElement;
}
initialCards.forEach(function (item) {
  const cardElement = renderCard(item);
  cardsList.prepend(cardElement);
});

const editButton = document.querySelector(".profile__edit-profile-button");
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const profileCloseButton = document.querySelector(".modal__close-btn");
const newPostCloseButton = document.querySelector(
  "#new-post-modal .modal__close-btn",
);
const profileModal = document.querySelector("#edit-profile-modal");
const newPostModalEl = document.querySelector("#new-post-modal");
const editProfileNameInput = document.querySelector("#profile-name-input");
const editProfileDescriptionInput = document.querySelector(
  "#profile-description-input",
);
const newPostButtonEl = document.querySelector(".profile__add-button");
const editProfileForm = document.forms["edit-profile-form"];
const newPostForm = document.forms["new-post-form"];
const editAvatarForm = document.forms["edit-avatar-form"];
const profileAvatarBtn = document.querySelector(".profile__avatar-btn");
const editAvatarModal = document.querySelector("#edit-avatar-modal");
const deletePopupModal = document.getElementById("delete-popup-modal");

window.addEventListener('load', () => {
  console.log("Window loaded!");
  api.getUserInfo()
  .then((userData) => {
    console.log(userData);
    profileNameEl.textContent = userData.name;
    profileDescriptionEl.textContent = userData.about;
  })
  .catch((error) => {
    console.log('Error loading user info:', error);
  });
});


function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscapeKey);
}
function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscapeKey);
}
function handleEscapeKey(evt) {
  if (evt.key === "Escape") {
    if (profileModal.classList.contains("modal_is-opened"))
      closeModal(profileModal);
    if (newPostModalEl.classList.contains("modal_is-opened"))
      closeModal(newPostModalEl);
    if (previewModal.classList.contains("modal_is-opened"))
      closeModal(previewModal);
    if (editAvatarModal.classList.contains("modal_is-opened"))
      closeModal(editAvatarModal);
  }
}

editButton.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  openModal(profileModal);
});

function handleEditAvatar(event) {
  event.preventDefault();
  const avatarUrl = event.target.elements["profile-avatar-input"].value;
  api.editAvatar({avatar: avatarUrl})
  .then((userData) =>{
    document.querySelector('.profile__picture').src = userData.avatar;
    closeModal(editAvatarModal);
  })
  .catch(console.error);
}


function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  api.editUserInfo({
    name: editProfileNameInput.value,
    about: editProfileDescriptionInput.value
  }).then((res) => {
    profileNameEl.textContent = res.name;
    profileDescriptionEl.textContent = res.about;
    closeModal(profileModal);
  }).catch(console.error)
}

function handleNewPostFormSubmit(evt) {
  evt.preventDefault();
  const imageLink = evt.target.elements["card-image-input"].value;
  const caption = evt.target.elements["card-caption-input"].value;
  closeModal(newPostModalEl);
  const newCard = { name: caption, link: imageLink };
  const newCardElement = renderCard(newCard);
  cardsList.prepend(newCardElement);
  newPostForm.reset();
}
editProfileForm.addEventListener("submit", handleProfileFormSubmit);
newPostForm.addEventListener("submit", handleNewPostFormSubmit);
editAvatarForm.addEventListener("submit", handleEditAvatar);

profileCloseButton.addEventListener("click", function () {
  closeModal(profileModal);
});

newPostButtonEl.addEventListener("click", function () {
  openModal(newPostModalEl);
});

profileAvatarBtn.addEventListener("click", function () {
  openModal(editAvatarModal);
});

newPostCloseButton.addEventListener("click", function () {
  closeModal(newPostModalEl);
});
previewCloseButton.addEventListener("click", function () {
  closeModal(previewModal);
});

profileModal.addEventListener("click", function (evt) {
  if (evt.target === profileModal) {
    closeModal(profileModal);
  }
});

newPostModalEl.addEventListener("click", function (evt) {
  if (evt.target === newPostModalEl) {
    closeModal(newPostModalEl);
  }
});
editAvatarModal.addEventListener("click", function (evt) {
  if (evt.target === editAvatarModal) {
    closeModal(editAvatarModal);
  }
});

previewModal.addEventListener("click", function (evt) {
  if (evt.target === previewModal) {
    closeModal(previewModal);
  }
});

enableValidation(settings);