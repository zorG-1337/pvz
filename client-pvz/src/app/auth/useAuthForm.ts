import { authService } from "@/src/services/auth/auth.service";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast"


export function useAuthForm(isReg: boolean) {
    const router = useRouter()

    const form = useForm({
        mode: 'onChange'
    })

    const {mutate, isPending} = useMutation({
        mutationKey: ['auth user'],
        mutationFn: (data) => 
            authService.main(!isReg ? 'register' : 'login', data),
        onSuccess() {
            form.reset()
            toast.success("Успешная авторизация!")
            setTimeout(() => {
                    router.replace('http://localhost:3000/my')
             }, 2000)
        },
        onError(error: any) {
            if(
                error.message
            ) {
                toast.error(error.response.data.message)
            } else {
                console.log("Ошибка при аторизации")
            }
        }
    })

    const onSubmit: SubmitHandler<any> = data => {
        console.log(data)
        if(data.passwordRepeat === '') {
            const newData:any = {
                email: data.email,
                password: data.password
            }

            mutate(newData)
        }

        else {
            mutate(data)
        }
        
    }

    return {onSubmit, form, isPending}

           
}