import { axiosWithAuth } from "@/src/api/api.interceptors"

class PvzService {

    async createPvz(payload: any) {
        const response = await axiosWithAuth({
                    url: 'http://localhost:5000/pvz/create-pvz',
                    method: 'POST',
                    data: payload
        })

        return response
    }

    async getAllPvz() {
        const response = await axiosWithAuth({
            url: "http://localhost:5000/pvz",
            method: "GET"
        })

        return response
    }

    async getPvzById(id: string) {
        const response = await axiosWithAuth({
            url: "http://localhost:5000/pvz/get-pvz-by-id",
            method: "POST",
            data: {
                id: id
            }
        })

        return response
    }

    async getMyPvz() {
        const response = await axiosWithAuth({
            url: "http://localhost:5000/pvz/get-my-pvz",
            method: "POST",
        })

        return response
    }

    async getAveragePvzRating(data: {pvzId: string}) {
        const response = await axiosWithAuth({
            url: "http://localhost:5000/reviews/get-average-pvz-rating",
            method: "POST",
            data
        })

        return response
    }

}


export const pvzService = new PvzService()