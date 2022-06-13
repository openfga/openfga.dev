import * as React from 'react';

import styles from './StyleGrid.module.css';

const StyleGrid = () => (
  <div className={styles.grid}>
    {/* The grid defines the layout with some cascading styles for the borders. These divs are, indeed, meant to be empty */}
    <div />
    <div />
  </div>
);

export { StyleGrid };
