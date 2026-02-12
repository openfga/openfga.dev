import * as React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './AdoptersCarousel.module.css';

type AdopterLogo = {
  name: string;
  src: string;
};

const adopterLogos: AdopterLogo[] = [
  { name: 'Agicap', src: '/img/adopters/agicap.svg' },
  { name: 'Appscode', src: '/img/adopters/appscode.svg' },
  { name: 'Auth0', src: '/img/adopters/auth0.svg' },
  { name: 'Canonical', src: '/img/adopters/canonical.svg' },
  { name: 'Distyl', src: '/img/adopters/distyl.svg' },
  { name: 'Docker', src: '/img/adopters/docker.svg' },
  { name: 'EarthScope', src: '/img/adopters/earthscope.svg' },
  { name: 'Flex', src: '/img/adopters/flex.svg' },
  { name: 'Grafana', src: '/img/adopters/grafana.svg' },
  { name: 'Headspace', src: '/img/adopters/headspace.svg' },
  { name: 'Okta', src: '/img/adopters/okta.svg' },
  { name: 'OpenObserve', src: '/img/adopters/openobserve.svg' },
  { name: 'PlatformMesh', src: '/img/adopters/platformmesh.svg' },
  { name: 'ReadAI', src: '/img/adopters/readai.svg' },
  { name: 'Skyral', src: '/img/adopters/skyral.svg' },
  { name: 'Sourcegraph', src: '/img/adopters/sourcegraph.svg' },
  { name: 'Zuplo', src: '/img/adopters/zuplo.svg' },
];

const AdopterImage: React.FC<{ logo: AdopterLogo; isDuplicate: boolean }> = ({ logo, isDuplicate }) => {
  const src = useBaseUrl(logo.src);
  return <img src={src} alt={isDuplicate ? '' : logo.name} loading="lazy" decoding="async" />;
};

const AdoptersCarousel = () => {
  const repeatedLogos = [...adopterLogos, ...adopterLogos];

  return (
    <div className={styles.banner} aria-label="OpenFGA adopters">
      <p className={styles.title}>Adopted by teams at</p>
      <div className={styles.carousel}>
        <div className={styles.track}>
          {repeatedLogos.map((logo, index) => {
            const isDuplicate = index >= adopterLogos.length;

            return (
              <div className={styles.logo} key={`${logo.name}-${index}`} aria-hidden={isDuplicate}>
                <AdopterImage logo={logo} isDuplicate={isDuplicate} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { AdoptersCarousel };
