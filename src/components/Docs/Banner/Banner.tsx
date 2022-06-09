import React from 'react';
import Link from '@docusaurus/Link';
import styles from './Banner.module.css';

type BannerProps = {
  title: string;
  description: string | React.ReactNode;
  link: string;
  preset?: 'slack' | 'drive' | 'github' | 'iot' | 'playground' | 'entitlements';
};

const Banner: React.FC<BannerProps> = ({ title, description, link, preset }) => {
  const baseClassName = 'documentation-banner';

  return (
    <Link to={link} className={styles[baseClassName]}>
      <div className={styles[baseClassName + '-icon']}>
        {preset && <div className={styles[baseClassName + '-icon-' + preset]}></div>}
      </div>
      <div className={styles[baseClassName + '-content']}>
        <h4 className={styles[baseClassName + '-title']}>{title}</h4>
        <p className={styles[baseClassName + '-description']}>{description}</p>
      </div>
      <div className={styles[baseClassName + '-chevron']}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18L15 12L9 6" stroke="#65676E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Link>
  );
};

export { Banner };
