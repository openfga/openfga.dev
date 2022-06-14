import React from 'react';
import Translate, { translate } from '@docusaurus/Translate';
import { PageMetadata } from '@docusaurus/theme-common';
import Layout from '@theme/Layout';
import clsx from 'clsx';

import { HeroPattern } from '@features/LandingPage/HeroHeader/HeroPattern';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <>
      <PageMetadata
        title={translate({
          id: 'theme.NotFound.title',
          message: 'Page Not Found',
        })}
      />
      <Layout>
        <main className="container margin-vert--xl">
          <div className="row">
            <div className={clsx('col col--8 ' + styles.centerColumn)}>
              <h1 className="hero__title">
                <Translate id="theme.NotFound.title" description="The title of the 404 page">
                  404: Page Not Found
                </Translate>
              </h1>
              <p>
                If you navigated here from a broken link on the OpenFGA website, please{' '}
                <a href="https://github.com/openfga/openfga.dev/issues" target="_blank" rel="noreferrer">
                  open an issue on Github
                </a>
                .
              </p>
              <p>
                Otherwise, try navigating to the <a href="https://openfga.dev">home page</a>, and then finding or
                searching for the content you need from there.
              </p>
            </div>
            <div className={clsx('col col--4 ' + styles.hideOnMobile)}>
              <HeroPattern width="100%" height="100%" />
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
}
