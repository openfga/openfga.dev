import renderRoutes from '@docusaurus/renderRoutes';
import * as React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { LottieObj } from './types';

const AnimatedIcon: React.FC<LottieObj> = ({element}) => (
  <div>
    <Player
      autoplay={true}
      loop={true}
      controls={true}
      src={element}
    />
  </div>
);

export { AnimatedIcon };
