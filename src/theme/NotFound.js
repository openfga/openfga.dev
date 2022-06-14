import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';

import Translate, { translate } from '@docusaurus/Translate';
import { PageMetadata } from '@docusaurus/theme-common';

import Layout from '@theme/Layout';

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
                <Link href="https://github.com/openfga/openfga.dev/issues" target="_blank">
                  open an issue on Github
                </Link>
                .
              </p>
              <p>
                Otherwise, try navigating to the <Link href="https://openfga.dev">home page</Link>, and then finding or
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
