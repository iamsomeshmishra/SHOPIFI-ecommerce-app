import dotenv from 'dotenv';

// Configure dotenv
dotenv.config();

const REQUIRED_ENV_VARS = [
  'MONGO_URI',
  'JWT_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'STRIPE_SECRET_KEY'
];

export const validateEnv = () => {
  const missing = [];
  
  for (const key of REQUIRED_ENV_VARS) {
    if (key === 'CLOUDINARY_CLOUD_NAME') {
      if (!process.env.CLOUDINARY_CLOUD_NAME && !process.env.CLOUDINARY_NAME) {
        missing.push('CLOUDINARY_CLOUD_NAME (or CLOUDINARY_NAME)');
      }
    } else if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    console.error('\n=========================================');
    console.error('❌ CRITICAL ERROR: MISSING ENV VARIABLES');
    console.error('=========================================');
    console.error('The following environment variables are required but missing:');
    missing.forEach((variable) => {
      console.error(`  - ${variable}`);
    });
    console.error('=========================================');
    console.error('Please configure your .env file before starting the application.\n');
    process.exit(1);
  } else {
    console.log('✅ Environment variables successfully validated.');
  }
};
