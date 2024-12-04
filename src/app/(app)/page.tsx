"use client";
import messages from "@/messages.json"
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import  AutoPlay from "embla-carousel-autoplay"
import { Mail } from "lucide-react";
export default function Home() {
  return (
    <>
      <main className="flex flex-grow flex-col items-center justify-center bg-gray-800 px-4 py-12 text-white md:px-24">
        <section className="mb-8 text-center md:mb-12">
          <h1 className="text-3xl font-bold md:text-5xl">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 text-base md:mt-4 md:text-lg">
            True Feedback - Where your identity remains a secret.
          </p>
        </section>
        <Carousel
          plugins={[AutoPlay({ delay: 2000 })]}
          className="w-full max-w-xs"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <div className="p-1">
                  <Card>
                    <CardHeader>{message.title}</CardHeader>
                    <CardContent className="flex flex-col items-start space-y-2 md:flex-row md:space-x-4 md:space-y-0">
                      <Mail className="flex-shrink-0" />
                      <div>
                        <p>{message.content}</p>
                        <p className="text-xs text-muted-foreground">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>
      {/* Footer */}
      <footer className="bg-gray-900 p-4 text-center text-white md:p-6">
        © 2024 True Feedback. All rights reserved.
      </footer>
    </>
  );
}
