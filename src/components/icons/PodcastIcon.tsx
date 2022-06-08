import * as React from 'react';
import { IconProps } from './types';

const PodcastIcon: React.FC<IconProps> = ({ width = 24, height = 24, color = '#272B33' }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11.9778 1C11.1836 1 10.422 1.31607 9.86044 1.87868C9.29888 2.44129 8.9834 3.20435 8.9834 4V12C8.9834 12.7956 9.29888 13.5587 9.86044 14.1213C10.422 14.6839 11.1836 15 11.9778 15C12.772 15 13.5336 14.6839 14.0952 14.1213C14.6567 13.5587 14.9722 12.7956 14.9722 12V4C14.9722 3.20435 14.6567 2.44129 14.0952 1.87868C13.5336 1.31607 12.772 1 11.9778 1Z"
      fill={color}
    />
    <path
      d="M18.9642 10V12C18.9642 13.8565 18.228 15.637 16.9177 16.9497C15.6074 18.2625 13.8303 19 11.9772 19C10.1241 19 8.34698 18.2625 7.03667 16.9497C5.72636 15.637 4.99023 13.8565 4.99023 12V10"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M11.9775 19V23" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.98535 23H15.9705" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export { PodcastIcon };
