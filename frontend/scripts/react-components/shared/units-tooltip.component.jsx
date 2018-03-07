import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

class UnitsTooltip extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getPos = this.getPos.bind(this);
    this.getRef = this.getRef.bind(this);
  }
  getPos() {
    if (!this.el) return 0;
    const { x, y } = this.props;
    const left =
      x < window.innerWidth - this.el.clientWidth - 10 ? x + 10 : x - this.el.clientWidth - 10;
    const top =
      y < window.innerHeight - this.el.clientHeight - 10 ? y + 10 : y - this.el.clientHeight - 10;
    return { left, top };
  }

  getRef(el) {
    this.el = el;
  }

  render() {
    const { className, text, items = [], show } = this.props;
    const { top, left } = this.getPos();
    return (
      <div
        ref={this.getRef}
        className={cx('c-units-tooltip', className, { 'is-hidden': !show })}
        style={{ left, top }}
      >
        <div className="units-tooltip-text">{text}</div>
        {items.map(item => (
          <div className="units-tooltip-value">
            <div className="units-tooltip-value-title">{item.title}</div>
            <div className="units-tooltip-value-data">
              {item.value}
              {item.unit && <span className="units-tooltip-value-unit">{item.unit}</span>}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

UnitsTooltip.propTypes = {
  className: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  text: PropTypes.string,
  items: PropTypes.array,
  show: PropTypes.bool
};

export default UnitsTooltip;
