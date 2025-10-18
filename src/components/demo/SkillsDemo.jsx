import React from 'react';
import Skills from '../Skills';

const SkillsDemo = () => {
  const sampleContent = {
    "Frontend Development": [
      { "React": "https://alessandrocarella.github.io/" },
      { "Vue.js": "https://alessandrocarella.github.io/" },
      { "TypeScript": null },
      { "Tailwind CSS": "https://alessandrocarella.github.io/" }
    ],
    "Backend Development": [
      { "Node.js": "https://alessandrocarella.github.io/" },
      { "Python": null },
      { "PostgreSQL": "https://alessandrocarella.github.io/" },
      { "MongoDB": null }
    ],
    "Tools & Platforms": [
      { "Git": "https://alessandrocarella.github.io/" },
      { "Docker": "https://alessandrocarella.github.io/" },
      { "AWS": null },
      { "Vercel": "https://alessandrocarella.github.io/" }
    ]
  };

  const colorScheme = {
    background: '#f8fafc',
    mainTitle: '#1e293b',
    sectionTitle: '#475569',
    capsuleBackground: '#ffffff',
    capsuleText: '#334155',
    capsuleBorder: '#e2e8f0',
    previewBorder: '#3b82f6',
    previewBackground: '#ffffff'
  };

  const demoContainerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #dbeafe, #e0e7ff)',
    padding: '32px',
  };

  const innerContainerStyle = {
    maxWidth: '1152px',
    margin: '0 auto',
  };

  return (
    <div style={demoContainerStyle}>
      <div style={innerContainerStyle}>
        <Skills content={sampleContent} colors={colorScheme} />
      </div>
    </div>
  );
};

export default SkillsDemo;