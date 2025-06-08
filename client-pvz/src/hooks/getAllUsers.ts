import { useQuery } from "@tanstack/react-query"
import { createUserByAdminService } from "../app/my/createUserByAdmin.service"

export function getAllUsers() {
    const {data, isLoading, refetch} = useQuery({
        queryKey: ['getAllUsers'],
        queryFn: () => createUserByAdminService.getAllUsers()
    })

    return { data, isLoading, refetch }
}