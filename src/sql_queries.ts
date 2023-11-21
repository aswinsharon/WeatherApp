export abstract class Queries {
  static readonly INSERT_QUERY =
    "INSERT INTO WEATHER (CITY, `CURRENT_TIME`, TEMPERATURE,FEELS_LIKE, MAX_TEMPERATURE, MIN_TEMPERATURE) VALUES (?,?,?,?,?,?)";

  static readonly GET_LAST_QUERY =
    "SELECT CITY FROM WEATHER ORDER BY WEATHER_ID DESC LIMIT 1";

  static readonly CREATE_SCHEMA_QUERY =
    "CREATE TABLE WEATHER(WEATHER_ID INT AUTO_INCREMENT PRIMARY KEY,CITY VARCHAR(25) NOT NULL,`CURRENT_TIME` VARCHAR(25) NOT NULL,TEMPERATURE VARCHAR(25) NOT NULL,FEELS_LIKE VARCHAR(25) NOT NULL,MAX_TEMPERATURE VARCHAR(25) NOT NULL,MIN_TEMPERATURE VARCHAR(25) NOT NULL)";

  static readonly VERIFY_TABLE_EXISTS = `SHOW TABLES IN weather_data LIKE "WEATHER"`;
  static readonly FIND_DATA_QUERY = `SELECT * FROM WEATHER WHERE CITY = ?`;
  static readonly UPDATE_DATA_QUERY =
    "UPDATE WEATHER SET CITY=?, `CURRENT_TIME`=?, TEMPERATURE=?,FEELS_LIKE=?, MAX_TEMPERATURE=?, MIN_TEMPERATURE=?";
}
