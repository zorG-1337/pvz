import { axiosClassic, axiosWithAuth } from "@/src/api/api.interceptors";

class CreateUserByAdminService {
    async main(data: any) {
        const response = await axiosWithAuth({
            url: "http://localhost:5000/users/CreateUserBySuperAdmin",
            method: "POST",
            data
        })

        return response
    }

    async getAllUsers() {
        const response = await axiosWithAuth({
            url: "http://localhost:5000/users",
            method: "GET"
        })

        return response
    }

   
}

export const createUserByAdminService = new CreateUserByAdminService()