import app from "../server/src/app.js";
import connectDB from "../server/src/config/database.js";
import initateStoreSettings from "../server/src/config/storeSettings.js";

let initialization;

const initialize = () => {
  if (!initialization) {
    initialization = connectDB()
      .then(initateStoreSettings)
      .catch((error) => {
        initialization = undefined;
        throw error;
      });
  }
  return initialization;
};

export default async function handler(req, res) {
  try {
    await initialize();
  } catch (error) {
    console.error("Vercel API initialization failed");
    res.statusCode = 503;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({
      success: false,
      message: "API initialization failed",
      data: null,
      error: {
        code: "API_INITIALIZATION_FAILED",
        message: "The API is temporarily unavailable",
        details: null,
      },
      meta: null,
    }));
    return;
  }

  return app(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
