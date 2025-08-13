import { api } from "@/config/axios.config";

export const apiClientGet = async <T>(endpoint: string, options = {}): Promise<T> => {
    try {
        const response = await api.get<T>(`${endpoint}`, {
            ...options,
        });
        return response.data;
    } catch (error) {
        console.error("Error execute get:", error);
        throw error;
    }
};

export const apiClientPatch = async <T>(endpoint: string, data: any, options = {}): Promise<T> => {
    try {
        const response = await api.patch<T>(`${endpoint}`, data, {
            ...options,
        });
        return response.data;
    } catch (error) {
        console.error("Error execute patch:", error);
        throw error;
    }
};

export const apiClientPost = async <T>(endpoint: string, options = {}): Promise<T> => {
    try {
        const response = await api.post<T>(`${endpoint}`, {
            ...options,
        });
        return response.data;
    } catch (error) {
        console.error("Error execute post:", error);
        throw error;
    }
};

export const apiClientDelete = async <T>(endpoint: string, options = {}): Promise<T> => {
    try {
        const response = await api.delete<T>(`${endpoint}`, {
            ...options,
        });
        return response.data;
    } catch (error) {
        console.error("Error execute patch:", error);
        throw error;
    }
};
