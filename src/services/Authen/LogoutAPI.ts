import axios from "axios";
import { ResponseError } from "../../interface/ResponseError";
import {checkTokenExpired} from "../../util/DecodeJWT";

interface LogoutResponse {
    message: string;
}

const LogoutAPI = async (): Promise<LogoutResponse> => {
    try {
        const HOST = process.env.REACT_APP_HOST_BE;
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/login";
        } else if (checkTokenExpired(token)) {
            localStorage.removeItem('token');
            localStorage.removeItem('profile');
            window.location.href = "/session-expired";
        }

        return (await axios.post(`${HOST}/auth/logout`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })).data.data;

    } catch (error) {

        if (axios.isAxiosError(error) && error.response) {
            if(error.response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('profile');
                window.location.href = "/session-expired";
            }
            const data = error.response.data as ResponseError;
            throw new Error(data.message || "An unexpected error occurred.");
        } else {
            throw new Error("An unexpected error occurred.");
        }

    }
}

export default LogoutAPI;