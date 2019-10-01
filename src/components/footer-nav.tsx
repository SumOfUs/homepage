import React from 'react';
import { Link, FormattedMessage } from 'gatsby-plugin-intl';

const FooterNav = () => {
  return (
    <nav className="FooterNav nav-links">
      <span style={{ padding: '0 10px' }}>
        <Link to="/">
          <FormattedMessage id="footer.home" />
        </Link>
      </span>
      <span style={{ padding: '0 10px' }}>
        <Link to="/">
          <FormattedMessage id="footer.about" />
        </Link>
      </span>
      <span style={{ padding: '0 10px' }}>
        <Link to="/">
          <FormattedMessage id="footer.privacy_policy" />
        </Link>
      </span>
      <span style={{ padding: '0 10px' }}>
        <Link to="/">
          <FormattedMessage id="footer.jobs" />
        </Link>
      </span>
      <span style={{ padding: '0 10px' }}>
        <Link to="/">
          <FormattedMessage id="footer.faqs" />
        </Link>
      </span>
      <span style={{ padding: '0 10px' }}>
        <Link to="/">
          <FormattedMessage id="footer.media" />
        </Link>
      </span>
      <span style={{ padding: '0 10px' }}>
        <Link to="/">
          <FormattedMessage id="footer.funding" />
        </Link>
      </span>
      <span style={{ padding: '0 10px' }}>
        <Link to="/">
          <FormattedMessage id="footer.contact" />
        </Link>
      </span>
    </nav>
  );
};

export default FooterNav;
