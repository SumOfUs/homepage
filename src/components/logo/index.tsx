import React from 'react';
import classnames from 'classnames';
import './logo.css';

interface Props {
  horizontal?: boolean;
  white?: boolean;
}

const Logo = (props: Props) => {
  const className = classnames('logo', {
    'logo-horizontal': props.horizontal === true,
    'logo-white': props.white === true,
  });
  return <div className={className}></div>;
};

export default Logo;
