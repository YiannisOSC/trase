/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FiltersDropdown from 'react-components/nav/filters-nav/filters-dropdown.component';
import YearsThumb from 'react-components/nav/filters-nav/years-selector/years-thumb.component';
import cx from 'classnames';
import 'styles/components/tool/years-slider.scss';

const YEAR_WIDTH = 40;
const id = 'years';

class YearsSelector extends Component {
  constructor(props) {
    super(props);

    this.onSelectorDown = this.onSelectorDown.bind(this);
    this.onSelectorMoved = this.onSelectorMoved.bind(this);
    this.onSelectorUp = this.onSelectorUp.bind(this);
    this.onDropdownUp = this.onDropdownUp.bind(this);

    this.state = this.getState(props);
  }

  componentWillReceiveProps(props) {
    this.setState(this.getState(props));
  }

  onDropdownUp() {
    if (this.dragging === true) {
      return;
    }
    this.props.onToggle(id);
  }

  onSelectorDown(event) {
    this.dragging = true;
    this.currentSelectorThumb = event.target.getAttribute('data-thumb');
    document.addEventListener('mousemove', this.onSelectorMoved);
    document.addEventListener('touchmove', this.onSelectorMoved);
    document.addEventListener('mouseup', this.onSelectorUp);
    document.addEventListener('touchend', this.onSelectorUp);
  }

  onSelectorMoved(event) {
    const sliderOffset = this.slider.getBoundingClientRect().left;
    const pointerX = event.touches ? event.touches[0].clientX : event.clientX;
    const x = pointerX - sliderOffset;
    this.moveSelector(x);
  }

  onSelectorUp(event) {
    this.dragging = false;
    event.stopPropagation();
    document.removeEventListener('mousemove', this.onSelectorMoved);
    document.removeEventListener('mouseup', this.onSelectorUp);
    document.removeEventListener('touchmove', this.onSelectorMoved);
    document.removeEventListener('touchend', this.onSelectorUp);
    this.releaseSelector();
  }

  getState({ selectedYears, years }) {
    const left = YEAR_WIDTH * years.indexOf(selectedYears[0]);
    const right = YEAR_WIDTH * (years.indexOf(selectedYears[1]) + 1);
    return {
      left,
      right
    };
  }

  moveSelector(x) {
    const deltaWidth = this.state.right - this.state.left;

    let left;
    let right;

    if (this.currentSelectorThumb === null) {
      left = x - deltaWidth / 2;
      right = x + deltaWidth / 2;
      if (left < 0) {
        left = 0;
        right = deltaWidth;
      } else if (right > this.totalWidth) {
        right = this.totalWidth;
        left = right - deltaWidth;
      }
    } else if (this.currentSelectorThumb === 'left') {
      // not after right thumb, not below 0
      left = Math.min(this.state.right, Math.max(0, x));
      right = this.state.right;
    } else if (this.currentSelectorThumb === 'right') {
      // not before left thumb, not above total width
      right = Math.max(this.state.left, Math.min(this.totalWidth, x));
      left = this.state.left;
    }
    this.setState({
      left,
      right
    });
  }

  releaseSelector() {
    let leftIndex = Math.round(this.state.left / YEAR_WIDTH);
    if (leftIndex === this.props.years.length) {
      leftIndex = this.props.years.length - 1;
    }

    let rightIndex = Math.max(0, Math.round(this.state.right / YEAR_WIDTH) - 1);
    if (rightIndex <= leftIndex) {
      rightIndex = leftIndex;
    }
    this.props.onSelected([this.props.years[leftIndex], this.props.years[rightIndex]]);
  }

  render() {
    const { className, dropdownClassName, currentDropdown, selectedYears, years } = this.props;
    this.totalWidth = YEAR_WIDTH * years.length;
    const title =
      selectedYears[0] === selectedYears[1] ? (
        <span>{selectedYears[0]}</span>
      ) : (
        <span>
          {selectedYears[0]}&thinsp;-&thinsp;{selectedYears[1]}
        </span>
      );
    const totalWidthStyle = { width: `${this.totalWidth}px` };
    const deltaWidth = this.state.right - this.state.left;
    const selectorWidthStyle = {
      width: `${deltaWidth}px`,
      left: `${this.state.left}px`
    };
    return (
      <div className={cx('js-dropdown', className)} onMouseUp={this.onDropdownUp}>
        <div className={cx('c-dropdown', dropdownClassName)}>
          <span className="dropdown-label">
            year{selectedYears[0] !== selectedYears[1] && <span>s</span>}
          </span>
          <span className="dropdown-title">{title}</span>
          <FiltersDropdown
            id={id}
            currentDropdown={currentDropdown}
            onClickOutside={this.props.onToggle}
          >
            <div className="dropdown-list">
              <div
                className="c-years-slider"
                ref={elem => {
                  this.slider = elem;
                }}
              >
                <ul className="background" style={totalWidthStyle}>
                  {years.map((year, index) => <li key={index} />)}
                </ul>
                <div
                  className="selector"
                  style={selectorWidthStyle}
                  onMouseDown={this.onSelectorDown}
                  onTouchStart={this.onSelectorDown}
                >
                  <YearsThumb id="left" />
                  <YearsThumb id="right" x={deltaWidth} />
                </div>
                <ul className="years" style={totalWidthStyle}>
                  {years.map((year, index) => <li key={index}>{year}</li>)}
                </ul>
              </div>
            </div>
          </FiltersDropdown>
        </div>
      </div>
    );
  }
}

YearsSelector.propTypes = {
  onToggle: PropTypes.func,
  onSelected: PropTypes.func,
  years: PropTypes.array,
  currentDropdown: PropTypes.string,
  selectedYears: PropTypes.array,
  className: PropTypes.string,
  dropdownClassName: PropTypes.string
};

export default YearsSelector;
