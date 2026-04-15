import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server folder
dotenv.config({ path: path.resolve(__dirname, "../.env") });

let sslCA = null;

if (process.env.DB_SSL_CA) {
  if (process.env.DB_SSL_CA.includes("BEGIN CERTIFICATE")) {
    // Render env var contains full certificate text
    sslCA = process.env.DB_SSL_CA;
  } else {
    // Local development uses file path like ./certs/ca.pem
    const sslCaPath = path.resolve(__dirname, "..", process.env.DB_SSL_CA);
    sslCA = fs.readFileSync(sslCaPath, "utf8");
  }
}

console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "SET" : "EMPTY");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_SSL_CA:", process.env.DB_SSL_CA ? "SET" : "EMPTY");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "mysql",
    logging: false,
    dialectOptions: sslCA
      ? {
          ssl: {
            ca: sslCA,
            rejectUnauthorized: true,
          },
        }
      : {},
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected successfully");

    await sequelize.sync();
    console.log("All tables synced");
  } catch (error) {
    console.error("DB connection error:", error.message);
    process.exit(1);
  }
};

export default sequelize;