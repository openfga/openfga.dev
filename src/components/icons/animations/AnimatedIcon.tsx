import * as React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

type AnimatedIconProps = {
  element?: string | object;
};
const AnimatedIcon: React.FC<AnimatedIconProps> = ({ element }) => (
  <div style={{ height: '100%' }}>
    <Player autoplay={true} loop={true} controls={true} src={element} />
  </div>
);

export { AnimatedIcon };
