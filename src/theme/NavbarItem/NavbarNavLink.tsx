import React, { useState, useEffect } from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import isInternalUrl from '@docusaurus/isInternalUrl';
import { isRegexpStringMatch } from '@docusaurus/theme-common';
import IconExternalLink from '@theme/Icon/ExternalLink';
import type { Props } from '@theme/NavbarItem/NavbarNavLink';

const GITHUB_STARS_SESSION_STORAGE_NAME = 'openfga_github_stars';

interface GithubStarsSessionStorage {
  count: number;
  retrievedTime: number;
}

export default function NavbarNavLink({
  activeBasePath,
  activeBaseRegex,
  to,
  href,
  label,
  html,
  isDropdownLink,
  prependBaseUrlToHref,
  ...props
}: Props): JSX.Element {
  // TODO all this seems hacky
  // {to: 'version'} should probably be forbidden, in favor of {to: '/version'}
  const toUrl = useBaseUrl(to);
  const activeBaseUrl = useBaseUrl(activeBasePath);
  const normalizedHref = useBaseUrl(href, { forcePrependBaseUrl: true });
  const isExternalLink = label && href && !isInternalUrl(href);

  const [githubStars, setGithubStars] = useState<GithubStarsSessionStorage>(null);

  useEffect(() => {
    const getData = async () => {
      const cachedGithubStars = JSON.parse(
        sessionStorage.getItem(GITHUB_STARS_SESSION_STORAGE_NAME),
      ) as unknown as GithubStarsSessionStorage;
      try {
        if (cachedGithubStars) {
          const cacheExpiryTime = new Date(cachedGithubStars.retrievedTime);
          cacheExpiryTime.setDate(cacheExpiryTime.getDate() + 1);
          if (cacheExpiryTime.getTime() > Date.now()) {
            setGithubStars({
              count: cachedGithubStars.count,
              retrievedTime: Date.now(),
            });
            return;
          }
        }

        // cache should have been expired.  Let's fetch more recent data
        const response = await fetch(`https://api.github.com/repos/openfga/openfga`);
        if (!response.ok) {
          throw new Error(`This is an HTTP error: The status is ${response.status}`);
        }
        const actualData = await response.json();
        const newCachedGithubStars: GithubStarsSessionStorage = {
          count: actualData.stargazers_count,
          retrievedTime: Date.now(),
        };
        setGithubStars(newCachedGithubStars);
        sessionStorage.setItem(GITHUB_STARS_SESSION_STORAGE_NAME, JSON.stringify(newCachedGithubStars));
      } catch (err) {
        // try to use old cache if available (even if it is out of date)
        setGithubStars(cachedGithubStars || null);
      }
    };

    if (!githubStars) {
      getData();
    }
  }, []);

  const newLabel = label === 'GitHub' && githubStars ? `GitHub | ${githubStars.count}` : label;

  // Link content is set through html XOR label
  const linkContentProps = html
    ? { dangerouslySetInnerHTML: { __html: html } }
    : {
        children: (
          <>
            {newLabel}
            {isExternalLink && <IconExternalLink {...(isDropdownLink && { width: 12, height: 12 })} />}
          </>
        ),
      };

  if (href) {
    return <Link href={prependBaseUrlToHref ? normalizedHref : href} {...props} {...linkContentProps} />;
  }

  return (
    <Link
      to={toUrl}
      isNavLink
      {...((activeBasePath || activeBaseRegex) && {
        isActive: (_match, location) =>
          activeBaseRegex
            ? isRegexpStringMatch(activeBaseRegex, location.pathname)
            : location.pathname.startsWith(activeBaseUrl),
      })}
      {...props}
      {...linkContentProps}
    />
  );
}
