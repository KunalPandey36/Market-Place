import { axiosInstance } from "./axiosinstance";

export const AddProduct = async (payload) => {
    try {

        const response = await axiosInstance.post("/api/products/add-product", payload);

        return response.data;
    } catch (error) {
        return error.message
    }
}

//get all products

export const GetProducts = async () => {
    try {
        const response = await axiosInstance.get("/api/products/get-products");
        return response.data;
    } catch (error) {
        return error.message;
    }
}

export const EditProduct = async (id, payload) => {

    try {

        const response = await axiosInstance.put(`/api/products/edit-product/${id}`, payload);

        return response.data;
    } catch (error) {

        return error.message;
    }


}
export const DeleteProduct = async (id) => {

    try {

        const response = await axiosInstance.delete(`/api/products/delete-product/${id}`);

        return response.data;
    } catch (error) {

        return error.message;
    }


}

export const UploadProductImage = async(payload) => {
    try {
        const response = await axiosInstance.post("/api/products/upload-image-to-product",payload);
        
        return response.data;
    } catch (error) {
        
        return error.message;
    }
}