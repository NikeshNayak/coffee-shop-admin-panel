import { config } from "./urls";

export const BASEURL = config.HOSTURL;

export const MEDIA_URL = `${config.HOSTURL}media/`;


export const APIRoutes = {
  login: "admin/auth/login",
  changepassword: "admin/auth/changepassword",
  forgotpassword: "admin/auth/forgotpassword",
  resetpassword: "admin/auth/resetpassword",
  validateToken: "admin/auth/validatetoken",

  getCitiesList: "places/getcitieslist",
  getStatesList: "places/getstateslist",
  getStatesListByCountry: "places/getstateslistbycountry",
  getCountriesList: "places/getcountrieslist",
  
  getUsersList: "admin/users/getuserslist",
  getUserDetails: "admin/users/getuserdetails",
  deleteUsers: "admin/users/deleteuser",

  addProduct: "admin/product/addproduct",
  updateProduct: "admin/product/updateproduct",
  getProductDetails: "admin/product/getproductdetails",
  getProductList: "admin/product/getproductlist",
  deleteProduct: "admin/product/deleteproduct",
};

export const formatToLocalTime = (utcDateTimeString) => {
  const date = new Date(utcDateTimeString);

  const padToTwoDigits = (num) => num.toString().padStart(2, "0");

  const day = padToTwoDigits(date.getDate());
  const month = padToTwoDigits(date.getMonth() + 1); // Months are zero-based
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = padToTwoDigits(date.getMinutes());
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // The hour '0' should be '12'

  // const formattedDate = `${day}-${month}-${year} ${padToTwoDigits(
  //   hours
  // )}:${minutes} ${ampm}`;
  const formattedDate = `${day}-${month}-${year}`;
  return formattedDate;
};

export function formatDateToDMY(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-based
  const year = date.getFullYear();

  // Ensure day and month are always two digits
  const formattedDay = day < 10 ? "0" + day : day;
  const formattedMonth = month < 10 ? "0" + month : month;

  return `${year}-${formattedMonth}-${formattedDay}`;
}
