import { axiosInstance } from "./axiosinstance";

//add a notiication

export const AddNotification = async (payload) => {
    try {

        const response = await axiosInstance.post("/api/notifications/notify", payload);

        return response.data;
    } catch (error) {
        return error.response.data
    }
}
//Get all notification for user

export const GetAllNotifications = async()=>{
    try {
        const response = await axiosInstance.get("/api/notifications/get-all-notifications")
        return response.data
    } catch (error) {
        return error.response.data
    }
}

export const DeleteNotification = async(id)=>{
    try {
        const response = await axiosInstance.delete(`/api/notifications/delete-notification/${id}`)
        return response.data
    } catch (error) {
        return error.response.data;
    }
}

export const ReadAllNotification = async()=>{
    try {
        const response = await axiosInstance.put("/api/notifications/read-all-notifications")
        return response.data
    } catch (error) {
        return error.response.data;
    }
}
