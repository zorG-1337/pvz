import { axiosWithAuth } from "@/src/api/api.interceptors";

class ChangeData {
    async changNameAndSurname(data: {name: string, surname: string}) {
        const response = await axiosWithAuth({
            url: "http://localhost:5000/users/changeNameAndSurname",
            data,
            method: "POST"
        })

        return response
    }
}

export const changeData = new ChangeData()

