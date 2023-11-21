"use strict";

import express, { Express, Request, Response } from "express";
import serverless from "serverless-http";
import dotenv from "dotenv";
import path from "path";
dotenv.config();

import common_utils from "./common_utils";
import weatherData from "./services/weatherData";
import { WeatherType } from "./Types/types";
import mogodb_database from "./db/mongodb_databse";
import mysql_database from "./db/mysql_database";

const app: Express = express();
const port = process.env.PORT;
const currentDirectory = __dirname;
const rootDir = path.resolve(currentDirectory, "../../");

//import mysql_database from "./db/mysql_database";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, "public")));

app.get("/", async (req: Request, res: Response) => {
  res.sendFile(rootDir + "/public/html/index.html");
});
app.get("/preconnect", async (req: Request, res: Response) => {
  try {
    const cityDataPreload: any = await mysql_database.getLastSearchCity();
    console.log(cityDataPreload);
    if (cityDataPreload.length) {
      res.json({
        preconnect_city: cityDataPreload[0].CITY,
      });
    } else {
      res.json({
        preconnect_city: undefined,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/weatherData", async (req: Request, res: Response) => {
  let city: any;
  let weatherApiResponse: any;
  let current_city_time: string;
  let weatherObj: WeatherType;

  city = req?.query?.city;
  weatherApiResponse = await weatherData(city);
  if (weatherApiResponse.cod == 200) {
    current_city_time = await common_utils.cityDateTime(
      weatherApiResponse.timezone
    );
    weatherObj = {
      City: city,
      Current_Time: current_city_time,
      Temperature: weatherApiResponse.main.temp + "°C",
      Feels_like: weatherApiResponse.main.feels_like + "°C",
      Minimum_Temperature: weatherApiResponse.main.temp_min + "°C",
      Maximum_Temperature: weatherApiResponse.main.temp_max + "°C",
    };
    res.json(weatherApiResponse);
    await mogodb_database.insertIntoMongoDbDatabase(weatherObj);
    await mysql_database.handleDataUpdation(weatherObj);
    console.log(weatherApiResponse);
  } else if (weatherApiResponse.cod == 404) {
    res.json(weatherApiResponse);
  } else {
    res.json({ message: "something went wrong... please try again" });
  }
});
app.get("/getWeatherInfo", async (req, res) => {
  let responseFromDataBase: object;
  responseFromDataBase = await mogodb_database.getDataFromDataBase();
  res.json({ responseFromDataBase });
});

app.get("/weatherInfo", async (req, res) => {
  res.sendFile(rootDir + "/public/html/weathersPage.html");
});

const startApplicationServer = async () => {
  app.listen(port, async () => {
    console.log(`server started in port ${port}`);
  });
};
const startServer = async () => {
  try {
    await Promise.all([
      await mogodb_database.establishConnection(),
      await mysql_database.establishConnection(),
    ]);
    await mysql_database.handleTableCreation();
    await startApplicationServer();
  } catch (error) {
    console.log("error in connnecting to servers");
  }
};

(async () => {
  await startServer();
})();
exports.handler = serverless(app);
