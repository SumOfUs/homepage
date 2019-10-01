module.exports = {
  siteMetadata: {
    title: 'SumOfUs – Fighting for people over power',
    description: 'The homepage for SumOfUs.',
    author: `SumOfUs`,
    social: [
      {
        name: 'instagram',
        url: 'https://www.instagram.com/sumofus/',
      },
      {
        name: 'youtube',
        url: 'https://www.youtube.com/user/SumOfUsTube',
      },
      {
        name: 'github',
        url: 'https://github.com/SumOfUs/',
      },
      {
        name: 'twitter',
        url: 'https://twitter.com/SumOfUs',
      },
      {
        name: 'facebook',
        url: 'https://www.facebook.com/SumOfUsOrg/',
      },
    ],
  },
  plugins: [
    'gatsby-plugin-typescript',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-intl`,
      options: {
        path: `${__dirname}/src/intl`,
        languages: ['es', `de`, `en`, `fr`],
        defaultLanguage: `en`,
        redirect: false,
      },
    },
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
};
