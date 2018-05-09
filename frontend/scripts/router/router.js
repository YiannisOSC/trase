import { connectRoutes, NOT_FOUND, redirect, replace } from 'redux-first-router';
import restoreScroll from 'redux-first-router-restore-scroll';
import MarkdownRenderer from 'react-components/static-content/markdown-renderer/markdown-renderer.container';
import TeamMember from 'react-components/team/team-member/team-member.container';
import Team from 'react-components/team/team.container';
import { parse, stringify } from 'utils/stateURL';
import capitalize from 'lodash/capitalize';

import { BREAKPOINTS } from 'constants';
import {
  getPostsContent,
  getTestimonialsContent,
  getTweetsContent
} from 'react-components/home/home.thunks';
import { withSidebarNavLayout } from 'react-components/nav/sidebar-nav/with-sidebar-nav-layout.hoc';
import { getPageStaticContent } from 'react-components/static-content/static-content.thunks';
import { loadBaseAppData } from 'react-components/shared/app.thunks';
import { getTeam } from 'react-components/team/team.thunks';
import {
  setContextForExplorePage,
  redirectToExplore
} from 'react-components/explore/explore.thunks';
import { loadToolInitialData } from 'scripts/react-components/tool/tool.thunks';

const pagesNotSupportedOnMobile = ['tool', 'map', 'data'];

// We await for all thunks using Promise.all, this makes the result then-able and allows us to
// add an await solely to the thunks that need it.
const dispatchThunks = (...thunks) => (...params) =>
  Promise.all(thunks.map(thunk => thunk(...params)));

const loadPageData = (...thunks) => (...params) =>
  loadBaseAppData(...params).then(() => Promise.all(thunks.map(thunk => thunk(...params))));

const routes = {
  home: {
    path: '/',
    page: 'home',
    title: 'TRASE',
    thunk: loadPageData(getPostsContent, getTweetsContent, getTestimonialsContent)
  },
  explore: {
    path: '/explore/:contextId?',
    page: 'explore',
    title: state =>
      `TRASE - ${capitalize(state.app.selectedContext.countryName)} ${capitalize(
        state.app.selectedContext.commodityName
      )}`,
    thunk: loadPageData(setContextForExplorePage)
  },
  tool: {
    path: '/flows',
    page: 'tool',
    title: state => {
      if (!state.app.selectedContext) {
        return 'TRASE';
      }

      return `TRASE - ${capitalize(state.app.selectedContext.countryName)} ${capitalize(
        state.app.selectedContext.commodityName
      )}`;
    },
    thunk: loadPageData(loadToolInitialData)
  },
  profileRoot: {
    path: '/profiles',
    page: 'profile-root',
    title: 'TRASE - Profiles',
    extension: 'jsx',
    nav: {
      className: '-light'
    },
    thunk: loadPageData()
  },
  profileActor: {
    path: '/profile-actor',
    page: 'profile-actor',
    title: 'TRASE - Profiles',
    nav: {
      className: '-light',
      printable: true
    },
    thunk: loadPageData()
  },
  profilePlace: {
    path: '/profile-place',
    page: 'profile-place',
    title: 'TRASE - Profiles',
    nav: {
      className: '-light',
      printable: true
    },
    thunk: loadPageData()
  },
  data: {
    path: '/data',
    page: 'data-portal',
    title: 'TRASE - Data Download',
    thunk: loadPageData(),
    nav: {
      className: '-light'
    }
  },
  team: {
    path: '/about/team',
    page: 'static-content',
    title: 'TRASE - Team',
    thunk: loadPageData(getTeam),
    component: withSidebarNavLayout(Team)
  },
  teamMember: {
    path: '/about/team/:member',
    page: 'static-content',
    title: 'TRASE - Team',
    thunk: loadPageData(getTeam),
    component: withSidebarNavLayout(TeamMember),
    parent: 'team'
  },
  about: {
    path: '/about/:section?',
    page: 'static-content',
    title: 'TRASE - About',
    thunk: loadPageData(getPageStaticContent),
    component: withSidebarNavLayout(MarkdownRenderer)
  },
  notSupportedOnMobile: {
    path: '/not-supported',
    page: 'not-supported',
    nav: {
      className: '-light'
    },
    thunk: loadPageData()
  },
  [NOT_FOUND]: {
    path: '/404',
    page: 'static-content',
    thunk: loadPageData(() => replace('/404'), getPageStaticContent)
  }
};

const config = {
  basename: '/',
  notFoundPath: '/404',
  querySerializer: {
    parse,
    stringify
  },
  title: state => {
    const foo = routes[state.location.type];

    if (!foo.title) {
      return 'TRASE';
    }

    if (typeof foo.title === 'function') {
      return foo.title(state);
    }

    return foo;
  },
  onBeforeChange: (dispatch, getState, { action }) => {
    const isMobile = window.innerWidth <= BREAKPOINTS.small;

    if (isMobile && pagesNotSupportedOnMobile.includes(action.type)) {
      return dispatch(redirect({ type: 'notSupportedOnMobile' }));
    }

    return dispatchThunks(
      redirectToExplore
      // resetToolThunk
    )(dispatch, getState, { action });
  },
  restoreScroll: restoreScroll({
    shouldUpdateScroll: (prev, current) => {
      if (
        ((current.kind === 'redirect' && prev.kind === 'push') ||
          (current.kind === 'pop' && prev.kind === 'pop')) &&
        prev.pathname === current.pathname
      ) {
        return prev.prev.pathname !== current.pathname ? [0, 0] : false;
      }
      return prev.pathname !== current.pathname ? [0, 0] : false;
    }
  })
};

export default connectRoutes(routes, config);
