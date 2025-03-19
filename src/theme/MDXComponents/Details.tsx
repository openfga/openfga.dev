import React, { type ComponentProps, type ReactElement } from 'react';
import Details from '@theme/Details';
import type { Props } from '@theme/MDXComponents/Details';

export default function MDXDetails(props: Props): JSX.Element {
  const items = React.Children.toArray(props.children);

  const summary = items.find(
    (item): item is ReactElement<ComponentProps<'summary'>> => React.isValidElement(item) && item.type === 'summary',
  );

  const children = <>{items.filter((item) => item !== summary)}</>;

  return (
    <Details
      {...props}
      onClickCapture={(e) => {
        if ((e.target as HTMLElement).tagName === 'A' && (e.target as HTMLElement).closest('summary')) {
          e.stopPropagation();
        }
      }}
      summary={summary}
    >
      {children}
    </Details>
  );
}
