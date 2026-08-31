import api from "./api";

export const getStats = async() =>{
    const response = await api.get("/stats");
    return response.data;
}