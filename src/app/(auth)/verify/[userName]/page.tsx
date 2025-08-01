'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams<{userName: string}>()

    const { toast } = useToast()
    // implementation of zod
    const form = useForm <z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema)
    })

    const onSubmit = async(data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post(`/api/verify-code`, {
                userName: params.userName,
                code: data.code
            })

            toast({
                title: "Success",
                description: response.data.message
            })

            router.replace('/sign-in')

        } catch (error) {

            const axiosError = error as AxiosError<ApiResponse>

            toast({
                title: 'Verification Failed',
                description: axiosError.response?.data.message ?? 'An error occurred. Please try again.',
                variant: 'destructive'
            })
        }
    }



  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
        <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
            
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Silent Surf
          </h1>
          <p className="mb-4">Verify to continue your secret conversations</p>
        </div>

        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter your 6 digit verification code" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
        </div>
    </div>
  )
}

export default VerifyAccount