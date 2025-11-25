import dotenv from 'dotenv';
import { validateEnv } from './shared/config/env.js';

// Load environment variables
dotenv.config();

// Validate critical configuration variables
validateEnv();

import { connectDB } from '#shared/index.js';
import app from '#app/app.js';

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
