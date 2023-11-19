import configData from "../config";
import request from "request";
import connection from "../db/mongodb_databse";

const weatherData = async (city): Promise<object> => {
  const url =
    configData.weatherConfig.URL +
    city +
    configData.weatherConfig.Unit +
    configData.weatherConfig.KEY;
  await connection.establishConnection();
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
