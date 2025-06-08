import { axiosWithAuth } from "../api/api.interceptors" 

class UserService {
    async getProfile() {
        const { data } = await axiosWithAuth({
            url: 'http://localhost:5000/users/profile',
            method: 'GET'
        })

        return data
    }

    async getUserById(id: string) {
        const user = await axiosWithAuth({
            url: `http://localhost:5000/users/${id}`,
            method: 'POST'
        })

        return user
    }
}

export const userService = new UserService()