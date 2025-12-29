export function AboutSection() {
  return (
    <section id="about" className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl text-[#EFEFEF] mb-8 transition-all duration-300 hover:scale-105">~ stats ~</h2>
        <div className="bg-[#100D0D] p-8 rounded-lg border border-[#5F51C2] transition-all duration-300 hover:border-opacity-80 hover:shadow-lg hover:shadow-[#5F51C2]/20">
          <p className="text-[#EFEFEF] text-lg leading-relaxed">
            Welcome to my realm. I am a developer who crafts digital experiences with passion and precision. My journey
            through the world of code has equipped me with skills in various technologies and frameworks.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {["HP: 100", "MP: 85", "STR: 90", "DEX: 88"].map((stat) => (
              <div
                key={stat}
                className="text-[#5F51C2] text-sm transition-all duration-300 hover:text-[#EFEFEF] hover:scale-110"
              >
                {stat}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
