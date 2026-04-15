import sequelize from "./config/db.js";

try {
  await sequelize.authenticate();
  console.log("Aiven MySQL connected successfully");
  process.exit(0);
} catch (error) {
  console.error("Database connection failed:");
  console.error(error);
  process.exit(1);
}