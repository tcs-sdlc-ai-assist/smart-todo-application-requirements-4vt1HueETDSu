import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Tooltip - Accessible tooltip component for info/placeholder explanations.
 * Props:
 *   - content: string or JSX (tooltip content)
 *   - children: React element (trigger)
 *   - placement: 'top' | 'bottom' | 'left' | 'right' (default: 'top')
 *   - delay: number (ms, default: 120)
 */
function Tooltip({ content, children, placement = 'top', delay = 120 }) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef();

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const showTooltip = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setVisible(true);
      positionTooltip();
    }, delay);
  };

  const hideTooltip = () => {
    clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  const positionTooltip = () => {
    if (!triggerRef.current || !tooltipRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    let top = 0, left = 0;
    switch (placement) {
      case 'bottom':
        top = triggerRect.bottom + window.scrollY + 8;
        left = triggerRect.left + window.scrollX + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + window.scrollY + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left + window.scrollX - tooltipRect.width - 8;
        break;
      case 'right':
        top = triggerRect.top + window.scrollY + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + window.scrollX + 8;
        break;
      case 'top':
      default:
        top = triggerRect.top + window.scrollY - tooltipRect.height - 8;
        left = triggerRect.left + window.scrollX + (triggerRect.width - tooltipRect.width) / 2;
        break;
    }
    setCoords({ top: Math.max(top, 0), left: Math.max(left, 0) });
  };

  // Clone child to attach event handlers and aria-describedby
  const triggerProps = {
    ref: triggerRef,
    onMouseEnter: showTooltip,
    onFocus: showTooltip,
    onMouseLeave: hideTooltip,
    onBlur: hideTooltip,
    'aria-describedby': visible ? 'tooltip-content' : undefined,
    tabIndex: children.props.tabIndex !== undefined ? children.props.tabIndex : 0
  };

  return (
    <>
      {React.cloneElement(children, triggerProps)}
      {visible && (
        <div
          ref={tooltipRef}
          id="tooltip-content"
          role="tooltip"
          style={{
            position: 'absolute',
            top: coords.top,
            left: coords.left,
            zIndex: 9999,
            background: '#222',
            color: '#fff',
            padding: '7px 14px',
            borderRadius: 6,
            fontSize: 14,
            boxShadow: '0 2px 8px rgba(0,0,0,0.13)',
            pointerEvents: 'none',
            maxWidth: 260,
            lineHeight: 1.4,
            whiteSpace: 'pre-line'
          }}
        >
          {content}
        </div>
      )}
    </>
  );
}

Tooltip.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  children: PropTypes.element.isRequired,
  placement: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  delay: PropTypes.number
};

export default Tooltip;