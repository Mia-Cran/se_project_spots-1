class Api {
  constructor({baseUrl, headers}) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers
    })
      .then(res => res.json());
  }
  getCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers
  })
    .then(res => res.json());
  }

  editUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name,
        about,
      }),
    }).then((res) => {
      return res.json();
    });
  }
  editAvatar({ avatar }) {
  return fetch(`${this._baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: this._headers,
    body: JSON.stringify({ avatar }),
  }).then((res) => {
    return res.json();
  });
}
  removeCard(cardId) {
  return fetch(`${this._baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: this._headers,
  }).then((res) => {
    return res.json();
  });
}
  addCard(values) {
  return fetch(`${this._baseUrl}/cards`, {
    method: "POST",
    body: JSON.stringify(values),
    headers: this._headers,
  }).then((res) => {
    return res.json();
  });
}
  addLike(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "PUT",
      headers: this._headers,
    }).then((res) => {
      return res.json();
    });
}
  removeLike(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "PUT",
      headers: this._headers,
    }).then((res) => {
      return res.json();
    });
}
}

export default  Api;