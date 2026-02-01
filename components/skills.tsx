"use client"

import { useState } from "react"

export default function Skills() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  const skills = [
  {
    name: "Python",
    proficiency: "Expert",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    color: "from-blue-400 to-blue-600",
  },
  {
    name: "Machine Learning",
    proficiency: "Expert",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
    color: "from-purple-400 to-purple-600",
  },
  {
    name: "Deep Learning",
    proficiency: "Advanced",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
    color: "from-pink-400 to-pink-600",
  },
  {
    name: "TensorFlow",
    proficiency: "Advanced",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
    color: "from-orange-400 to-orange-600",
  },
  {
    name: "Keras",
    proficiency: "Advanced",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/keras/keras-original.svg",
    color: "from-red-400 to-red-600",
  },
  {
    name: "Scikit-learn",
    proficiency: "Advanced",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
    color: "from-yellow-400 to-yellow-600",
  },
  {
    name: "NLP",
    proficiency: "Advanced",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    color: "from-green-400 to-green-600",
  },
  {
    name: "Computer Vision",
    proficiency: "Advanced",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg",
    color: "from-cyan-400 to-cyan-600",
  },
  {
    name: "SQL",
    proficiency: "Advanced",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    color: "from-indigo-400 to-indigo-600",
  },
  {
    name: "PostgreSQL",
    proficiency: "Advanced",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    color: "from-blue-500 to-blue-700",
  },
  {
    name: "Pandas",
    proficiency: "Advanced",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg",
    color: "from-blue-300 to-blue-500",
  },
  {
    name: "NumPy",
    proficiency: "Advanced",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg",
    color: "from-lime-400 to-lime-600",
  },
  {
    name: "Elasticsearch",
    proficiency: "Intermediate",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elasticsearch/elasticsearch-original.svg",
    color: "from-yellow-500 to-yellow-700",
  },
  {
    name: "Google Cloud",
    proficiency: "Intermediate",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg",
    color: "from-blue-500 to-blue-700",
  },
  {
    name: "Git",
    proficiency: "Advanced",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    color: "from-orange-500 to-orange-700",
  },
  {
    name: "Jupyter",
    proficiency: "Advanced",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg",
    color: "from-orange-300 to-orange-500",
  },
  {
    name: "Web Scraping",
    proficiency: "Intermediate",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    color: "from-purple-500 to-purple-700",
  },
  {
    name: "Model Deployment",
    proficiency: "Intermediate",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    color: "from-red-500 to-red-700",
  },
  {
    name: "LLM Integration",
    proficiency: "Intermediate",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/openai/openai-original.svg",
    color: "from-violet-400 to-violet-600",
  },
]


  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-widest">SKILLS</h2>
          <p className="text-muted-foreground text-sm tracking-widest">HOVER OVER A SKILL FOR CURRENT PROFICIENCY</p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
          {skills.map((skill, index) => (
            <div
              key={skill.name}
              className="relative animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
              onMouseEnter={() => setHoveredSkill(skill.name)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              {/* Circular skill icon */}
              <div
                className={`
                  w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-border
                  flex items-center justify-center text-4xl md:text-5xl
                  cursor-pointer transition-all duration-300 relative
                  hover:border-accent hover:shadow-lg hover:scale-110
                  ${hoveredSkill === skill.name ? "bg-accent/10 shadow-lg scale-110" : "bg-card hover:bg-accent/5"}
                  animate-pulse-glow
                `}
              >
                <img
                  src={skill.logo}
                  alt={skill.name}
                  className="w-10 h-10 md:w-12 md:h-12 object-contain"
                />

                {hoveredSkill === skill.name && (
                  <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 whitespace-nowrap animate-slide-up">
                    <div className="bg-foreground text-background px-3 py-2 rounded-lg text-sm font-semibold">
                      <div>{skill.name}</div>
                      <div className="text-xs opacity-80">{skill.proficiency}</div>
                    </div>
                    {/* Tooltip arrow */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-2 h-2 bg-foreground rotate-45"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-12 border-t border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
              <div className="text-2xl font-bold text-accent mb-2">Expert</div>
              <p className="text-sm text-muted-foreground">Mastery level</p>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: "300ms" }}>
              <div className="text-2xl font-bold text-accent mb-2">Advanced</div>
              <p className="text-sm text-muted-foreground">Production ready</p>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: "400ms" }}>
              <div className="text-2xl font-bold text-accent mb-2">Intermediate</div>
              <p className="text-sm text-muted-foreground">Solid understanding</p>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: "500ms" }}>
              <div className="text-2xl font-bold text-accent mb-2">Learning</div>
              <p className="text-sm text-muted-foreground">In progress</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
