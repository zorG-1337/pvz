import { useQuery } from "@tanstack/react-query"
import { pvzService } from "../app/my/pvz.service"


export const useMyPvz = () => {
  return useQuery({
    queryKey: ["myPvz"],
    queryFn: async () => {
      const response = await pvzService.getMyPvz()
      return response.data
    },
    refetchOnWindowFocus: false,
  })
}
