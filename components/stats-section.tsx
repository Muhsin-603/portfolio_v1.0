"use client"

import { useGame } from "@/lib/game-context"
import { useEffect } from "react"
import Image from "next/image"

interface Stat {
  label: string
  value: string
  description: string
}

const stats: Stat[] = [
  { label: "CLASS", value: "Game Developer", description: "Primary specialization" },
  { label: "LEVEL", value: ".5", description: "Years of experience" },
  { label: "GUILD", value: "No Company", description: "Current team/company" },
  { label: "REALM", value: "College of Engineering Vadakara", description: "Location" },
]

const skills = [
  { name: "Unity", level: 5, maxLevel: 100 },
  { name: "Unreal Engine", level: 1, maxLevel: 100 },
  { name: "C#", level: 2, maxLevel: 100 },
  { name: "C++", level: 1, maxLevel: 100 },
  { name: "JavaScript", level: 1, maxLevel: 100 },
  { name: "3D Modeling", level: 0, maxLevel: 100 },
]

const traits = [
  { name: "Problem Solving", icon: "◆" },
  { name: "Creativity", icon: "◆" },
  { name: "Team Player", icon: "◆" },
  { name: "Quick Learner", icon: "◆" },
  { name: "Over Thinker", icon: "◆" },
]

export function StatsSection() {
  const { state, visitArea, unlockAchievement } = useGame()

  useEffect(() => {
    if (state.gameStarted) {
      visitArea("stats")
      unlockAchievement("story_seeker")
    }
  }, [state.gameStarted, visitArea, unlockAchievement])

  return (
    <div className="min-h-screen py-24 px-4 relative">
      {/* Section Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px flex-1 bg-accent/30" />
          <h2 className="text-3xl text-foreground tracking-wider">STATS CHAMBER</h2>
          <div className="h-px flex-1 bg-accent/30" />
        </div>
        <p className="text-center text-foreground/60 text-sm">Character attributes and abilities</p>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Left Panel - Character Stats */}
        <div className="bg-secondary/50 border border-accent/30 p-6 relative">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-accent" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent" />

          <h3 className="text-accent text-sm tracking-wider mb-6">// CHARACTER INFO</h3>

          {/* Avatar - UPGRADED */}
          <div className="w-24 h-24 mx-auto mb-6 border-2 border-accent/50 bg-secondary relative overflow-hidden group/rounded-full">
            <Image 
              src="/images/Potrait-1.jpeg" // Make sure this matches your file name!
              alt="Character Avatar"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          {/* Stats Grid */}
          <div className="space-y-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex justify-between items-center border-b border-accent/20 pb-2">
                <div>
                  <span className="text-foreground/50 text-xs">{stat.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-foreground text-sm">{stat.value}</span>
                  <p className="text-foreground/30 text-xs">{stat.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bio */}
          <div className="mt-6 pt-4 border-t border-accent/20">
            <h4 className="text-accent text-xs tracking-wider mb-2">// BACKSTORY</h4>
            <p className="text-foreground/60 text-sm leading-relaxed">
               I started out curious more than confident, the kind of person who pulled things apart just to see how they worked.
               Code, stories, designs—none of them were goals at first, just places to hide and explore. 
              I learned by breaking things, overthinking them, fixing them late at night, and then doing it all again the next day a little better. Sometimes I moved fast, sometimes I stalled, but I never stopped building. 
              Somewhere between unfinished projects and small wins, I realized I wasn’t chasing perfection—I was shaping myself. Not loud, not flashy, just steady. 
              Still learning. Still becoming. 
            </p>
          </div>
        </div>

        {/* Right Panel - Skills & Abilities */}
        <div className="space-y-6">
          {/* Skills */}
          <div className="bg-secondary/50 border border-accent/30 p-6 relative">
            <div className="absolute -top-3 left-4 bg-background px-2">
              <span className="text-accent text-xs tracking-wider">SKILLS</span>
            </div>

            <div className="space-y-4 mt-2">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-foreground">{skill.name}</span>
                    <span className="text-accent">
                      {skill.level}/{skill.maxLevel}
                    </span>
                  </div>
                  <div className="h-2 bg-secondary border border-accent/30 overflow-hidden">
                    <div
                      className="h-full bg-accent/70 transition-all duration-1000"
                      style={{ width: `${(skill.level / skill.maxLevel) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Traits */}
          <div className="bg-secondary/50 border border-accent/30 p-6 relative">
            <div className="absolute -top-3 left-4 bg-background px-2">
              <span className="text-accent text-xs tracking-wider">TRAITS</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2">
              {traits.map((trait) => (
                <div
                  key={trait.name}
                  className="flex items-center gap-2 bg-secondary/80 border border-accent/20 px-3 py-2"
                >
                  <span className="text-accent">{trait.icon}</span>
                  <span className="text-foreground text-sm">{trait.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment / Tools */}
          <div className="bg-secondary/50 border border-accent/30 p-6 relative">
            <div className="absolute -top-3 left-4 bg-background px-2">
              <span className="text-accent text-xs tracking-wider">EQUIPMENT</span>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-2">
              {["VS Code", "Git", "Blender", "Figma", "Photoshop", "Unity", "Unreal", "Godot", "Blender"].map((tool, i) => (
                <div
                  key={i}
                  className="aspect-square bg-secondary border border-accent/20 flex items-center justify-center text-foreground/60 text-xs text-center p-2 hover:border-accent/50 transition-colors cursor-default"
                >
                  {tool}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
