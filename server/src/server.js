import "dotenv/config";

import app from "./app.js";
import connectDB from "./config/database.js";
import initateStoreSettings from "./config/storeSettings.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await initateStoreSettings();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();