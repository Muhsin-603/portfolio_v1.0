const projects = [
  { name: "Project Alpha", type: "Legendary", desc: "A web application built with React" },
  { name: "Project Beta", type: "Epic", desc: "Mobile app using React Native" },
  { name: "Project Gamma", type: "Rare", desc: "Backend system with Node.js" },
]

export function ProjectsSection() {
  return (
    <section id="projects" className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl text-[#EFEFEF] mb-8 text-center transition-all duration-300 hover:scale-105">
          ~ inventory ~
        </h2>
        <div className="grid gap-6">
          {projects.map((project, index) => (
            <div
              key={project.name}
              className="bg-[#100D0D] p-6 rounded-lg border border-[#5F51C2] transition-all duration-300 hover:translate-x-2 hover:border-opacity-80 hover:shadow-lg hover:shadow-[#5F51C2]/20"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-[#EFEFEF] text-xl">{project.name}</h3>
                <span className="text-[#5F51C2] text-sm">[{project.type}]</span>
              </div>
              <p className="text-[#EFEFEF] opacity-70 mt-2 text-sm">{project.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
