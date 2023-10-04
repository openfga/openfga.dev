import * as React from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { ThemeConfig } from '@docusaurus/preset-classic';
import { NavbarItem } from '@docusaurus/theme-common';
import type { Props } from '@theme/NavbarItem/NavbarNavLink';
import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './SocialMedia.module.css';

const SOCIAL_MEDIA_ITEMS = ['Twitter', 'Discord', 'GitHub'];

const SocialMedia: React.FC = () => {
  const baseClassName = 'social-media-banner';
  const { siteConfig } = useDocusaurusContext();
  const { navbar }: ThemeConfig = siteConfig.themeConfig;
  const navbarItems = navbar.items;
  const filteredItems: NavbarItem[] & Props[] = navbarItems
    .filter(({ label }) => SOCIAL_MEDIA_ITEMS.includes(label))
    .sort(
      ({ label: labelA }, { label: labelB }) => SOCIAL_MEDIA_ITEMS.indexOf(labelA) - SOCIAL_MEDIA_ITEMS.indexOf(labelB),
    );

  return (
    <div className={styles[baseClassName]}>
      {filteredItems.map(({ label, to, ['aria-label']: ariaLabel }) => (
        <Link
          to={useBaseUrl(to as string)}
          className={clsx(styles[baseClassName + '-item'], styles[baseClassName + '-' + label.toLowerCase()])}
          aria-label={ariaLabel as string}
        >
          {label}
        </Link>
      ))}
    </div>
  );
};

export { SocialMedia };
