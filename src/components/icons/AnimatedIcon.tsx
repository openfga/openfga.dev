import * as React from 'react';
import Lottie from 'react-lottie';
import { LottieObj } from './types';

const AnimatedIcon: React.FC<LottieObj> = ({element}) => (
  <Lottie options={{
    loop: true,
    autoplay: true,
    animationData: element,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }} />
);

export { AnimatedIcon };
