export default function Services() {
  const IconGamepad = (props) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M6 8h12a4 4 0 0 1 3.87 5.02l-1 3.5A3.5 3.5 0 0 1 17.5 20a3.5 3.5 0 0 1-3.35-2.4l-.26-.8h-4.8l-.26.8A3.5 3.5 0 0 1 5.5 20a3.5 3.5 0 0 1-3.37-3.48l-1-3.5A4 4 0 0 1 6 8Zm2.25 2.75h-1.5v1.5h-1.5v1.5h1.5v1.5h1.5v-1.5h1.5v-1.5h-1.5v-1.5Zm8.5 1a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm-2.5-1.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/>
    </svg>
  );
  const IconCode = (props) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M9.4 16.6 5.8 13l3.6-3.6 1.4 1.4L8.6 13l2.2 2.2-1.4 1.4Zm5.2 0-1.4-1.4L15.4 13l-2.2-2.2 1.4-1.4L18.2 13l-3.6 3.6Z"/>
    </svg>
  );
  const IconRobot = (props) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M11 2h2v2h3a2 2 0 0 1 2 2v2h2v2h-2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-8H4V8h2V6a2 2 0 0 1 2-2h3V2Zm5 6V6H8v2h8Zm-8 3v7h10v-7H8Zm2 2h2v2h-2v-2Zm4 0h2v2h-2v-2Z"/>
    </svg>
  );
  const IconCompass = (props) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm4.2 6.2-2.7 6.8-6.8 2.7 2.7-6.8 6.8-2.7Zm-7.32 7.32 3.26-1.3 1.3-3.26-3.26 1.3-1.3 3.26Z"/>
    </svg>
  );

  return (
    <section>
      <h1>Services</h1>
      <div className="grid cards">
        <article className="card">
          <div className="service-header">
            <span className="service-icon amber"><IconGamepad /></span>
            <h3>Game Development</h3>
          </div>
          <p>Prototyping and building engaging gameplay systems.</p>
          <ul className="checklist">
            <li>Unreal Engine, Unity, Godot</li>
            <li>C++/C#/GDScript</li>
            <li>Gameplay mechanics, UI, polish</li>
          </ul>
        </article>

        <article className="card">
          <div className="service-header">
            <span className="service-icon blue"><IconCode /></span>
            <h3>Web Development</h3>
          </div>
          <p>Modern, performant web apps and sites.</p>
          <ul className="checklist">
            <li>REST APIs in NodeJS & Python</li>
            <li>React front‑ends</li>
            <li>MERN stack applications</li>
          </ul>
        </article>

        <article className="card">
          <div className="service-header">
            <span className="service-icon green"><IconRobot /></span>
            <h3>Automation & Scraping</h3>
          </div>
          <p>Python tooling to save time and gather data.</p>
          <ul className="checklist">
            <li>Web scraping and data pipelines</li>
            <li>Bots and task automation</li>
            <li>AI integrations</li>
          </ul>
        </article>
      </div>
    </section>
  );
}
