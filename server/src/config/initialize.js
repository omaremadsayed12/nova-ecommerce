import connectDB from "./database.js";
import initateStoreSettings from "./storeSettings.js";

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

export default initialize;
