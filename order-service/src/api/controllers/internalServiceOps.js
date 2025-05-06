const axios = require("axios");
const urls = require("../../config/serviceUrls");

class ServiceError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
    }
}

const getMenuDetails = async (id) => {
    try {
        const response = await axios.get(`${urls.menuService}/menu-service/inter-service/send-menu/${id}`)

        const menu = response.data;

        return menu;

    } catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            throw new ServiceError(
              data.message || "Service error",
              status
            );
          }
          
          console.error("Service unreachable:", error.message);
          throw new ServiceError(
            "Unable to contact to the Service",
            502 
          );
    }
}

const getUserAddress = async (id) => {
    try {
        const response = await axios.get(`${urls.userService}/user-service/inter-service/get-user-address/${id}`)

        const address = response.data;
        console.log("Address information taken from User Service: ",address);
        return address;
    } catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            throw new ServiceError(
              data.message || "Service error",
              status
            );
          }
          
          console.error("Service unreachable:", error.message);
          throw new ServiceError(
            "Unable to contact to the User Service",
            502 
          );
    }
}

module.exports = {
    getMenuDetails,
    getUserAddress,
    ServiceError
}