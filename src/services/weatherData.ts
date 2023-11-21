import configData from "../config";
import request from "request";

const weatherData = async (city): Promise<object> => {
  const url =
    configData.weatherConfig.URL +
    city +
    configData.weatherConfig.Unit +
    configData.weatherConfig.KEY;
  return await new Promise(function (resolve, reject) {
    request(
      { url, json: true },
      async (error: any, response: any, body: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(body);
        }
      }
    );
  });
};

export default weatherData;
