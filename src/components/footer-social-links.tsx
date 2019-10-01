import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
library.add(fab);

const FooterSocialLinks = () => {
  const {
    site: {
      siteMetadata: { social },
    },
  } = useStaticQuery(graphql`
    query SocialLinksQuery {
      site {
        siteMetadata {
          social {
            name
            url
          }
        }
      }
    }
  `);

  return (
    <div className="SocialLinks">
      {social.map(i => (
        <a key={i.name} href={i.url}>
          <FontAwesomeIcon icon={['fab', i.name]} />
        </a>
      ))}
    </div>
  );
};

export default FooterSocialLinks;
