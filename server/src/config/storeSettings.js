import StoreSettings from "../models/StoreSettings.js";

const initateStoreSettings = async()=>{
    const storeSettings = await StoreSettings.findOne();
    if (!storeSettings){
        const storeSettings = new StoreSettings({
            shippingFee: 5,
            currency: "USD",
            taxRate:0.14
        });
        await storeSettings.save();
        console.log("Store settings initated");
    }
    else{
        console.log("Store settings already exist");
    }
};

export default initateStoreSettings;