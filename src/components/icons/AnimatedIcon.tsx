import * as React from 'react';
import Lottie from 'react-lottie';

const AnimatedIcon = (animatedIcon: Element) => (
  <div style={{ height: '100%' }}>
    <Lottie
      options={{
        loop: true,
        autoplay: true,
        animationData: animatedIcon,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice',
        },
      }}
    />
  </div>
);

export { AnimatedIcon };
