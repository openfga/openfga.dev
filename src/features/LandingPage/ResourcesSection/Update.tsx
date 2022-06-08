import * as React from 'react';
import { ColorProps } from './CommonProp';
import * as icons from '@components/icons';
import styles from './ResourcesSection.module.css';

const updates = [
  'Some PR content here',
  'Maecenas et mollis erat, vel rhoncus neque.',
  'Nulla ac auctor ex, quis mattis purus. Cras ut tellus egestas, volutpat.',
  'Sed ac gravida massa, at laoreet nisi. Maecenas non mauris.',
  'Pellentesque interdum dignissim dolor eget imperdiet.',
  'Nulla sed mauris ut nunc rutrum blandit. Praesent vel.',
];

const Updates = ({ colorProps }: { colorProps: ColorProps }) => {
  return (
    <div className={styles.updates}>
      <h3>Latest Updates</h3>
      {updates.map((u) => (
        <div key={u} className={styles.update}>
          <icons.MergeIcon {...colorProps} />
          <span>{u}</span>
        </div>
      ))}
    </div>
  );
};

export { Updates };
