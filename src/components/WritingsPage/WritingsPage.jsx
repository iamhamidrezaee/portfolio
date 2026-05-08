import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { GoArrowRight } from 'react-icons/go';
import { writings } from '../../../data/writings.ts';
import PortfolioNav from '../PortfolioNav';
import './WritingsPage.css';

const cleanText = (value = '') =>
  value
    .replaceAll('â€™', "'")
    .replaceAll('â€˜', "'")
    .replaceAll('â€œ', '"')
    .replaceAll('â€', '"')
    .replaceAll('â€¦', '...')
    .replaceAll('â€”', '-')
    .replaceAll('â€“', '-')
    .replaceAll('Â·', '/')
    .replaceAll('â†’', '->');

const inlineParts = (line) => {
  const parts = cleanText(line).split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g).filter(Boolean);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index}>{part.slice(1, -1)}</code>;
    }

    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

const renderMarkdown = (content) => {
  const lines = cleanText(content)
    .replace(/^# .+\n+/, '')
    .split('\n');

  const blocks = [];
  let paragraph = [];
  let list = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push({ type: 'p', lines: paragraph });
    paragraph = [];
  };

  const flushList = () => {
    if (!list.length) return;
    blocks.push({ type: 'list', items: list });
    list = [];
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      return;
    }

    if (line.startsWith('## ')) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'h2', text: line.slice(3) });
      return;
    }

    if (line.startsWith('### ')) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'h3', text: line.slice(4) });
      return;
    }

    if (line.startsWith('> ')) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'quote', text: line.slice(2) });
      return;
    }

    if (/^[-*]\s+/.test(line)) {
      flushParagraph();
      list.push(line.replace(/^[-*]\s+/, ''));
      return;
    }

    paragraph.push(line);
  });

  flushParagraph();
  flushList();

  return blocks.map((block, index) => {
    if (block.type === 'h2') return <h2 key={index}>{inlineParts(block.text)}</h2>;
    if (block.type === 'h3') return <h3 key={index}>{inlineParts(block.text)}</h3>;
    if (block.type === 'quote') return <blockquote key={index}>{inlineParts(block.text)}</blockquote>;
    if (block.type === 'list') {
      return (
        <ul key={index}>
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex}>{inlineParts(item)}</li>
          ))}
        </ul>
      );
    }

    return (
      <p key={index}>
        {block.lines.map((line, lineIndex) => (
          <React.Fragment key={lineIndex}>
            {inlineParts(line)}
            {lineIndex < block.lines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    );
  });
};

const WritingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedId = searchParams.get('writing') || writings[0]?.id;
  const selectedWriting = useMemo(
    () => writings.find((writing) => writing.id === requestedId) || writings[0],
    [requestedId],
  );

  const handleSelect = (id) => {
    setSearchParams({ writing: id });
  };

  return (
    <main className="writing-page">
      <PortfolioNav />

      <section className="writing-layout">
        <aside className="writing-index" aria-label="Writing index">
          <p className="writing-kicker">Writings</p>
          <h1>Notes on systems</h1>
          <div className="writing-list">
            {writings.map((writing) => (
              <button
                className={writing.id === selectedWriting.id ? 'writing-list-item active' : 'writing-list-item'}
                key={writing.id}
                onClick={() => handleSelect(writing.id)}
              >
                <span>{cleanText(writing.category)}</span>
                <strong>{cleanText(writing.title)}</strong>
                <small>{cleanText(writing.date)} / {writing.readTime}</small>
              </button>
            ))}
          </div>
        </aside>

        <article className="writing-article">
          <header>
            <p className="writing-kicker">{cleanText(selectedWriting.category)}</p>
            <h2>{cleanText(selectedWriting.title)}</h2>
            <p>{cleanText(selectedWriting.excerpt)}</p>
          </header>
          <div className="writing-body">
            {renderMarkdown(selectedWriting.content)}
          </div>
        </article>
      </section>

      <footer className="writing-footer">
        <Link to="/projects">
          Technical archive
          <GoArrowRight aria-hidden="true" />
        </Link>
      </footer>
    </main>
  );
};

export default WritingsPage;
