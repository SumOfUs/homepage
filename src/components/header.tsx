import PropTypes from 'prop-types';
import React from 'react';
import Headroom from 'react-headroom';
import Logo from './logo';
import { Link } from 'gatsby-plugin-intl';

function onPin(...args) {
  console.log('Header pinned', ...args);
}

const Header = ({ siteTitle }) => (
  <Headroom onPin={onPin}>
    <header
      style={{
        padding: '20px 24px',
      }}
    >
      <Link to="/">
        <Logo />
      </Link>
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          padding: `1.45rem 1.0875rem`,
        }}
      >
        <h1 style={{ margin: 0 }}>
          <Link
            to="/"
            style={{
              color: `white`,
              textDecoration: `none`,
            }}
          >
            {siteTitle}
          </Link>
        </h1>
      </div>
    </header>
  </Headroom>
);

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
