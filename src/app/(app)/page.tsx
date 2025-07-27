'use client'
import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import messages from '@/messages.json';
import { Mail } from 'lucide-react';


const page = () => {
  return (
    <>
        <div className="min-h-screen flex flex-col bg-gray-800 text-white">
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-14 bg-gray-800 text-white">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Get started to receive and send messages Anonymously. Start your conversations now!!!
          </h1>
          <p className="mt-5 md:mt-4 text-base md:text-lg">
            Explore Silent Surf - Surf anonymously where your identity remains silent 🤫
          </p>
        </section>

        <Carousel 
        plugins={[Autoplay({ delay: 2000 })]}
        className="w-full max-w-lg md:max-w-xl"
        >
        <CarouselContent>
          {
            messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                    <Mail className="flex-shrink-0" />
                    <div>
                      <p>{message.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))
          }
        </CarouselContent>
        <CarouselPrevious />
      <CarouselNext />
        </Carousel>
      </main>

      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
      © 2023 Silent Surf. All rights reserved.
      </footer>
      </div>
    </>
  )
}

export default page