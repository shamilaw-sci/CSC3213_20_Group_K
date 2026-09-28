require('dotenv').config();
console.log('cwd', process.cwd());
console.log('MONGODB_URI loaded:', !!process.env.MONGODB_URI);
console.log('MONGODB_URI prefix:', process.env.MONGODB_URI ? process.env.MONGODB_URI.slice(0, 40) : undefined);
process.exit(0);
