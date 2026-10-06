import "dotenv/config";

import app from "./app.js";
import initialize from "./config/initialize.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await initialize();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();