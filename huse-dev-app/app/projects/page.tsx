export default function ProjectsPage() {
  const projects = [
    {
      name: 'project alpha',
      description: 'full-stack web application with real-time features',
      tech: ['next.js', 'postgresql', 'websockets'],
      github: '#',
      live: '#'
    },
    {
      name: 'system beta',
      description: 'distributed system for high-throughput data processing',
      tech: ['node.js', 'aws', 'kafka'],
      github: '#',
      live: '#'
    },
    {
      name: 'tool gamma',
      description: 'developer productivity suite with ai integration',
      tech: ['rust', 'typescript', 'llm'],
      github: '#',
      live: '#'
    },
    {
      name: 'platform delta',
      description: 'scalable microservices architecture',
      tech: ['kubernetes', 'golang', 'grpc'],
      github: '#',
      live: '#'
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Navigation */}
      <nav className="fixed top-0 w-full glass z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-gradient">huse.dev</a>
          <div className="flex items-center space-x-8">
            <a href="/projects" className="text-stone-100 link-underline">projects</a>
            <a href="/about" className="text-stone-400 hover:text-stone-100 link-underline transition-colors">about</a>
            <a href="/butler" className="text-stone-400 hover:text-stone-100 link-underline transition-colors">butler</a>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold mb-4 text-gradient">projects</h1>
        <p className="text-xl text-stone-400 mb-16">things i've built</p>

        <div className="grid gap-8">
          {projects.map((project) => (
            <div key={project.name} className="glass p-8 rounded-lg hover-lift">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <h2 className="text-2xl mb-2 md:mb-0">{project.name}</h2>
                <div className="flex gap-4">
                  <a href={project.github} className="text-stone-400 hover:text-stone-100 transition-colors">
                    github →
                  </a>
                  <a href={project.live} className="text-stone-400 hover:text-stone-100 transition-colors">
                    live →
                  </a>
                </div>
              </div>
              <p className="text-stone-400 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span key={tech} className="text-sm text-stone-500 px-3 py-1 glass rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}