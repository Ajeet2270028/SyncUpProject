// config/database.js
// MySQL connection using Sequelize

const { Sequelize } = require("sequelize");

// Create connection using .env values
const sequelize = new Sequelize(
  process.env.DB_NAME,     // database name: syncup
  process.env.DB_USER,     // username: root
  process.env.DB_PASSWORD, // your mysql password
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",      // tell Sequelize we're using MySQL
    logging: false,        // set to console.log to see SQL queries
  }
);

// Test the connection
async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connected");

    // sync() creates the table if it doesn't exist yet
    // alter: true updates columns if schema changes
    await sequelize.sync({ alter: true });
    console.log("✅ Tables synced");
  } catch (error) {
    console.error("❌ MySQL connection failed:", error.message);
    process.exit(1);
  }
}

module.exports = { sequelize, connectDB };