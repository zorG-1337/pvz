import { useQuery } from "@tanstack/react-query"
import { pvzService } from "../app/my/pvz.service"

export function getAllPvz() {
    const {data, isLoading, refetch} = useQuery({
        queryKey: ['getAllPvz'],
        queryFn: () => pvzService.getAllPvz()
    })

    return { data, isLoading, refetch }
}