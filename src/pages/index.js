import enableValidation from "../utils/validation.js";
import "./index.css";
import headerLogo from "../images/header-logo.svg";
import profilePic from "../images/profilepic.jpg";
import plusSign from "../images/plus-sign.svg";
import Api from "../utils/Api.js";

document.querySelector(".header__logo-image").src = headerLogo;
document.querySelector(".plus-sign").src = plusSign;

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
    "Content-Type": "application/json",
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
  console.log(data);

  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  // IMPORTANT: set cardId here
  cardElement.dataset.cardId = data._id;

  likeButton.addEventListener("click", function () {
    const cardId = cardElement.dataset.cardId;

    const isLiked = likeButton.classList.contains("card__like-button_is-liked");

    if (!isLiked) {
      api
        .addLike(cardId)
        .then(() => {
          likeButton.classList.add("card__like-button_is-liked");
        })
        .catch(console.error);
    } else {
      api
        .removeLike(cardId)
        .then(() => {
          likeButton.classList.remove("card__like-button_is-liked");
        })
        .catch(console.error);
    }
  });

  deleteButton.addEventListener("click", function () {
    openModal(deletePopupModal);
    cardToDelete = deleteButton.closest(".card");
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
api
  .getAppInfo()
  .then(([userData, cards]) => {
    profileNameEl.textContent = userData.name;
    profileDescriptionEl.textContent = userData.about;
    document.querySelector(".profile__picture").src = userData.avatar;

    cards.forEach((card) => {
      const cardElement = renderCard(card);
      cardsList.prepend(cardElement);
    });
  })
  .catch((err) => {
    console.log(err);
  });

const newPostButtonEl = document.querySelector(".profile__add-button");
const editProfileForm = document.forms["edit-profile-form"];
const newPostForm = document.forms["new-post-form"];
const editAvatarForm = document.forms["edit-avatar-form"];
const profileAvatarBtn = document.querySelector(".profile__avatar-btn");
const editAvatarModal = document.querySelector("#edit-avatar-modal");
const deletePopupModal = document.getElementById("delete-popup-modal");
const deleteModalCloseBtn = document.querySelector(".delete__modal__close-btn");
const newPostTitleInput = newPostModalEl.querySelector("#card-caption-input");
const newPostImageInput = newPostModalEl.querySelector("#card-image-input");
const editAvatarCloseButton = editAvatarModal.querySelector(".modal__close-btn");

let cardToDelete;

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

  const submitButton = event.submitter;
  submitButton.textContent = "Saving...";

  const avatarUrl = event.target.elements["profile-avatar-input"].value;

  api
    .editAvatar({ avatar: avatarUrl })
    .then((userData) => {
      document.querySelector(".profile__picture").src = userData.avatar;
      closeModal(editAvatarModal);
    })
    .catch(console.error)
    .finally(() => {
      submitButton.textContent = "Save";
    });
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  const submitButton = evt.submitter;
  submitButton.textContent = "Saving...";

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((res) => {
      profileNameEl.textContent = res.name;
      profileDescriptionEl.textContent = res.about;

      closeModal(profileModal);
      submitButton.textContent = "Save";
    })
    .catch((err) => {
      console.error(err);
      submitButton.textContent = "Save";
    });
}

function handleNewPostFormSubmit(evt) {
  evt.preventDefault();

  const titleValue = newPostTitleInput.value;
  const linkValue = newPostImageInput.value;
  const submitButton = evt.submitter;
  submitButton.textContent = "Saving...";

  api
    .addCard({ name: titleValue, link: linkValue })
    .then((newCard) => {
      const cardElement = renderCard(newCard);
      cardsList.prepend(cardElement);

      closeModal(newPostModalEl);
      newPostForm.reset();
      submitButton.textContent = "Save";
    })
    .catch((err) => {
      console.error(err);
      submitButton.textContent = "Save";
    });
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

editAvatarCloseButton.addEventListener("click", function () {
  closeModal(editAvatarModal);
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
deleteModalCloseBtn.addEventListener("click", function () {
  closeModal(deletePopupModal);
});

const deleteModalButton = document.querySelector(".delete__modal__button");

deleteModalButton.addEventListener("click", function () {
  deleteModalButton.textContent = "Deleting...";

  api
    .removeCard(cardToDelete.dataset.cardId)
    .then(() => {
      cardToDelete.remove();
      deleteModalButton.textContent = "Deleted!";
      closeModal(deletePopupModal);
    })
    .catch((err) => {
      console.log(err);
      deleteModalButton.textContent = "Delete";
    });
});

previewModal.addEventListener("click", function (evt) {
  if (evt.target === previewModal) {
    closeModal(previewModal);
  }
});

enableValidation(settings);
