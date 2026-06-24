import * as React from 'react';
import { lazy, Suspense } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

const Player = lazy(() => import('@lottiefiles/react-lottie-player').then((module) => ({ default: module.Player })));

type AnimatedIconProps = { element?: string | object };
const AnimatedIcon: React.FC<AnimatedIconProps> = ({ element }) => {
  return (
    <div style={{ height: '100%' }}>
      <BrowserOnly>
        {() => (
          <Suspense fallback={null}>
            <Player autoplay={true} loop={true} controls={true} src={element} />
          </Suspense>
        )}
      </BrowserOnly>
    </div>
  );
};

export { AnimatedIcon };
