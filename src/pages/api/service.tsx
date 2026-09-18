import React, { useEffect, useState } from 'react';
import Head from '@docusaurus/Head';
import Layout from '@theme/Layout';
import routes from '../../data/legacy-api-routes.json';
import { resolveLegacyApiFragment } from '../../utils/legacy-api-redirect.mjs';

export default function LegacyApiReference() {
  const [destination, setDestination] = useState('/api-reference');

  useEffect(() => {
    const result = resolveLegacyApiFragment(window.location.hash, routes);
    if (result.warning) console.warn(result.warning);
    const target = `${result.destination}${window.location.search}`;
    setDestination(target);
    window.location.replace(target);
  }, []);

  return (
    <Layout title="API reference moved">
      <Head>
        <meta name="robots" content="noindex, follow" />
      </Head>
      <main className="container margin-vert--xl" data-legacy-api-compatibility>
        <h1>The API reference has moved</h1>
        <p>Redirecting to the corresponding API documentation.</p>
        <p>
          <a href={destination}>Open the API reference</a>
        </p>
        <noscript>
          <p>
            JavaScript is required to preserve links to individual operations. Use the API reference link to continue.
          </p>
        </noscript>
      </main>
    </Layout>
  );
}
