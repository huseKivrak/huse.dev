'use client';


export default function Home() {
  const skills = [
    'typescript', 'react', 'next.js', 'node.js',
    'python', 'postgresql', 'aws', 'docker',
    'tailwindcss', 'git', 'linux', 'rust'
  ];

  const featuredWork = [
    { name: 'project alpha', description: 'full-stack web application', tech: ['next.js', 'postgresql'] },
    { name: 'system beta', description: 'distributed architecture', tech: ['node.js', 'aws'] },
    { name: 'tool gamma', description: 'developer productivity suite', tech: ['rust', 'typescript'] },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full glass z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-gradient">huse.dev</a>
          <div className="flex items-center space-x-8">
            <a href="/projects" className="text-stone-400 hover:text-stone-100 link-underline transition-colors">projects</a>
            <a href="/about" className="text-stone-400 hover:text-stone-100 link-underline transition-colors">about</a>
            <a href="/butler" className="text-stone-400 hover:text-stone-100 link-underline transition-colors">butler</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center pt-20">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-gradient">
            huse
          </h1>
          <p className="text-xl md:text-2xl text-stone-400 mb-12">
            developer, creator, problem solver
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/projects" className="px-8 py-4 glass hover-lift rounded-lg transition-all">
              view projects
            </a>
            <a href="/butler" className="px-8 py-4 glass hover-lift rounded-lg transition-all">
              talk to butler
            </a>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl mb-12 text-center">technical expertise</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 glass rounded-full text-sm text-stone-300 hover:text-stone-100 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Work */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl mb-12 text-center">featured work</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredWork.map((project) => (
              <div key={project.name} className="glass p-6 rounded-lg hover-lift">
                <h3 className="text-xl mb-2 text-gradient">{project.name}</h3>
                <p className="text-stone-400 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span key={tech} className="text-xs text-stone-500 px-2 py-1 glass rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass border-t border-stone-800/50 px-6 py-8 mt-20">
        <div className="max-w-6xl mx-auto text-center text-stone-500 text-sm">
          <p>&copy; {new Date().getFullYear()} huse.dev</p>
        </div>
      </footer>
    </div>
  );
}
