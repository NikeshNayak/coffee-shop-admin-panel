import { config } from "./urls";

export const BASEURL = config.HOSTURL;
export const COMPANYBASEURL = config.COMPANYBASEURL;
export const AGENTBASEURL = config.AGENTBASEURL;
export const CATEGORYBASEURL = config.CATEGORYBASEURL;

// export const COMPANYLOGOURL = `${config.COMPANYBASEURL}companylogo/`;
export const AGENTLOGOURL = `${config.AGENTBASEURL}agentlogo/`;

export const COMPANY_MEDIA_BASEURL = `${config.COMPANYBASEURL}media/`;
// export const COMPANY_PDF_BASEURL = `${config.COMPANYBASEURL}maincatpdf/`;
// export const COMPANY_IMAGES_BASEURL = `${config.COMPANYBASEURL}maincatimage/`;
// export const COMPANY_VIDEOS_BASEURL = `${config.COMPANYBASEURL}maincatvideos/`;
// export const COMPANY_VIDEOSTHUMB_BASEURL = `${config.COMPANYBASEURL}maincatthumb/`;

export const CATEGORY_MEDIA_BASEURL = `${config.CATEGORYBASEURL}catmedia/`;
// export const CATEGORY_PDF_BASEURL = `${config.CATEGORYBASEURL}catpdf/`;
// export const CATEGORY_IMAGES_BASEURL = `${config.CATEGORYBASEURL}catimage/`;
// export const CATEGORY_VIDEOS_BASEURL = `${config.CATEGORYBASEURL}catvideo/`;
// export const CATEGORY_VIDEOSTHUMB_BASEURL = `${config.CATEGORYBASEURL}catthumb/`;

export const APIRoutes = {
  login: "auth/admin/login",
  changepassword: "auth/admin/changepassword",
  forgotpassword: "auth/admin/forgotpassword",
  resetpassword: "auth/admin/resetpassword",
  validateToken: "auth/admin/validatetoken",
  staffList: "auth/admin/getstafflist",
  getStaffDetails: "auth/admin/getstaffdetails",
  addStaff: "auth/admin/addstaff",
  updateStaff: "auth/admin/updatestaff",
  deleteStaff: "auth/admin/deletestaff",
  getAllPermissionsList: "auth/admin/getallpermissionslist",
  
  getDashboardData: "auth/admin/dashboarddata",
  createKeys: "keys/admin/createkeys",
  getCitiesList: "places/getcitieslist",
  getStatesList: "places/getstateslist",
  getStatesListByCountry: "places/getstateslistbycountry",
  getCountriesList: "places/getcountrieslist",
  getNewKeys: "keys/admin/getnewkeys",
  getUsedKeys: "keys/admin/getusedkeys",
  getAllUsedKeys: "keys/admin/getallusedkeys",
  getAgentAssignedKeys: "keys/admin/getagentassignedkeys",
  getAllAgentAssignedKeys: "keys/admin/getallagentassignedkeys",
  getProductKey: "keys/admin/getproductkey",
  deleteKey: "keys/admin/deletekey",
  createCompany: "admin/createcompany",
  updateCompany: "admin/updatecompany",
  getCompanyDetails: "company/admin/getcompanydetails",
  getAllCompaniesList: "company/admin/getallcompanieslist",
  getDashboardCompaniesList: "company/admin/getdasboardcompanieslist",
  getCompaniesList: "company/admin/getcompanieslist",
  getCompaniesExcelExport: "company/admin/getcompaniesexcelexport",
  enabledisableCompany: "company/admin/enabledisablecompany",
  deleteCompany: "company/admin/deletecompany",
  renewSubcription: "company/admin/renewsubscription",
  addAgent: "admin/addagent",
  updateAgent: "admin/updateagent",
  getAgentDetails: "agent/admin/getagentdetails",
  getDashboardAgentsList: "agent/admin/getdashboardagentslist",
  getAgentsList: "agent/admin/getagentslist",
  getAgentsExcelReport: "agent/admin/getagentsexcelreport",
  getAllAgentsList: "agent/admin/getallagentslist",
  deleteAgent: "agent/admin/deleteagent",
  enabledisableAgent: "agent/admin/enabledisableagent",
  getAllCategoryList: "category/admin/getallcategorylist",
  addCategory: "admin/addcategory",
  updateCategory: "admin/updatecategory",
  getCategoryDetails: "category/admin/getcategorydetails",
  deleteCategory: "category/admin/deletecategory/",
  getMainCategorylist: "category/admin/getmaincategorylist",
  getCatalogueChart: "catalogue/admin/cataloguechart",
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
