import { useQuery } from "@tanstack/react-query"
import { pvzService } from "../my/pvz.service"

export function useFindPvz(id: string) {
   const {data, isLoading, refetch} = useQuery({
        queryKey: ['findPvzById'],
        queryFn: () => pvzService.getPvzById(id)
    })

    return { data, isLoading, refetch }
}