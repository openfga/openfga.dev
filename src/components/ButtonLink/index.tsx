import * as React from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';

import styles from './ButtonLink.module.css';

type ButtonLinkProps = {
  to?: string;
  href?: string;
  variant?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
};

const ButtonLink: React.FC<ButtonLinkProps> = ({ to, href, variant = 'default', icon, children }) => {
  const getClasses = () => {
    switch (variant) {
      case 'primary':
        return clsx(styles.buttonLink, styles.buttonLinkPrimary);
      case 'secondary':
        return clsx(styles.buttonLink, styles.buttonLinkSecondary);
      case 'outlined':
        return clsx(styles.buttonLink, styles.buttonLinkOutlined);
      default:
        return styles.buttonLink;
    }
  };

  return (
    <Link to={to} href={href} className={getClasses()}>
      <>
        {icon}
        {children}
      </>
    </Link>
  );
};

export { ButtonLink };
