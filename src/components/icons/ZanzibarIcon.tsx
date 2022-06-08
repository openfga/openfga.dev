import * as React from 'react';
import { IconProps } from './types';

const ZanzibarIcon: React.FC<IconProps> = ({ width = 21, height = 20, color = '#272B33' }) => (
  <svg width={width} height={height} viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.99414 0C2.33729 0 0.994141 1.34315 0.994141 3V17C0.994141 18.6569 2.33729 20 3.99414 20H17.0495C18.7064 20 20.0495 18.6569 20.0495 17V3C20.0495 1.34315 18.7064 0 17.0495 0H3.99414ZM3.99146 5.35339V2.72754H17.0836V5.08785L8.20292 14.6176H17.3278V17.273H3.7168V14.8832L12.567 5.35339H3.99146Z"
      fill={color}
    />
  </svg>
);

export { ZanzibarIcon };
