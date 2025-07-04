export default function AboutPage() {
  const experience = [
    {
      role: 'senior software engineer',
      company: 'tech corp',
      period: '2020 - present',
      description: 'leading development of distributed systems and cloud infrastructure'
    },
    {
      role: 'full stack developer',
      company: 'startup xyz',
      period: '2018 - 2020',
      description: 'built scalable web applications serving millions of users'
    },
    {
      role: 'software engineer',
      company: 'innovation labs',
      period: '2016 - 2018',
      description: 'developed machine learning pipelines and data processing systems'
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Navigation */}
      <nav className="fixed top-0 w-full glass z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-gradient">huse.dev</a>
          <div className="flex items-center space-x-8">
            <a href="/projects" className="text-stone-400 hover:text-stone-100 link-underline transition-colors">projects</a>
            <a href="/about" className="text-stone-100 link-underline">about</a>
            <a href="/butler" className="text-stone-400 hover:text-stone-100 link-underline transition-colors">butler</a>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold mb-4 text-gradient">about</h1>
        <p className="text-xl text-stone-400 mb-16">background & contact</p>

        {/* Bio Section */}
        <section className="mb-20">
          <h2 className="text-2xl mb-8">bio</h2>
          <div className="glass p-8 rounded-lg">
            <p className="text-stone-300 leading-relaxed mb-4">
              passionate software engineer with expertise in building scalable systems and modern web applications.
              focused on creating elegant solutions to complex problems using cutting-edge technologies.
            </p>
            <p className="text-stone-300 leading-relaxed">
              specializing in full-stack development, cloud infrastructure, and artificial intelligence.
              always learning, always building, always pushing boundaries.
            </p>
          </div>
        </section>

        {/* Experience Section */}
        <section className="mb-20">
          <h2 className="text-2xl mb-8">experience</h2>
          <div className="space-y-6">
            {experience.map((exp) => (
              <div key={exp.company} className="glass p-6 rounded-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h3 className="text-xl">{exp.role}</h3>
                  <span className="text-stone-500 text-sm">{exp.period}</span>
                </div>
                <p className="text-stone-400 mb-2">{exp.company}</p>
                <p className="text-stone-300 text-sm">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section>
          <h2 className="text-2xl mb-8">contact</h2>
          <div className="glass p-8 rounded-lg">
            <div className="grid md:grid-cols-2 gap-6">
              <a href="mailto:hello@huse.dev" className="text-stone-300 hover:text-stone-100 link-underline">
                email: hello@huse.dev
              </a>
              <a href="https://github.com/huse" className="text-stone-300 hover:text-stone-100 link-underline">
                github: @huse
              </a>
              <a href="https://linkedin.com/in/huse" className="text-stone-300 hover:text-stone-100 link-underline">
                linkedin: /in/huse
              </a>
              <a href="https://twitter.com/huse" className="text-stone-300 hover:text-stone-100 link-underline">
                twitter: @huse
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}