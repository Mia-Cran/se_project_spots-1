class Api {
  constructor({baseUrl, headers}) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }
   _handleResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  }
    getAppInfo() {
    return Promise.all([
      this.getUserInfo(),
      this.getCards()
    ]);
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers
    })
      .then(res => this._handleResponse(res))
  }
  getCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers
  })
    .then(res => this._handleResponse(res))
  } 

  editUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name,
        about,
      }),
      }).then((res) => this._handleResponse(res));
  }
  editAvatar({ avatar }) {
  return fetch(`${this._baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: this._headers,
    body: JSON.stringify({ avatar }),
  }).then((res) => this._handleResponse(res));
}
  removeCard(cardId) {
  return fetch(`${this._baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: this._headers,
  }).then((res) => this._handleResponse(res));
}
  addCard(values) {
  return fetch(`${this._baseUrl}/cards`, {
    method: "POST",
    body: JSON.stringify(values),
    headers: this._headers,
  }).then((res) => this._handleResponse(res));
}
  addLike(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "PUT",
      headers: this._headers,
    }).then((res) => this._handleResponse(res));
}
  removeLike(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "DELETE",
      headers: this._headers,
    }).then((res) => this._handleResponse(res));
}
}

export default  Api;