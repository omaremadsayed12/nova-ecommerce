import mongoose from "mongoose";

const storeSettingsSchema = new mongoose.Schema(
    {
        shippingFee:{
            type: Number,
            required: true,
            default:0
        },
        taxRate:{
            type: Number,
            min:0,
            max:1
        },
        currency:{
            type: String,
            default: "USD"
        },
        updatedBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        updatedAt:{
            type: Date,
            default: Date.now()
        }
    }
);

const StoreSettings = mongoose.model("StoreSettings",storeSettingsSchema);

export default StoreSettings;