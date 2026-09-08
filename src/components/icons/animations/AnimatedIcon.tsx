import * as React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

const Player = React.lazy(() =>
  import('@lottiefiles/react-lottie-player').then((module) => ({ default: module.Player })),
);

type AnimatedIconProps = { element?: string | object };
const AnimatedIcon: React.FC<AnimatedIconProps> = ({ element }) => {
  return (
    <div style={{ height: '100%' }}>
      <BrowserOnly>
        {() => (
          <React.Suspense fallback={null}>
            <Player autoplay={true} loop={true} controls={true} src={element} />
          </React.Suspense>
        )}
      </BrowserOnly>
    </div>
  );
};

export { AnimatedIcon };
