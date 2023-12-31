import axios from "axios";

const API_URL = `/usersStore/`;

interface Body {
  [key:string]: string
}
export const register = (body:Body) => {
  return axios.post(API_URL + "signup", {
    ...body
  });
};
const instance = axios.create({
  withCredentials: true,
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Cache: "no-cache",
  },
})
export const myself = (token: string) => {
  instance.defaults.headers.common.Authorization = `Bearer ${token}`;
  return instance
    .get("myself");
}
export const logout = () => {
  return instance
    .post("logout")
    .then((response: { data: { accessToken: any; }; }) => {
      delete instance.defaults.headers.common["Authorization"];
      return response.data;
    });
};

export const getCurrentUser = () => {
  return null;
}; 