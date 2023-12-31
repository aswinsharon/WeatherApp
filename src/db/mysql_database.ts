import mysql, {
  QueryError,
  OkPacket,
  RowDataPacket,
  ResultSetHeader,
  ProcedureCallPacket,
} from "mysql2";
import { Queries } from "../sql_queries";
import { WeatherType } from "../Types/types";

let max_attempt: number = 0;

const db = mysql.createConnection({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE_NAME,
  insecureAuth: true,
});
async function establishConnection() {
  db.connect((err: QueryError | null) => {
    if (err) {
      console.log("Error connecting to MySQL:");
    } else {
      console.log("Connected to MySQL database");
    }
  });
}
async function handleDataUpdation(weather_data: WeatherType) {
  const findDataQuery: string = Queries.FIND_DATA_QUERY;
  try {
    db.query(
      findDataQuery,
      [weather_data.City],
      async function (error: QueryError | null, result: []) {
        if (error) {
          console.log("error", error);
        } else {
          if (result.length > 0) {
            console.log(
              "the weather data entry already present, updating details"
            );
            await updateWeather(weather_data);
          } else {
            console.log(
              "the weather data entry doesn't exist, making new entry"
            );
            await insertIntoSql(weather_data);
          }
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
}
async function insertIntoSql(weather_data: WeatherType) {
  try {
    const InsertQuery: string = Queries.INSERT_QUERY;
    const destructured_weather_data_array = [
      weather_data.City,
      weather_data.Current_Time,
      weather_data.Temperature,
      weather_data.Feels_like,
      weather_data.Maximum_Temperature,
      weather_data.Minimum_Temperature,
    ];
    db.query(
      InsertQuery,
      destructured_weather_data_array,
      async function (
        error: QueryError | null,
        result:
          | OkPacket
          | RowDataPacket[]
          | ResultSetHeader[]
          | RowDataPacket[][]
          | OkPacket[]
          | ProcedureCallPacket
      ) {
        if (error) {
          max_attempt++;
          if (max_attempt > 3) {
            console.log("error in connecting to database, closing connection");
            db.end();
            return;
          }
          console.error(
            `failed to insert into database, retrying for ${max_attempt}, response from db ${error}`
          );
          await insertIntoSql(weather_data);
        } else {
          console.log("successfully inserted to database ", result);
        }
      }
    );
  } catch (error) {
    console.log("something went wrong");
  }
}
async function getLastSearchCity() {
  return await new Promise((resolve, reject) => {
    const getLastQuery: string = Queries.GET_LAST_QUERY;
    try {
      db.query(
        getLastQuery,
        async function (error: QueryError | null, result: any) {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}
async function getPreExistingTables() {
  return await new Promise<String>((resolve, reject) => {
    const preExistingTablesQuery = Queries.VERIFY_TABLE_EXISTS;
    try {
      db.query(
        preExistingTablesQuery,
        async (error: QueryError | null, result: any) => {
          if (error) {
            console.log(error);
          } else {
            resolve(result);
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}
async function handleTableCreation() {
  try {
    const preExisting = await getPreExistingTables();
    if (preExisting?.length === 0) {
      console.log("table does not exist.. executing query to create new table");
      await createSchema();
    } else {
      console.log("table already exists");
    }
  } catch (error) {
    console.log(error);
  }
}
async function createSchema() {
  return await new Promise((resolve, reject) => {
    const createSchemaQuery = Queries.CREATE_SCHEMA_QUERY;
    try {
      db.query(
        createSchemaQuery,
        async (error: QueryError | null, result: any) => {
          if (error) {
            console.log(error);
          } else {
            console.log("table successfully created");
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}
async function updateWeather(weather_data: WeatherType) {
  try {
    const updateQuery: string = Queries.UPDATE_DATA_QUERY;
    const destructured_weather_data_array = [
      weather_data.City,
      weather_data.Current_Time,
      weather_data.Temperature,
      weather_data.Feels_like,
      weather_data.Maximum_Temperature,
      weather_data.Minimum_Temperature,
    ];
    db.query(
      updateQuery,
      destructured_weather_data_array,
      async function (
        error: QueryError | null,
        result:
          | OkPacket
          | RowDataPacket[]
          | ResultSetHeader[]
          | RowDataPacket[][]
          | OkPacket[]
          | ProcedureCallPacket
      ) {
        if (error) {
          max_attempt++;
          if (max_attempt > 3) {
            console.log("error in connecting to database, closing connection");
            db.end();
            return;
          }
          console.error(
            `failed to update the data, retrying for ${max_attempt}, response from db ${error}`
          );
          await updateWeather(weather_data);
        } else {
          console.log("successfully inserted to database ", result);
        }
      }
    );
  } catch (error) {
    console.log("something went wrong");
  }
}
export default {
  handleDataUpdation,
  insertIntoSql,
  establishConnection,
  getLastSearchCity,
  handleTableCreation,
};
