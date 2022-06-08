import React from 'react';
import styles from './Layout.module.css';

export interface ColumnLayoutProps {
  children: React.ReactNode;
  cols: number;
  equalWidth?: boolean;
  style?: React.CSSProperties;
}

export const ColumnLayout = ({ cols, children, equalWidth, ...rest }: ColumnLayoutProps) => {
  return (
    <div {...rest} className={styles['column-layout-' + cols + (equalWidth ? '-equal-width' : '')]}>
      {children}
    </div>
  );
};
