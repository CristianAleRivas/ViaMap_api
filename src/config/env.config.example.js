import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  // Agrega aquí otras variables de entorno necesarias
  // dbHost: process.env.DB_HOST || 'localhost',
  // dbPort: process.env.DB_PORT || 5432,
  // dbName: process.env.DB_NAME || 'database_name',
  // apiKey: process.env.API_KEY,
  // jwtSecret: process.env.JWT_SECRET,
};