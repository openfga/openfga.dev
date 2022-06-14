import clsx from 'clsx';
import * as React from 'react';

import styles from './Section.module.css';

type SectionProps = {
  id: string;
  className?: string;
};

const Section: React.FC<SectionProps> = ({ id, children, className }) => {
  return (
    <section className={clsx(styles.section, className)} id={id}>
      <div className={'container__no-padding'}>{children}</div>
    </section>
  );
};

export { Section };
