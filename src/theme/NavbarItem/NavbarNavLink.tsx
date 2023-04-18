import React, { useState, useEffect } from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import isInternalUrl from '@docusaurus/isInternalUrl';
import { isRegexpStringMatch } from '@docusaurus/theme-common';
import IconExternalLink from '@theme/Icon/ExternalLink';
import type { Props } from '@theme/NavbarItem/NavbarNavLink';

const github_stars = 'openfga_github_stars';

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

  const [data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const cached_github_stars = sessionStorage.getItem(github_stars);
        if (cached_github_stars) {
          setData(cached_github_stars);
          return;
        }

        const response = await fetch(`https://api.github.com/repos/openfga/openfga`);
        if (!response.ok) {
          throw new Error(`This is an HTTP error: The status is ${response.status}`);
        }
        const actualData = await response.json();
        setData(actualData.stargazers_count);
        sessionStorage.setItem(cached_github_stars, actualData.stargazers_count);
      } catch (err) {
        setData(null);
      }
    };
    if (!data) {
      getData();
    }
  }, []);

  const newLabel = label === 'GitHub' && data ? `GitHub | ${data}` : label;

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
