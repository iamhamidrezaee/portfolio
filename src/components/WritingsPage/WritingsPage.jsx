import React, { useState } from 'react';
import FlowingMenu from '../FlowingMenu/FlowingMenu';
import Aurora from '../Aurora/Aurora';
import { writings } from '../../../data/writings.ts';
import { GoArrowLeft } from 'react-icons/go';
import './WritingsPage.css';

// Abstract gradient images for each writing category
const categoryImages = {
  'Machine Learning in Healthcare': 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=200&fit=crop&auto=format',
  'Machine Learning in Practice': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop&auto=format',
  'Software Architecture': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=200&fit=crop&auto=format',
  'On-Device AI': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop&auto=format',
  'Voice AI & Optimization': 'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=400&h=200&fit=crop&auto=format',
};

const WritingsPage = ({ onBack }) => {
  const [selectedWriting, setSelectedWriting] = useState(null);

  const menuItems = writings.map((writing) => ({
    link: `#${writing.id}`,
    text: writing.title,
    subtitle: `${writing.date} · ${writing.readTime}`,
    image: categoryImages[writing.category] || categoryImages['Machine Learning in Healthcare'],
    writing: writing,
  }));

  const handleItemClick = (item) => {
    const writing = writings.find(w => w.title === item.text);
    if (writing) {
      setSelectedWriting(writing);
    }
  };

  const handleBackToList = () => {
    setSelectedWriting(null);
  };

  if (selectedWriting) {
    return (
      <div className="writing-detail">
        <div className="aurora-background">
          <Aurora
            colorStops={["#5b728f", "#7f6490", "#895252"]}
            blend={1}
            amplitude={1.0}
            speed={0.8}
          />
        </div>
        <div className="writing-nav-container">
          <button className="back-button" onClick={handleBackToList}>
            <GoArrowLeft className="back-arrow" />
            <span>Back to Writings</span>
          </button>
        </div>
        <article className="writing-content">
          <header className="writing-header">
            <span className="writing-category">{selectedWriting.category}</span>
            <h1>{selectedWriting.title}</h1>
            <div className="writing-meta">
              <span>{selectedWriting.date}</span>
              <span className="meta-dot">·</span>
              <span>{selectedWriting.readTime}</span>
            </div>
          </header>
          <div 
            className="writing-body"
            dangerouslySetInnerHTML={{ 
              __html: selectedWriting.content
                .replace(/^# .+\n/m, '') // Remove first h1 since we show it in header
                .replace(/## (.+)/g, '<h2>$1</h2>')
                .replace(/### (.+)/g, '<h3>$1</h3>')
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.+?)\*/g, '<em>$1</em>')
                .replace(/> (.+)/g, '<blockquote>$1</blockquote>')
                .replace(/- (.+)/g, '<li>$1</li>')
                .replace(/\n\n/g, '</p><p>')
                .replace(/`(.+?)`/g, '<code>$1</code>')
            }}
          />
        </article>
      </div>
    );
  }

  return (
    <div className="writings-page">
      <div className="aurora-background">
        <Aurora
          colorStops={["#9ac3f9", "#deadff", "#fb9393"]}
          blend={1}
          amplitude={1.0}
          speed={0.8}
        />
      </div>
      <header className="writings-header">
        <button className="back-button" onClick={onBack}>
          <GoArrowLeft className="back-arrow" />
          <span>Home</span>
        </button>
        <h1 className="writings-title">Writings</h1>
      </header>
      <div className="writings-menu-container">
        <FlowingMenu items={menuItems} onItemClick={handleItemClick} />
      </div>
    </div>
  );
};

export default WritingsPage;

