import { axiosClassic } from "@/src/api/api.interceptors";
import { removeFromStorage, saveTokenStorage } from "./auth-token.service";
import toast from "react-hot-toast";

class AuthService {
    async main(type: 'login' | 'register', data: any) {
        const response = await axiosClassic({
            url: `http://localhost:5000/auth/${type}`,
            method: 'POST',
            data
        })

        if(response.data.accessToken) saveTokenStorage(response.data.accessToken)

        return response
    }

    async getNewTokens() {
        const response = await axiosClassic({
            url: `http://localhost:5000/auth/login/access-token`,
            method: 'POST',
        })

        if(response.data.accessToken) saveTokenStorage(response.data.accessToken)

        return response
    }

    async logout() {
        const response = await axiosClassic({
            url: `http://localhost:5000/auth/logout`,
            method: 'POST',
        })

        if(response.data) {
            removeFromStorage()
            
            
        }

        return response
    }

}

export const authService = new AuthService()