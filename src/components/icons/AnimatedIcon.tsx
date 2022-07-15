import renderRoutes from '@docusaurus/renderRoutes';
import * as React from 'react';
import Lottie from 'react-lottie';

const AnimatedIcon = ({animatedIcon}) => (
  <div>
    {console.log(animatedIcon)}
    <Lottie options={{
      loop: true,
      autoplay: true,
      animationData: animatedIcon,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    }} />
  </div>
);


export { AnimatedIcon };
