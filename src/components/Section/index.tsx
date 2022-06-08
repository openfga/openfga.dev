import * as React from 'react';

type SectionProps = {
  id: string;
  className?: any;
};

const Section: React.FC<SectionProps> = ({ id, children, className }) => {
  return (
    <section className={className} id={id}>
      <div className="container">{children}</div>
    </section>
  );
};

export { Section };
