class Api {
  constructor() {
  this._baseUrl = "https://around-api.en.tripleten-services.com/v1";
  this._headers = {
    authorization: "c56e30dc-2883-4270-a59e-b2f7bae969c6"
  };
  }
  getUserInfo() {
  return fetch(`${this._baseUrl}/users/me`, {
    headers: this._headers
  })
  .then(res => res.json());
}
}
export { Api };