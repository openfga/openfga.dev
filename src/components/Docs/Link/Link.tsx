import React from 'react';
import DocusaurusLink from '@docusaurus/Link';
import styles from './Link.module.css';

export interface LinkProps {
  children: React.ReactNode;
  onClick?: () => void;
  fontSize?: string;
  href?: string;
  to?: string;
  className?: string;

  showArrowOnHover?: boolean;
}

export function Link({ href, to, className, children, onClick, showArrowOnHover = false }: LinkProps) {
  const baseClassName = 'documentation-link';
  return (
    <DocusaurusLink
      className={[className, showArrowOnHover ? styles[`${baseClassName}-show-arrow-on-hover`] : undefined].join(' ')}
      href={href}
      to={to}
      onClick={onClick}
    >
      <>{children}</>
    </DocusaurusLink>
  );
}
