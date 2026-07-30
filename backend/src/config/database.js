const mongoose = require('mongoose');
const dns = require('dns');

// Fix for Windows DNS resolution issue with MongoDB Atlas SRV records (querySrv ECONNREFUSED)
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Fallback if DNS override fails
}

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri || uri.includes('<username>') || uri.includes('<password>')) {
      console.warn('⚠️  MONGODB_URI is using a placeholder or is not set in backend/.env');
      console.warn('💡 Please replace <username> and <password> in backend/.env with your MongoDB Atlas credentials.');
    }
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.error(`💡 Tips for MongoDB Atlas:`);
    console.error(`   1. Ensure your current IP address (or 0.0.0.0/0) is allowed under Atlas Network Access.`);
    console.error(`   2. Double check database username, password, and database name in backend/.env`);
    process.exit(1);
  }
};

module.exports = connectDB;
