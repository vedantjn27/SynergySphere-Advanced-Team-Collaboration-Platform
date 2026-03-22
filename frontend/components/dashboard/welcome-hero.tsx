"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, ArrowRight, Users, Target, Zap } from "lucide-react"
import Image from "next/image"

interface WelcomeHeroProps {
  userName: string
  isNewUser?: boolean
}

export function WelcomeHero({ userName, isNewUser = false }: WelcomeHeroProps) {
  return (
    <Card className="overflow-hidden gradient-card border-0 shadow-xl hover-lift">
      <CardContent className="p-0">
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Content Section */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div className="space-y-6">
              {isNewUser && (
                <Badge className="gradient-primary text-white w-fit animate-fade-in">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Welcome to SynergySphere!
                </Badge>
              )}

              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-balance animate-slide-in-up">
                  Hello, {userName}!<span className="block text-primary mt-2">Ready to collaborate?</span>
                </h1>

                <p
                  className="text-lg text-muted-foreground text-pretty animate-slide-in-up"
                  style={{ animationDelay: "0.1s" }}
                >
                  Transform your team's productivity with our advanced collaboration platform. Manage projects, track
                  progress, and achieve goals together.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 animate-slide-in-up" style={{ animationDelay: "0.2s" }}>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <span>Team Collaboration</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                    <Target className="h-4 w-4 text-secondary" />
                  </div>
                  <span>Project Management</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-8 h-8 bg-chart-3/10 rounded-full flex items-center justify-center">
                    <Zap className="h-4 w-4 text-chart-3" />
                  </div>
                  <span>Real-time Updates</span>
                </div>
              </div>

              <div className="flex gap-4 animate-slide-in-up" style={{ animationDelay: "0.3s" }}>
                <Button className="gradient-primary hover-lift shadow-lg">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Create Project
                </Button>
                <Button variant="outline" className="hover-lift bg-transparent">
                  Explore Features
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative lg:min-h-[400px] bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="relative w-full h-full max-w-md">
                <Image
                  src="/productivity-hero.jpg"
                  alt="Team collaboration and productivity"
                  fill
                  className="object-contain animate-fade-in"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-8 right-8 animate-bounce" style={{ animationDelay: "1s" }}>
              <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>

            <div className="absolute bottom-8 left-8 animate-bounce" style={{ animationDelay: "1.5s" }}>
              <div className="w-10 h-10 gradient-secondary rounded-full flex items-center justify-center shadow-lg">
                <Target className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
