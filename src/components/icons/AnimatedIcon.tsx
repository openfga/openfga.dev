import * as React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { LottieObj } from './types';

const AnimatedIcon: React.FC<LottieObj> = ({ element }) => (
  <div style={{ height: '100%' }}>
    <Player autoplay={true} loop={true} controls={true} src={element} />
  </div>
);

export { AnimatedIcon };
