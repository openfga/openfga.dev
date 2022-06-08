import React from 'react';
import { CardBox, CardBoxProps } from '../CardBox';
import { ColumnLayout } from '../Column';

export type CardGridLink = string | { to: string; label: string }[];

export type CardGridBox = Omit<CardBoxProps, 'appearance' | 'links'> & {
  to: CardGridLink;
};

export interface CardGridProps {
  top?: CardGridBox[];
  middle?: CardGridBox[];
  bottom?: CardGridBox[];
}

function getLinks(to: CardGridLink) {
  if (typeof to === 'string') {
    return [
      {
        label: 'Click to navigate',
        to,
      },
    ];
  }

  return to.map(({ to, label }) => ({
    label: label,
    to: to,
  }));
}

export function CardGrid({ top, middle, bottom }: CardGridProps) {
  const topCards = top?.map((card, i) => (
    <CardBox
      {...card}
      appearance={i % 2 === 0 ? 'gradient' : 'filled'}
      links={getLinks(card.to)}
      key={`card-grid-overview-top-${i}`}
    />
  ));
  const middleCards = middle?.map((card, i) => (
    <CardBox {...card} links={getLinks(card.to)} key={`card-grid-overview-middle-${i}`} />
  ));
  const bottomCards = bottom?.map((card, i) => (
    <CardBox {...card} links={getLinks(card.to)} key={`card-grid-overview-bottom-${i}`} />
  ));

  return (
    <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      {topCards && (
        <ColumnLayout cols={2} style={{ marginTop: '2rem' }}>
          {topCards}
        </ColumnLayout>
      )}
      {middleCards && (
        <ColumnLayout cols={3} style={{ marginTop: '2rem' }}>
          {middleCards}
        </ColumnLayout>
      )}
      {middle && bottom && (
        <div
          style={{
            marginTop: '2rem',
            border: '1px solid #DADFE8',
          }}
        />
      )}
      {bottomCards && (
        <ColumnLayout cols={2} style={{ marginTop: '2rem' }}>
          {bottomCards}
        </ColumnLayout>
      )}
    </div>
  );
}
