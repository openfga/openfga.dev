import React from 'react';
import sanitizeHtml from 'sanitize-html';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Admonition from '@theme/Admonition';

export function DocumentationNotice(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const notice = siteConfig.customFields.notice as string;

  return notice ? (
    <Admonition type="note">
      <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(notice) }} />
    </Admonition>
  ) : (
    <></>
  );
}
