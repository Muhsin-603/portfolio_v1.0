"use client"

import { useGame } from "@/lib/game-context"
import { useEffect, useState } from "react"

interface Project {
  id: string
  title: string
  category: string
  description: string
  tags: string[]
  status: "completed" | "in-progress" | "planned"
  rarity: "common" | "rare" | "epic" | "legendary"
  year: string
}

const projects: Project[] = [
  {
    id: "project_1",
    title: "[ Project Name ]",
    category: "Game",
    description: "Add your project description here. What was the concept? What did you build?",
    tags: ["Unity", "C#", "3D"],
    status: "completed",
    rarity: "legendary",
    year: "2024",
  },
  {
    id: "project_2",
    title: "[ Project Name ]",
    category: "Game",
    description: "Another project placeholder. Describe your work here.",
    tags: ["Unreal", "C++", "Multiplayer"],
    status: "completed",
    rarity: "epic",
    year: "2023",
  },
  {
    id: "project_3",
    title: "[ Project Name ]",
    category: "Tool",
    description: "A tool or utility you created. What problem does it solve?",
    tags: ["Python", "Automation"],
    status: "completed",
    rarity: "rare",
    year: "2023",
  },
  {
    id: "project_4",
    title: "[ Coming Soon ]",
    category: "Game",
    description: "A project currently in development.",
    tags: ["TBD"],
    status: "in-progress",
    rarity: "common",
    year: "2024",
  },
]

const rarityColors = {
  common: "border-foreground/30 text-foreground/60",
  rare: "border-blue-400 text-blue-400",
  epic: "border-purple-400 text-purple-400",
  legendary: "border-yellow-400 text-yellow-400",
}

const rarityBg = {
  common: "bg-foreground/5",
  rare: "bg-blue-400/10",
  epic: "bg-purple-400/10",
  legendary: "bg-yellow-400/10",
}

export function InventorySection() {
  const { state, visitArea, unlockAchievement, discoverLore } = useGame()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [filter, setFilter] = useState<"all" | "completed" | "in-progress">("all")

  useEffect(() => {
    if (state.gameStarted) {
      visitArea("inventory")
    }
  }, [state.gameStarted, visitArea])

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project)
    unlockAchievement("project_viewer")
    // Discover lore when viewing projects
    const projectLore = state.loreFragments.find((l) => l.location === "projects" && !l.discovered)
    if (projectLore) {
      discoverLore(projectLore.id)
    }
  }

  const filteredProjects = projects.filter((p) => filter === "all" || p.status === filter)

  return (
    <div className="min-h-screen py-24 px-4 relative">
      {/* Section Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px flex-1 bg-accent/30" />
          <h2 className="text-3xl text-foreground tracking-wider">INVENTORY</h2>
          <div className="h-px flex-1 bg-accent/30" />
        </div>
        <p className="text-center text-foreground/60 text-sm">Collected works and creations</p>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-6xl mx-auto mb-8 flex justify-center gap-4">
        {(["all", "completed", "in-progress"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm border transition-all ${
              filter === f
                ? "border-accent bg-accent/20 text-foreground"
                : "border-accent/30 text-foreground/60 hover:border-accent/50"
            }`}
          >
            {f === "all" ? "All Items" : f === "completed" ? "Completed" : "In Progress"}
          </button>
        ))}
      </div>

      {/* Inventory Grid */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredProjects.map((project) => (
          <button
            key={project.id}
            onClick={() => handleProjectClick(project)}
            className={`text-left p-4 border-2 ${rarityColors[project.rarity]} ${rarityBg[project.rarity]} 
              hover:scale-105 transition-all duration-300 relative group`}
          >
            {/* Rarity Indicator */}
            <div className="absolute top-2 right-2">
              <span className={`text-xs ${rarityColors[project.rarity]}`}>
                {project.rarity.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Project Icon Placeholder */}
            <div className="w-full aspect-video bg-secondary/50 border border-accent/20 mb-3 flex items-center justify-center overflow-hidden">
              <span className="text-foreground/20 text-xs">[ Thumbnail ]</span>
            </div>

            {/* Project Info */}
            <p className="text-xs text-accent mb-1">{project.category}</p>
            <h3 className="text-foreground text-sm font-bold mb-1">{project.title}</h3>
            <p className="text-foreground/50 text-xs">{project.year}</p>

            {/* Status Badge */}
            <div className="mt-2">
              <span
                className={`text-xs px-2 py-0.5 ${
                  project.status === "completed"
                    ? "bg-green-500/20 text-green-400"
                    : project.status === "in-progress"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-foreground/10 text-foreground/50"
                }`}
              >
                {project.status}
              </span>
            </div>
          </button>
        ))}

        {/* Empty Slots */}
        {Array.from({ length: Math.max(0, 4 - filteredProjects.length) }).map((_, i) => (
          <div key={`empty-${i}`} className="p-4 border border-dashed border-accent/20 opacity-30">
            <div className="w-full aspect-video bg-secondary/30 mb-3 flex items-center justify-center">
              <span className="text-foreground/20 text-2xl">+</span>
            </div>
            <p className="text-foreground/30 text-xs text-center">Empty Slot</p>
          </div>
        ))}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/90">
          <div
            className={`max-w-2xl w-full border-2 ${rarityColors[selectedProject.rarity]} ${rarityBg[selectedProject.rarity]} p-6 relative`}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 text-foreground/60 hover:text-foreground text-2xl"
            >
              ×
            </button>

            {/* Rarity Banner */}
            <div className={`text-xs ${rarityColors[selectedProject.rarity]} tracking-wider mb-4`}>
              {selectedProject.rarity.toUpperCase()} ITEM
            </div>

            {/* Project Image Placeholder */}
            <div className="w-full aspect-video bg-secondary border border-accent/30 mb-6 flex items-center justify-center">
              <span className="text-foreground/30">[ Project Screenshot / Demo ]</span>
            </div>

            {/* Project Details */}
            <h3 className="text-2xl text-foreground mb-2">{selectedProject.title}</h3>
            <p className="text-accent text-sm mb-4">
              {selectedProject.category} • {selectedProject.year}
            </p>
            <p className="text-foreground/70 text-sm leading-relaxed mb-6">{selectedProject.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedProject.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-accent/20 border border-accent/30 text-foreground text-xs">
                  {tag}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 py-2 bg-accent text-secondary text-sm hover:bg-accent/80 transition-colors">
                View Project
              </button>
              <button className="flex-1 py-2 border border-accent text-foreground text-sm hover:bg-accent/20 transition-colors">
                Source Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
