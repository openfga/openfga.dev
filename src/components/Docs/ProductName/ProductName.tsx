import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export enum ProductNameFormat {
  ShortForm = 'shortForm',
  LongForm = 'longForm',
  ProductLink = 'productLink',
}

interface ProductNameOpts {
  format: ProductNameFormat;
}

// ProductName replaces the ProductName with the config's custom field value
export function ProductName(opts: ProductNameOpts): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const productLink = (siteConfig.baseUrl + siteConfig.customFields.productDescriptionLink) as string as string;
  switch (opts.format) {
    case ProductNameFormat.ProductLink:
      return <a href={productLink}>{siteConfig.customFields.productName as string}</a>;
    case ProductNameFormat.LongForm:
      return <>{siteConfig.customFields.longProductName}</>;
    case ProductNameFormat.ShortForm:
      return <>{siteConfig.customFields.productName}</>;
    default:
      return <>{siteConfig.customFields.productName}</>;
  }
}

interface ProductLinkOpts {
  name: string;
  link: string;
}

// UpdateProductNameInLinks returns the link where the text is replaced with the configured product name
export function UpdateProductNameInLinks(props: ProductLinkOpts): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const name = props.name.replace('{ProductName}', siteConfig.customFields.productName as string);
  const linkText = props.link.replace('{ProductConcept}', siteConfig.customFields.conceptLink as string);
  return <a href={linkText}>{name}</a>;
}

interface ProductConceptOpts {
  section: string;
  linkName: string;
}

// ProductConcept returns the appropriate link for the concept page
export function ProductConcept(props: ProductConceptOpts): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const staticLink = (siteConfig.baseUrl + siteConfig.customFields.conceptLink) as string;
  const link = !props.section ? staticLink : staticLink + '#' + props.section;
  const linkName = !props.linkName ? siteConfig.customFields.productName + ' Concepts' : props.linkName;
  return <a href={link}>{linkName}</a>;
}

// IntroductionSection returns the appropriate link for the introduction page
export function IntroductionSection(props: ProductConceptOpts): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const staticLink = (siteConfig.baseUrl + siteConfig.customFields.introLink) as string;
  const link = !props.section ? staticLink : staticLink + '#' + props.section;
  const linkName = props.linkName;
  return <a href={link}>{linkName}</a>;
}
