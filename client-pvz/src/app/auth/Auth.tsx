'use client'
import * as React from "react"

import { Button } from "@/src/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { useAuthForm } from "./useAuthForm"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/src/components/form"
import { Toaster } from "react-hot-toast"


// backgroundImage: "url('https://sun9-43.userapi.com/s/v1/ig2/ANp5WUgPgDaWQT5nOhU4Mzm2vq22iU6M6rk3I47Lo4z7Ot6hqvb2ncMQbAJgQAIMRgsA_fMEeI8qb7e_QIakuLhF.jpg?quality=95&as=32x32,48x48,72x71,108x107,160x159,240x238,360x357,480x476,540x536,640x635,720x715,1080x1072,1280x1271,1440x1430,1511x1500&from=bu&u=N1TEgnyAjM5fKGvReyUUJfb36xGErIOZzhteZWHKNS8&cs=807x801')",

export function Auth() {
  const [isReg, setIsReg] = React.useState(false)

  const {onSubmit, form, isPending} = useAuthForm(isReg)

  

  return (
    
    <div className="flex min-h-screen">
       <Toaster position="top-right" reverseOrder={false} />
      {/* Левая часть — изображение */}
      <div 
        className="hidden md:flex w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://sun9-43.userapi.com/s/v1/ig2/ANp5WUgPgDaWQT5nOhU4Mzm2vq22iU6M6rk3I47Lo4z7Ot6hqvb2ncMQbAJgQAIMRgsA_fMEeI8qb7e_QIakuLhF.jpg?quality=95&as=32x32,48x48,72x71,108x107,160x159,240x238,360x357,480x476,540x536,640x635,720x715,1080x1072,1280x1271,1440x1430,1511x1500&from=bu&u=N1TEgnyAjM5fKGvReyUUJfb36xGErIOZzhteZWHKNS8&cs=807x801')",
          backgroundSize: '50% auto', // уменьшаем по ширине
          backgroundRepeat: 'no-repeat',
        }}
      />
        

      {/* Правая часть — форма */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6" style={{backgroundColor:'#E5E7EB'}}>
        <div className="w-[400px] bg-white rounded-xl shadow-md p-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-center">
                {isReg ? 'Войти' : 'Регистрация'}
              </CardTitle>
              <CardDescription className="text-center">
                Введите свои данные
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                      <FormField control={form.control} name="email" rules={{
                        required: 'Почта обязательна',
                        pattern: {
                          value: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
                          message: 'Введите валидную почту'
                        }
                      }} render={({field}) => (
                        <FormItem className="py-4">
                          <FormControl>
                            <Input {...field} placeholder="asdaoisjd@mail.ru" disabled={isPending} type="email" value={field.value || ''}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}/>
                      <FormField control={form.control} name="password" rules={{
                        required: 'Пароль обязателен'
                      }} render={({field}) => (
                        <FormItem className="py-2">
                          <FormControl>
                            <Input {...field} placeholder="**********" disabled={isPending} type="password" value={field.value || ''}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}/>
                      {!isReg && 
                        <FormField control={form.control} name="passwordRepeat" rules={{
                        required: 'Повторение пароля обязательно'
                      }} render={({field}) => (
                        <FormItem className="py-4">
                          <FormControl>
                            <Input {...field} placeholder="**********" disabled={isPending} type="password" value={field.value || ''}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}/>
                      }
                    
                  <Button className="w-full" disabled={isPending}>
                  {isReg ? 'Войти' : 'Зарегистрироваться'}
              </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button
                variant="link"
                className="w-full text-center"
                onClick={() => {
                  setIsReg(!isReg)
                  form.reset({
                    email: '',
                    password: '',
                    passwordRepeat: ''
                  })
                }}
              >
                {isReg ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}