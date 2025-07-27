'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue, useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"


const page = () => {
  const [userName, setUserName] = useState('')
  const [userNameMessage, setUserNameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const debouncedUsername = useDebounceCallback(setUserName, 500)

  const { toast } = useToast()
  const router = useRouter()

  // implementation of zod
  const form = useForm <z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  })

  useEffect(() => {
    const checkUsernameUnnique = async () => {
      if (userName) {
        setIsCheckingUsername(true)
        setUserNameMessage('')

        try {
          const response = await axios.get(`/api/check-unique-username?username=${userName}`)
          setUserNameMessage(response.data.message)

        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setUserNameMessage(axiosError.response?.data.message ?? "error checking username")
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }

    checkUsernameUnnique()
  }, [userName])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data)
      toast({
        title: 'Success',
        description: response.data.message
      })

      router.replace(`/verify/${userName}`)

    } catch (error) {
      console.error("error signing up the user", error)
      const axiosError = error as AxiosError<ApiResponse>

      let errorMessage = axiosError.response?.data.message

      toast({
        title: 'Signup Failed',
        description: errorMessage,
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Silent Surf
          </h1>
          <p className="mb-4">Sign up to continue your secret conversations</p>
        </div>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
            <FormItem>
              <FormLabel>Username/Email</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} 
                onChange={(e) => {
                  field.onChange(e) 
                  debouncedUsername(e.target.value)
                }}
                />
              </FormControl>

              { isCheckingUsername && <Loader2 className="animate-spin"/>}
              <p className={`text-sm ${userNameMessage === "Username is available" ? 'text-green-500': 'text-red-500'}`}>
                {userNameMessage}
              </p>

              <FormMessage />
            </FormItem>
          )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {
                    isSubmitting ? (
                        <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                        Please Wait
                        </>
                    ) : (
                        'Sign Up'
                )}
            </Button>

            </form>
          </Form>
          <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
        </div>
      </div>
    </div>
  )
}

export default page