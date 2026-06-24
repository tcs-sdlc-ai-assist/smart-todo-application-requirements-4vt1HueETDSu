import React from 'react';

/**
 * AIPlaceholder - Static UI for upcoming AI-driven suggestions feature.
 */
function AIPlaceholder() {
  return (
    <div
      aria-label="AI Suggestions Coming Soon"
      role="region"
      style={{
        maxWidth: 420,
        margin: '40px auto',
        padding: 32,
        background: '#f6f8fa',
        borderRadius: 10,
        boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
        textAlign: 'center',
        color: '#444'
      }}
    >
      <div
        style={{
          fontSize: 38,
          marginBottom: 16,
          color: '#3498db',
          userSelect: 'none'
        }}
        aria-hidden="true"
      >
        🤖
      </div>
      <h2 style={{ fontSize: 22, margin: '0 0 10px 0', fontWeight: 600 }}>
        AI Suggestions
      </h2>
      <p style={{ fontSize: 16, color: '#666', margin: '0 0 18px 0' }}>
        Smart task suggestions and productivity insights powered by AI are coming soon.
      </p>
      <span
        style={{
          display: 'inline-block',
          background: '#eee',
          color: '#888',
          fontSize: 14,
          padding: '5px 16px',
          borderRadius: 16,
          fontWeight: 500,
          letterSpacing: 0.5
        }}
      >
        Coming Soon
      </span>
    </div>
  );
}

export default AIPlaceholder;