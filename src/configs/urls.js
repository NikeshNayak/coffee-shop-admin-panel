const prod = {
  HOSTURL: "https://mediaspartans.com:9443/api/",
  COMPANYBASEURL: "https://mediaspartans.com:8443/",
  AGENTBASEURL: "https://mediaspartans.com:7443/",
  CATEGORYBASEURL: "https://mediaspartans.com:6443/",
};

const dev = {
  HOSTURL: "http://localhost:36900/api/",
  COMPANYBASEURL: "http://localhost:36903/",
  AGENTBASEURL: "http://localhost:36904/",
  CATEGORYBASEURL: "http://localhost:36905/",
};

export const config = process.env.NODE_ENV === `development` ? dev : prod;
