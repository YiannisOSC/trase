import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ContextSelector from 'react-components/shared/context-selector/context-selector.container';
import NavLinksList from 'react-components/nav/nav-links-list.component';
import YearsSelector from 'react-components/nav/filters-nav/years-selector/years-selector.container';
import ResizeBySelector from 'react-components/nav/filters-nav/resize-by-selector/resize-by-selector.container';
import RecolorBySelector from 'react-components/nav/filters-nav/recolor-by-selector/recolor-by-selector.container';
import ViewSelector from 'react-components/nav/filters-nav/view-selector/view-selector.container';
import ToolSearch from 'react-components/tool/tool-search/tool-search.container';
import LocaleSelector from 'react-components/nav/locale-selector/locale-selector.container';
import AdminLevelFilter from 'react-components/nav/filters-nav/admin-level-filter/admin-level-filter.container';

class FiltersNav extends React.PureComponent {
  static isActiveLink(match, location, link) {
    const { type, query = {} } = location;
    const { payload = {}, type: linkType } = link.page;
    return (
      type === linkType &&
      !!(query.state && query.state.isMapVisible) ===
        !!(payload.query && payload.query.isMapVisible)
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false
    };
    this.toggleMenu = this.toggleMenu.bind(this);
    this.renderMenuOpened = this.renderMenuOpened.bind(this);
    this.renderMenuClosed = this.renderMenuClosed.bind(this);
  }

  toggleMenu() {
    this.setState(state => ({ menuOpen: !state.menuOpen }));
  }

  renderMenuOpened() {
    const { links } = this.props;
    const decoratedLinks = [
      {
        name: 'Home',
        page: 'home'
      },
      ...links
    ];

    return (
      <React.Fragment>
        <div className="filters-nav-left-section">
          <NavLinksList
            links={decoratedLinks}
            listClassName="filters-nav-submenu-list"
            itemClassName="filters-nav-item"
            linkClassName="filters-nav-link"
            linkActiveClassName="filters-nav-link -active"
            isActiveLink={FiltersNav.isActiveLink}
          />
        </div>
        <div className="filters-nav-right-section">
          <div className="filters-nav-item">
            <LocaleSelector />
          </div>
          <ToolSearch className="filters-nav-item" />
        </div>
      </React.Fragment>
    );
  }

  renderMenuClosed() {
    const { selectedContext, isExplore } = this.props;
    return (
      <React.Fragment>
        <div className="filters-nav-left-section">
          <ContextSelector className="filters-nav-item" />
          {selectedContext && (
            <React.Fragment>
              {!isExplore && <AdminLevelFilter className="filters-nav-item" />}
              <YearsSelector className="filters-nav-item" />
            </React.Fragment>
          )}
        </div>
        <div className="filters-nav-right-section">
          {!isExplore && (
            <React.Fragment>
              {selectedContext && (
                <React.Fragment>
                  <ResizeBySelector className="filters-nav-item" />
                  <RecolorBySelector className="filters-nav-item" />
                  <ViewSelector className="filters-nav-item" />
                </React.Fragment>
              )}
              <ToolSearch className="filters-nav-item" />
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }

  render() {
    const { menuOpen } = this.state;
    return (
      <div className="c-filters-nav">
        <div className="filters-nav-item">
          <button className={cx('c-burger', { open: menuOpen })} onClick={this.toggleMenu}>
            <span className="ingredient" />
            <span className="ingredient" />
            <span className="ingredient" />
          </button>
        </div>
        <div className="filters-nav-section-container">
          {menuOpen ? this.renderMenuOpened() : this.renderMenuClosed()}
        </div>
      </div>
    );
  }
}

FiltersNav.propTypes = {
  links: PropTypes.array.isRequired,
  selectedContext: PropTypes.object,
  isExplore: PropTypes.bool
};

export default FiltersNav;
