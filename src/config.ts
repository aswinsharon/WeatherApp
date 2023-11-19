const config = {
  weatherConfig: {
    URL: "https://api.openweathermap.org/data/2.5/weather?q=",
    KEY: process.env.API_SECRET_KEY,
    Unit: "&units=metric&appid=",
  },
};

export default config;
