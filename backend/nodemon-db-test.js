require('dotenv').config();
const mongoose = require('mongoose');
console.log('cwd', process.cwd());
console.log('node', process.execPath, process.version);
console.log('MONGODB_URI loaded:', !!process.env.MONGODB_URI);
console.log('MONGODB_URI prefix:', process.env.MONGODB_URI ? process.env.MONGODB_URI.slice(0, 60) : undefined);

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('✅ nodemon DB connect successful');
  return mongoose.disconnect();
}).catch(err => {
  console.error('❌ nodemon DB connect failed:', err.message);
}).finally(() => {
  process.exit(0);
});
