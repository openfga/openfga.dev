import React from 'react';
import { Link } from '../Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './CardBox.module.css';

export enum LinkBulletType {
  None = 'none',
  Numbered = 'numbered',
  Bullets = 'bullets',
}

export type CardBoxProps = {
  title?: string;
  description?: string | React.ReactNode;
  links?: { to: string; label: string; id?: string }[];
  appearance?: 'filled' | 'gradient';
  border?: boolean;
  icon?: { label?: string; icon: React.ReactNode; alignment: 'left' | 'center' };
  centerTitle?: boolean;
  monoFontChildren?: boolean;
  smallFontChildren?: boolean;
  linkOpts?: {
    bulletType?: LinkBulletType;
    shouldJustifyStart?: boolean;
    shouldBold?: boolean;
    shouldShowArrowOnHover?: boolean;
  };
};

const CardBox: React.FC<CardBoxProps> = (props) => {
  const {
    title,
    description,
    links,
    appearance,
    border,
    icon,
    centerTitle = false,
    monoFontChildren = false,
    smallFontChildren = false,
    children,
    linkOpts,
  } = props;
  const {
    bulletType: linksBulletType = LinkBulletType.None,
    shouldJustifyStart: linksJustifyStart = false,
    shouldBold: linksBold = false,
    shouldShowArrowOnHover = false,
  } = linkOpts || {};
  const { siteConfig } = useDocusaurusContext();
  const updatedTitle = title ? title.replace('{ProductName}', siteConfig.customFields.productName as string) : title;
  const updatedDescription =
    description && typeof description === 'string'
      ? description.replace('{ProductName}', siteConfig.customFields.productName as string)
      : description;

  const baseClassName = 'documentation-card-box';
  const getAppearance = () => {
    switch (appearance) {
      case 'gradient':
        return styles[baseClassName + '-gradient'];
      case 'filled':
        return styles[baseClassName + '-filled'];
      default:
        return styles[baseClassName];
    }
  };

  return (
    <div
      className={`${getAppearance()} ${icon && !children && styles[baseClassName + '-fitcontent']} ${
        border && styles[baseClassName + '-border']
      }`}
    >
      <div className={styles[baseClassName + '-content']}>
        {icon && (
          <div
            className={
              icon.alignment === 'left'
                ? styles[baseClassName + '-alignment-left']
                : styles[baseClassName + '-alignment-center']
            }
          >
            <div className={updatedTitle ? styles[baseClassName + '-icon-large'] : styles[baseClassName + '-icon']}>
              {icon.icon}
            </div>
            {icon.label && <p className={styles[baseClassName + '-icon-label']}>{icon.label}</p>}
            {updatedTitle && <span className={styles[baseClassName + '-icon-title']}>{updatedTitle}</span>}
          </div>
        )}
        {updatedTitle && !icon && (
          <span className={styles[baseClassName + (centerTitle ? '-title-center' : '-title')]}>{updatedTitle}</span>
        )}
        {updatedDescription &&
          (typeof updatedDescription === 'string' ? (
            <p className={styles[baseClassName + '-description']}>{updatedDescription}</p>
          ) : (
            updatedDescription
          ))}
        {links && (
          <div
            className={[
              styles[baseClassName + '-links'],
              styles[baseClassName + '-links-' + linksBulletType],
              linksJustifyStart ? styles[baseClassName + '-links-justify-start'] : undefined,
              linksBold ? styles[baseClassName + '-links-bold'] : undefined,
            ].join(' ')}
          >
            <ul>
              {links?.map((link) => {
                return (
                  <li key={`li-${link.to}`}>
                    <Link
                      className={styles[baseClassName + '-link']}
                      key={`link-${link.to}`}
                      to={link.to}
                      showArrowOnHover={shouldShowArrowOnHover}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        <div
          className={
            styles[
              baseClassName +
                (smallFontChildren ? '-children-small' : monoFontChildren ? '-children-mono' : '-children')
            ]
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export { CardBox };
