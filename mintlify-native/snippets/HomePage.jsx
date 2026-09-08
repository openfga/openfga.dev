// Native Mintlify port of openfga.dev landing page.
// No npm imports — only pre-injected hooks (useState, useEffect) and browser APIs.
// Lottie-animated icons replaced with simple inline SVGs.
// Docusaurus-specific APIs replaced with hardcoded values.
//
// IMPORTANT: everything lives inside the single exported HomePage function.
// Mintlify's snippet compiler only reliably scopes the exported binding —
// sibling top-level consts/components in the same file are not resolved at
// runtime (throws "Expected component `X` to be defined"). Nesting avoids it.

export const HomePage = () => {
  // ─── INLINE ICONS ──────────────────────────────────────────────────────────

  const OpenFGALogo = () => (
    <svg width="413" height="89" viewBox="0 0 472 101" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M0 30.8163V49.021C0 68.8706 12.173 79.8373 31.1453 79.8373C50.1176 79.8373 62.181 68.8706 62.181 49.021V30.8163C62.181 10.9667 50.1176 0 31.1453 0C12.173 0 0 10.9667 0 30.8163ZM12.7213 30.3777C12.7213 18.753 19.5207 11.2957 31.1453 11.2957C42.6603 11.2957 49.4596 18.753 49.4596 30.3777V49.4597C49.4596 61.0843 42.6603 68.5416 31.1453 68.5416C19.5207 68.5416 12.7213 61.0843 12.7213 49.4597V30.3777Z" fill="white"/>
      <path d="M72.9968 100.235H84.9505V70.6253H86.0472C89.1178 75.341 94.6012 79.8373 104.581 79.8373C117.85 79.8373 129.365 68.8706 129.365 51.2143C129.365 33.6677 117.85 22.701 104.581 22.701C94.6012 22.701 89.1178 27.1973 85.8278 32.1323H84.7312V24.2363H72.9968V100.235ZM101.071 69.419C91.7498 69.419 84.8408 62.6196 84.8408 51.2143C84.8408 39.809 91.7498 33.0097 101.071 33.0097C110.503 33.0097 117.302 39.809 117.302 51.2143C117.302 62.7293 110.503 69.419 101.071 69.419Z" fill="white"/>
      <path d="M136.211 50.995C136.211 67.9933 147.397 79.8373 163.847 79.8373C178.762 79.8373 185.122 71.2833 188.303 65.5806L178.323 60.207C176.13 64.9226 172.291 69.419 164.066 69.419C155.403 69.419 149.042 63.3873 148.603 55.0526H189.619V50.1176C189.619 33.558 179.091 22.5913 163.408 22.5913C147.507 22.5913 136.211 34.1063 136.211 50.995ZM148.713 45.731C149.7 38.164 154.964 33.0097 163.299 33.0097C171.304 33.0097 176.678 37.9446 177.336 45.731H148.713Z" fill="white"/>
      <path d="M199.37 24.2363V78.302H211.324V50.5563C211.324 39.3703 217.136 33.1193 226.129 33.1193C234.135 33.1193 238.85 37.3963 238.85 46.4986V78.302H250.914V45.8406C250.914 32.0227 242.14 23.2493 229.748 23.2493C219.439 23.2493 214.614 27.8553 212.201 32.571H211.105V24.2363H199.37Z" fill="white"/>
      <path d="M263.952 1.53533V78.302H276.673V45.5117H310.122V34.1063H276.673V13.0503H312.315V1.53533H263.952Z" fill="white"/>
      <path d="M318.933 48.8016C318.933 68.6513 331.106 79.8373 350.297 79.8373C369.05 79.8373 379.907 68.9803 379.907 51.1046V40.2477H347.336V51.1046H367.405V52.5303C367.405 62.2906 361.703 68.5416 350.297 68.5416C338.782 68.5416 331.654 61.0843 331.654 48.9113V30.926C331.654 18.753 338.782 11.2957 350.297 11.2957C361.483 11.2957 366.747 17.8757 366.747 26.978V28.4037H379.469V27.1973C379.469 10.857 369.27 0 350.297 0C331.215 0 318.933 11.186 318.933 31.1453V48.8016Z" fill="white"/>
      <path d="M405.595 1.53533L383.004 78.302H396.054L401.208 60.4263H429.722L434.876 78.302H447.817L425.225 1.53533H405.595ZM404.279 48.9113L414.917 12.173H416.013L426.541 48.9113H404.279Z" fill="white"/>
      <path d="M441.889 1.26831V3.48623H446.515V16.0544H448.944V3.48623H453.57V1.26831H441.889Z" fill="white"/>
      <path d="M455.137 1.26831V16.0544H457.503V3.80307H457.714L461.347 16.0544H464.79L468.402 3.80307H468.613V16.0544H471V1.26831H466.797L463.164 13.583H462.952L459.34 1.26831H455.137Z" fill="white"/>
    </svg>
  );

  const ModelIcon = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="4" y="4" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
      <rect x="22" y="4" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
      <rect x="13" y="22" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
      <line x1="11" y1="18" x2="11" y2="22" stroke="currentColor" strokeWidth="2"/>
      <line x1="29" y1="18" x2="29" y2="22" stroke="currentColor" strokeWidth="2"/>
      <line x1="11" y1="22" x2="20" y2="22" stroke="currentColor" strokeWidth="2"/>
      <line x1="29" y1="22" x2="20" y2="22" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );

  const CodeIcon = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <polyline points="14,12 6,20 14,28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="26,12 34,20 26,28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="23" y1="8" x2="17" y2="32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );

  const FastIcon = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M22 6 L10 22 H19 L18 34 L30 18 H21 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none"/>
    </svg>
  );

  const OpenIcon = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="2"/>
      <ellipse cx="20" cy="20" rx="6" ry="14" stroke="currentColor" strokeWidth="2"/>
      <line x1="6" y1="20" x2="34" y2="20" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );

  const CNCFIcon = () => (
    <img src="/images/img/cncf-icon-white.svg" alt="" aria-hidden="true" width="40" height="40" />
  );

  const CommunityIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 .7a11.3 11.3 0 0 0-3.57 22c.57.1.78-.25.78-.55v-2.17c-3.18.69-3.85-1.35-3.85-1.35-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.73-1.53-2.54-.29-5.21-1.27-5.21-5.58 0-1.23.44-2.24 1.16-3.03-.12-.29-.5-1.45.11-3.02 0 0 .95-.3 3.11 1.16a10.8 10.8 0 0 1 5.67 0c2.16-1.47 3.1-1.16 3.1-1.16.62 1.57.23 2.73.12 3.02.72.79 1.16 1.8 1.16 3.03 0 4.32-2.68 5.28-5.23 5.57.41.36.78 1.06.78 2.13v3.17c0 .3.2.66.79.55A11.3 11.3 0 0 0 12 .7Z"/>
    </svg>
  );

  const ResourceIcon = ({ type }) => {
    if (type === 'zanzibar') {
      return (
        <svg viewBox="0 0 21 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" clipRule="evenodd" d="M3.994 0A3 3 0 0 0 .994 3v14a3 3 0 0 0 3 3H17.05a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3H3.994Zm-.003 5.353V2.728h13.093v2.36l-8.881 9.53h9.125v2.655H3.717v-2.39l8.85-9.53H3.99Z"/>
        </svg>
      );
    }
    if (type === 'playground') {
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="3" y="3" width="8" height="8" rx="1.5"/>
          <rect x="13" y="13" width="8" height="8" rx="1.5"/>
          <path d="M11 7h4a2 2 0 0 1 2 2v4M7 11v4a2 2 0 0 0 2 2h4"/>
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="9" y="2" width="6" height="13" rx="3"/>
        <path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8"/>
      </svg>
    );
  };

  // ─── DATA ──────────────────────────────────────────────────────────────────

  const ADOPTER_LOGOS = [
    { name: 'Agicap', src: '/images/img/adopters/agicap.svg' },
    { name: 'Appscode', src: '/images/img/adopters/appscode.svg' },
    { name: 'Auth0', src: '/images/img/adopters/auth0.svg' },
    { name: 'Canonical', src: '/images/img/adopters/canonical.svg' },
    { name: 'Distyl', src: '/images/img/adopters/distyl.svg' },
    { name: 'Docker', src: '/images/img/adopters/docker.svg' },
    { name: 'EarthScope', src: '/images/img/adopters/earthscope.svg' },
    { name: 'Flex', src: '/images/img/adopters/flex.svg' },
    { name: 'Grafana', src: '/images/img/adopters/grafana.svg' },
    { name: 'Headspace', src: '/images/img/adopters/headspace.svg' },
    { name: 'Okta', src: '/images/img/adopters/okta.svg' },
    { name: 'OpenObserve', src: '/images/img/adopters/openobserve.svg' },
    { name: 'PlatformMesh', src: '/images/img/adopters/platformmesh.svg' },
    { name: 'ReadAI', src: '/images/img/adopters/readai.svg' },
    { name: 'Skyral', src: '/images/img/adopters/skyral.svg' },
    { name: 'Sourcegraph', src: '/images/img/adopters/sourcegraph.svg' },
    { name: 'Zuplo', src: '/images/img/adopters/zuplo.svg' },
  ];

  const FEATURES = [
    {
      id: 'model',
      Icon: ModelIcon,
      title: 'Model any authorization system',
      content: "OpenFGA takes the best ideas from Google's Zanzibar paper for Relationship-Based Access Control, and also solves problems for Role-based Access Control and Attribute-Based Access Control use cases. The modeling language is powerful enough for engineers, but friendly enough for other stakeholders on your team as well.",
    },
    {
      id: 'code',
      Icon: CodeIcon,
      title: 'Works with your code',
      content: "SDKs for the most popular languages have already been written, making it easy to integrate and grow alongside your applications. OpenFGA also makes it trivial to contribute new SDKs to support your project's language.",
    },
    {
      id: 'fast',
      Icon: FastIcon,
      title: 'Blazing fast',
      content: 'OpenFGA is designed to answer authorization check calls in milliseconds, which lets it scale with projects of any size. It works just as well for small startups and hobby programmers building single applications as it does for enterprise companies building platforms on a global scale.',
    },
    {
      id: 'open',
      Icon: OpenIcon,
      title: 'Built in the open',
      html: "Transparency and peer review are important for building secure, stable, and sustainable software. OpenFGA's <a href='https://github.com/openfga/rfcs/blob/main/README.md' target='_blank' rel='noopener noreferrer'>RFC process</a> and <a href='https://github.com/openfga/.github/blob/main/CONTRIBUTING.md' target='_blank' rel='noopener noreferrer'>governance model</a> invite anyone to become a contributor, and collaboratively develop the <a href='https://github.com/orgs/openfga/projects/1' target='_blank' rel='noopener noreferrer'>public roadmap</a>. Come create the next standard for authorization with us!",
    },
    {
      id: 'sponsored',
      Icon: CNCFIcon,
      title: 'CNCF Incubation Project',
      html: "We are a <a href='https://www.cncf.io/' target='_blank' rel='noopener noreferrer'>Cloud Native Computing Foundation</a> incubating project.",
    },
    {
      id: 'contribute',
      Icon: CommunityIcon,
      title: 'Get Involved',
      html: "Join OpenFGA's active <a href='https://openfga.dev/community' target='_blank' rel='noopener noreferrer'>Slack and GitHub community</a>, check out existing <a href='https://github.com/openfga/rfcs' target='_blank' rel='noopener noreferrer'>RFCs</a> to understand where the project is headed, and learn more about how to take part by reading our <a href='https://github.com/openfga/.github/blob/main/CONTRIBUTING.md' target='_blank' rel='noopener noreferrer'>CONTRIBUTING.md</a>.",
      cta: {
        text: 'Learn how to get involved →',
        href: 'https://github.com/openfga/.github/blob/main/CONTRIBUTING.md#contribution-process',
      },
    },
  ];

  const RESOURCES = [
    { type: 'zanzibar', text: 'Zanzibar Academy →', href: 'https://zanzibar.academy/' },
    { type: 'playground', text: 'Auth0 FGA Playground →', href: 'https://play.fga.dev/' },
    { type: 'podcast', text: 'Podcast - Authorization in Software →', href: 'https://podcastindex.org/podcast/4368675' },
  ];

  const FOOTER_LINKS = [
    { text: 'Twitter', href: 'https://twitter.com/OpenFGA' },
    { text: 'CNCF Slack', href: 'https://openfga.dev/community' },
    { text: 'GitHub', href: 'https://github.com/openfga' },
    { text: 'Mastodon', href: 'https://mastodon.social/@openfga' },
  ];

  const DOCKER_COMMAND = `docker pull openfga/openfga && \\
docker run -p 8080:8080 -p 8081:8081 \\
-p 3000:3000 openfga/openfga run`;

  // ─── STATE / EFFECTS ───────────────────────────────────────────────────────

  const [copied, setCopied] = useState(false);
  const [headingEl, setHeadingEl] = useState(null);

  // home.css is auto-included by Mintlify on every page (same mechanism as .js
  // files in the content directory). No manual loading needed here.

  // Navbar logo hide/show on scroll — uses ref-callback-in-state to avoid useRef.
  useEffect(() => {
    if (!headingEl) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const logo = document.querySelector('.navbar__logo, [data-testid="navbar-logo"], .logo');
        if (logo) logo.setAttribute('data-minimal', String(!entry.isIntersecting));
      },
      { threshold: 0 }
    );
    observer.observe(headingEl);
    return () => observer.unobserve(headingEl);
  }, [headingEl]);

  const copyDockerCommand = () => {
    navigator.clipboard.writeText(DOCKER_COMMAND.replace(/\\\n/g, ' ')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  // Duplicate logos for seamless CSS scroll loop
  const carouselLogos = [...ADOPTER_LOGOS, ...ADOPTER_LOGOS];

  // ─── RENDER ────────────────────────────────────────────────────────────────

  return (
    <div className="home-page" style={{ background: '#272b33', color: '#fff', fontFamily: 'inherit' }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      {/* Two-column flex layout per HeroHeader.module.css: content ~50% left,
          pattern video ~50% right as a sibling (not a background). The video
          column is hidden below 996px via .hero-pattern-video in home.css. */}
      <header className="hero-container">
        <div className="hero-content">
          <h1 ref={setHeadingEl} style={{ margin: '0 0 12px', lineHeight: 1 }}>
            <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>OpenFGA —</span>
            <OpenFGALogo />
            <span style={{ display: 'block', fontSize: '1.75rem', fontWeight: 600, color: '#a0aec0', marginTop: '16px', letterSpacing: '-0.01em' }}>
              Fine-Grained Authorization
            </span>
          </h1>

          <p style={{ fontSize: '1.1rem', color: '#cbd5e0', maxWidth: '480px', margin: '20px 0 32px', lineHeight: 1.6 }}>
            OpenFGA is an open-source authorization solution that allows developers to build granular access control using an easy-to-read modeling language and friendly APIs.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a href="#quick-start" className="home-btn home-btn--primary">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }} aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M8.37046 10.4506H0.875325C0.126602 10.4506 -0.275417 9.61053 0.2155 9.07089L8.20846 0.28415C8.76556 -0.328002 9.81555 0.124049 9.70393 0.92644L8.37046 10.4506Z" fill="currentColor"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M7.62834 5.54883H15.1245C15.8732 5.54883 16.2752 6.38889 15.7843 6.92853L7.79033 15.7162C7.23323 16.3284 6.18324 15.8763 6.29486 15.0739L7.62834 5.54883Z" fill="currentColor"/>
              </svg>
              Quick start
            </a>
            <a href="https://github.com/openfga" target="_blank" rel="noopener noreferrer" className="home-btn home-btn--secondary">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M8 0C3.58 0 0 3.67055 0 8.20235C0 11.8319 2.29 14.8975 5.47 15.9843C5.87 16.0561 6.02 15.81 6.02 15.5947C6.02 15.3999 6.01 14.754 6.01 14.067C4 14.4464 3.48 13.5646 3.32 13.1033C3.23 12.8674 2.84 12.1395 2.5 11.9447C2.22 11.7909 1.82 11.4115 2.49 11.4013C3.12 11.391 3.57 11.9959 3.72 12.242C4.44 13.4826 5.59 13.134 6.05 12.9187C6.12 12.3855 6.33 12.0267 6.56 11.8216C4.78 11.6166 2.92 10.9091 2.92 7.77173C2.92 6.87972 3.23 6.14151 3.74 5.56735C3.66 5.36229 3.38 4.52155 3.82 3.39372C3.82 3.39372 4.49 3.17841 6.02 4.23446C6.66 4.04991 7.34 3.95763 8.02 3.95763C8.7 3.95763 9.38 4.04991 10.02 4.23446C11.55 3.16816 12.22 3.39372 12.22 3.39372C12.66 4.52155 12.38 5.36229 12.3 5.56735C12.81 6.14151 13.12 6.86947 13.12 7.77173C13.12 10.9194 11.25 11.6166 9.47 11.8216C9.76 12.078 10.01 12.5701 10.01 13.3391C10.01 14.4361 10 15.3179 10 15.5947C10 15.81 10.15 16.0664 10.55 15.9843C13.5763 14.9506 16 11.8319 16 8.20235C16 3.67055 12.42 0 8 0Z" fill="currentColor"/>
              </svg>
              Join us on GitHub
            </a>
          </div>
        </div>

        <video
          autoPlay muted loop playsInline
          poster="/pattern.png"
          src="/videos/pattern.mp4"
          className="hero-pattern-video"
        />
      </header>

      {/* ── QUICK START ──────────────────────────────────────────────────── */}
      {/* Section background matches --ofga-neutral-black (#131519) — deliberately
          darker than the page background (#272b33) per QuickStartSection.module.css */}
      <section id="quick-start" style={{ padding: '80px 24px', background: '#131519' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center', maxWidth: '1100px', margin: '0 auto' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '12px' }}>Quick Start</h2>
            <p style={{ color: '#bdc4cf', fontSize: '1.15rem', marginBottom: '8px', fontWeight: 500 }}>Trying OpenFGA is as easy as...</p>
            <p style={{ color: '#a0aec0', marginBottom: '16px' }}>
              Run the following snippet in a terminal in an environment with Docker installed:
            </p>

            <div style={{ position: 'relative', background: '#000', borderRadius: '8px', padding: '16px 48px 16px 16px', marginBottom: '20px' }}>
              <pre style={{ margin: 0, color: '#e2e8f0', fontSize: '0.9rem', fontFamily: 'monospace', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{DOCKER_COMMAND}</pre>
              <button
                onClick={copyDockerCommand}
                aria-label={copied ? 'Docker command copied' : 'Copy Docker command to clipboard'}
                style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: copied ? '#79ed83' : '#ffffff', padding: '4px' }}
              >
                {copied ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                )}
              </button>
            </div>

            <p style={{ color: '#a0aec0', fontSize: '0.95rem', marginBottom: '8px' }}>
              OpenFGA will be running at localhost:8080 on your machine. Learn about other options and next steps in the project{' '}
              <a href="https://github.com/openfga/openfga" target="_blank" rel="noopener noreferrer" style={{ color: '#79ed83' }}>README.md</a>{' '}
              or <a href="/docs/getting-started" style={{ color: '#79ed83' }}>Getting Started</a> guides.
            </p>
            <p style={{ color: '#a0aec0', fontSize: '0.95rem' }}>
              Learn how to use sample authorization models and create your own with the project&rsquo;s extensive{' '}
              <a href="/docs/modeling" style={{ color: '#79ed83' }}>documentation</a>.
            </p>
          </div>

          <div>
            <video
              autoPlay muted loop playsInline
              poster="/terminal.png"
              src="/videos/terminal.mp4"
              style={{ width: '100%', borderRadius: '10px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
            />
          </div>
        </div>

        {/* Adopters carousel */}
        <div style={{ marginTop: '60px' }}>
          <p style={{ textAlign: 'center', color: '#718096', marginBottom: '24px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Adopted by teams at
          </p>
          <div className="adopters-carousel" role="region" aria-label="OpenFGA adopters">
            <div className="adopters-track">
              {carouselLogos.map((logo, i) => (
                <div key={`${logo.name}-${i}`} className="adopter-logo" aria-hidden={i >= ADOPTER_LOGOS.length ? 'true' : undefined}>
                  <img
                    src={logo.src}
                    alt={i >= ADOPTER_LOGOS.length ? '' : `${logo.name} logo — OpenFGA Adopter`}
                    loading="lazy"
                    decoding="async"
                    style={{ height: '32px', width: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.6 }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      {/* No card border/background per FeaturesSection.module.css — plain grid blocks */}
      <section id="features" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '48px', textAlign: 'left', paddingLeft: '2rem' }}>Features</h2>
          <div className="features-grid">
            {FEATURES.map(({ id, Icon, title, content, html, cta }) => (
              <div key={id} className="feature-card">
                <div className="feature-icon-box">
                  <Icon />
                </div>
                <h3 style={{ fontSize: '2rem', fontWeight: 500, marginBottom: '0', fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h3>
                {html
                  ? <p style={{ color: '#bdc4cf', fontSize: '1rem', lineHeight: 1.7, margin: 0 }} dangerouslySetInnerHTML={{ __html: html }} />
                  : <p style={{ color: '#bdc4cf', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>{content}</p>
                }
                {cta && (
                  <a className="feature-cta" href={cta.href} target="_blank" rel="noopener noreferrer">
                    {cta.text}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESOURCES ────────────────────────────────────────────────────── */}
      <section id="resources" className="resources-section">
        <div className="resources-panel">
          <h2>
            Since you&rsquo;re here, you might be interested in some ReBAC resources:
          </h2>
          <ul className="resources-list">
            {RESOURCES.map(({ type, text, href }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-link"
                >
                  <span className="resource-icon"><ResourceIcon type={type} /></span>
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="home-footer">
        <div className="home-footer-inner">
          <div className="home-footer-legal">
            <a href="https://www.linuxfoundation.org/trademark-usage" target="_blank" rel="noopener noreferrer" aria-label="Linux Foundation trademark usage">
              <img src="/images/img/cncf-icon-white.svg" alt="CNCF" width="24" height="24" />
            </a>
            <p>
              © {new Date().getFullYear()}{' '}
              <a href="https://www.linuxfoundation.org/" target="_blank" rel="noopener noreferrer">The Linux Foundation</a>®. All rights reserved. For a list of trademarks of The Linux Foundation, see our{' '}
              <a href="https://www.linuxfoundation.org/trademark-usage" target="_blank" rel="noopener noreferrer">Trademark Usage page</a>.
            </p>
          </div>
          <nav className="home-footer-socials" aria-label="OpenFGA social links">
            {FOOTER_LINKS.map(({ text, href }) => (
              <a key={text} href={href} target="_blank" rel="me noopener noreferrer">
                {text}
              </a>
            ))}
          </nav>
        </div>
      </footer>

    </div>
  );
};
