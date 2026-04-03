require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');

// 1. Connect to your actual MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🟢 Connected to MongoDB!"))
  .catch(err => console.error(err));

// 2. Define a simple schema for the Blacklist
const BlacklistSchema = new mongoose.Schema({
  banned_urls: [String],
  updated_at: { type: Date, default: Date.now }
});
const Blacklist = mongoose.model('Blacklist', BlacklistSchema);

async function testPipeline(newUrlToBan) {
  try {
    console.log(`\n================================`);
    console.log(`🛡️  ADDING URL TO BLOCKLIST: ${newUrlToBan}`);
    
    // Step A: Save to Database!
    let doc = await Blacklist.findOne();
    if (!doc) doc = new Blacklist({ banned_urls: [] });
    
    if (!doc.banned_urls.includes(newUrlToBan)) {
      doc.banned_urls.push(newUrlToBan);
      await doc.save();
    }
    
    console.log(`✅ MongoDB Update Success. Current DB Count: ${doc.banned_urls.length} URLs`);

    // Step B: Trigger the Webhook manually to simulate the MongoDB Atlas Trigger!
    // (In production, MongoDB Atlas does this for you automatically)
    console.log(`\n🚀 Triggering Webhook to Bridge Server...`);
    
    const response = await axios.post('http://localhost:3000/webhook', {
      urls: doc.banned_urls
    });

    console.log(`⚡ Bridge Response: ${response.data}`);
    console.log(`================================\n`);
    
  } catch (error) {
    console.error("❌ Pipeline Failed:", error.message);
  } finally {
    mongoose.connection.close();
  }
}

// Pass a custom URL from CLI, or default to a dummy one
const urlToBan = process.argv[2] || "super-dangerous-hacker-site.com";
testPipeline(urlToBan);
