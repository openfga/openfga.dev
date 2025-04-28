import * as React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

type AnimatedIconProps = { element?: string | object };
const AnimatedIcon: React.FC<AnimatedIconProps> = ({ element }) => {
  return (
    <div style={{ height: '100%' }}>
      <BrowserOnly>
        {() => {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const { Player } = require('@lottiefiles/react-lottie-player');
          return <Player autoplay={true} loop={true} controls={true} src={element} />;
        }}
      </BrowserOnly>
    </div>
  );
};

export { AnimatedIcon };