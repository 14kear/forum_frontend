import React from 'react';

function About() {
  const pageStyle = {
    minHeight: 'calc(100vh - 80px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 16px',
    backgroundColor: '#121212',
    color: '#f1f1f1',
  };

  const cardStyle = {
    maxWidth: '800px',
    width: '100%',
    borderRadius: '24px',
    padding: '32px 28px',
    backgroundColor: '#1e1e1e',
    boxShadow:
      '0 18px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(44,44,44,0.9)',
    backdropFilter: 'blur(14px)',
  };

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 12px',
    borderRadius: '999px',
    backgroundColor: '#121212',
    border: '1px solid #2c2c2c',
    fontSize: '12px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#bbbbbb',
  };

  const dotStyle = {
    width: '8px',
    height: '8px',
    borderRadius: '999px',
    background:
      'conic-gradient(from 140deg, #4caf50, #4caf50, #4caf50, #81c784, #4caf50)',
    boxShadow: '0 0 12px rgba(76,175,80,0.9)',
  };

  const titleStyle = {
    marginTop: '20px',
    marginBottom: '10px',
    fontSize: '32px',
    lineHeight: 1.2,
    fontWeight: 700,
  };

  const accentStyle = {
    color: '#f1f1f1',
  };

  const subtitleStyle = {
    marginTop: '10px',
    marginBottom: '24px',
    fontSize: '15px',
    color: '#bbbbbb',
    maxWidth: '520px',
    lineHeight: 1.5,
    textAlign: 'center',
    marginInline: 'auto',
  };

  const textStyle = {
    marginTop: '8px',
    marginBottom: '8px',
    fontSize: '15px',
    color: '#f1f1f1',
  };

  const highlightStyle = {
    fontWeight: 600,
    color: '#4caf50',
  };

  const linksRowStyle = {
    marginTop: '24px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
  };

  const linkStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #2c2c2c',
    backgroundColor: '#2a2a2a',
    color: '#f1f1f1',
    fontSize: '14px',
    textDecoration: 'none',
    transition:
      'background-color 0.18s ease, border-color 0.18s ease, transform 0.12s ease, box-shadow 0.18s ease',
  };

  const linkIconStyle = {
    fontSize: '14px',
    opacity: 0.9,
  };

  const linkLabelStyle = {
    fontWeight: 500,
  };

  const linkSubLabelStyle = {};

  const linkHoverStyle = {
    boxShadow: '0 10px 25px rgba(0,0,0,0.7)',
    transform: 'translateY(-1px)',
    borderColor: '#4caf50',
    backgroundColor: '#3a3a3a',
  };

  const footerStyle = {
    marginTop: '28px',
    fontSize: '12px',
    color: '#bbbbbb',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '8px',
    flexWrap: 'wrap',
  };

  const handleMouseEnter = (event) => {
    Object.assign(event.currentTarget.style, linkHoverStyle);
  };

  const handleMouseLeave = (event) => {
    Object.assign(event.currentTarget.style, linkStyle);
  };

  const currentYear = new Date().getFullYear();

  return (
    <div style={pageStyle}>
      <main style={cardStyle}>
        <div style={badgeStyle}>
          <span style={dotStyle} />
          <span>Немного о проекте</span>
        </div>

        <h1 style={titleStyle}>
          Форум, который растёт вместе с&nbsp;
          <span style={accentStyle}>сообществом</span>.
        </h1>

        <p style={subtitleStyle}>
          Небольшой, но амбициозный форум для живых обсуждений, идей и
          аккуратных экспериментов с современными технологиями.
        </p>

        <p style={textStyle}>
          Привет! Меня зовут <span style={highlightStyle}>14kear</span>,
          я создал этот форум как пространство, где можно свободно делиться
          опытом, задавать вопросы и просто говорить о том, что действительно
          интересно.
        </p>

        <p style={textStyle}>
          Мне важны чистый интерфейс, комфорт для пользователей и ощущение, что
          за каждой строчкой кода стоит живой человек с идеями и характером.
        </p>

        <div style={linksRowStyle}>
          <a
            href="https://github.com/14kear"
            target="_blank"
            rel="noreferrer"
            style={linkStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span style={linkIconStyle}>⛓</span>
            <span style={linkLabelStyle}>GitHub</span>
          </a>

          <a
            href="https://t.me/fourteenkear"
            target="_blank"
            rel="noreferrer"
            style={linkStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span style={linkIconStyle}>✉️</span>
            <span style={linkLabelStyle}>Telegram</span>
          </a>
        </div>

        <div style={footerStyle}>
          <span>Сделано с вниманием к деталям.</span>
          <span>© {currentYear} 14kear</span>
        </div>
      </main>
    </div>
  );
}

export default About;

