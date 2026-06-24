import React from 'react';
import PropTypes from 'prop-types';

/**
 * ProductRoadmapDialog - Modal dialog showing the product roadmap and upcoming features.
 * Props:
 *   - open: boolean (controls visibility)
 *   - onClose: function (called when dialog is dismissed)
 */
function ProductRoadmapDialog({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="roadmap-dialog-title"
      tabIndex={-1}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.32)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 10,
          boxShadow: '0 4px 24px rgba(0,0,0,0.14)',
          maxWidth: 440,
          width: '90%',
          padding: 32,
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: 16,
            right: 18,
            background: 'none',
            border: 'none',
            fontSize: 22,
            color: '#888',
            cursor: 'pointer',
            lineHeight: 1
          }}
        >
          &times;
        </button>
        <div
          style={{
            textAlign: 'center',
            marginBottom: 18
          }}
        >
          <span
            aria-hidden="true"
            style={{
              fontSize: 36,
              marginBottom: 6,
              display: 'inline-block',
              color: '#3498db'
            }}
          >
            🚀
          </span>
          <h2
            id="roadmap-dialog-title"
            style={{
              fontSize: 22,
              margin: '10px 0 0 0',
              fontWeight: 600
            }}
          >
            Product Roadmap
          </h2>
        </div>
        <div style={{ fontSize: 16, color: '#444', marginBottom: 18 }}>
          Here’s what’s coming soon to <b>Smart Todo App</b>:
        </div>
        <ul style={{ paddingLeft: 20, marginBottom: 18, color: '#555', fontSize: 15 }}>
          <li style={{ marginBottom: 10 }}>
            <b>AI Suggestions</b> <span style={{ color: '#3498db' }}>🤖</span>
            <br />
            <span style={{ color: '#666', fontSize: 14 }}>
              Get smart task suggestions and productivity insights powered by AI.
            </span>
          </li>
          <li style={{ marginBottom: 10 }}>
            <b>Collaboration</b> <span style={{ color: '#9b59b6' }}>🤝</span>
            <br />
            <span style={{ color: '#666', fontSize: 14 }}>
              Share tasks, assign responsibilities, and work together in real time.
            </span>
          </li>
          <li style={{ marginBottom: 10 }}>
            <b>Integrations</b> <span style={{ color: '#27ae60' }}>🔗</span>
            <br />
            <span style={{ color: '#666', fontSize: 14 }}>
              Connect with calendars, email, and your favorite tools.
            </span>
          </li>
          <li>
            <b>Reminders & Recurring Tasks</b> <span style={{ color: '#e67e22' }}>⏰</span>
            <br />
            <span style={{ color: '#666', fontSize: 14 }}>
              Never miss a deadline with reminders and flexible recurrence options.
            </span>
          </li>
        </ul>
        <div style={{ fontSize: 14, color: '#888', textAlign: 'center' }}>
          We’re building fast! <br />
          <span style={{ color: '#3498db' }}>Your feedback shapes our roadmap.</span>
        </div>
      </div>
    </div>
  );
}

ProductRoadmapDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default ProductRoadmapDialog;