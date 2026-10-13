'use client';

import styled from '@emotion/styled';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/layout';
import { hasLegalIdentity, legal, site } from '@/data/site';
import { type } from '@/styles/typography';

const SECTIONS = ['contact', 'hosting', 'analytics', 'transfers', 'rights', 'changes'] as const;

const Article = styled.article`
  padding-block: clamp(3rem, 2rem + 3vw, 5rem) ${({ theme }) => theme.layout.sectionPadding};
`;

const Inner = styled.div`
  max-width: 44rem;
`;

const Eyebrow = styled.p`
  ${type.monoEyebrow}
  color: ${({ theme }) => theme.colors.fgSecondary};
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &::before {
    content: '';
    width: 2rem;
    height: 1px;
    background: ${({ theme }) => theme.colors.accent};
  }
`;

const Title = styled.h1`
  ${type.displayL}
  color: ${({ theme }) => theme.colors.fg};
  margin-top: 1rem;
`;

const Updated = styled.p`
  ${type.monoS}
  color: ${({ theme }) => theme.colors.fgTertiary};
  margin-top: 1rem;
`;

const Intro = styled.p`
  ${type.bodyL}
  color: ${({ theme }) => theme.colors.fgSecondary};
  margin-top: 1.5rem;
`;

const Block = styled.section`
  margin-top: 3rem;

  & > * + * {
    margin-top: 0.875rem;
  }
`;

const Heading = styled.h2`
  ${type.titleL}
  color: ${({ theme }) => theme.colors.fg};
`;

const Paragraph = styled.p`
  ${type.bodyM}
  color: ${({ theme }) => theme.colors.fgSecondary};

  a {
    color: ${({ theme }) => theme.colors.accent};
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }
`;

const TableWrap = styled.div`
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const Table = styled.table`
  width: 100%;
  min-width: 36rem;
  border-collapse: collapse;
  ${type.bodyS}

  th,
  td {
    padding: 0.75rem 1rem;
    text-align: left;
    vertical-align: top;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
  tr:last-of-type td {
    border-bottom: none;
  }
  th {
    ${type.monoEyebrow}
    color: ${({ theme }) => theme.colors.fgTertiary};
    background: ${({ theme }) => theme.colors.surface};
  }
  td {
    color: ${({ theme }) => theme.colors.fgSecondary};
  }
  td:first-of-type {
    ${type.monoS}
    color: ${({ theme }) => theme.colors.fg};
    white-space: nowrap;
  }
`;

export function PrivacyPolicy() {
  const t = useTranslations('privacy');
  const email = site.contactEmail;
  const columns = t.raw('storage.columns') as string[];
  const rows = t.raw('storage.rows') as string[][];

  return (
    <Article id="top" aria-labelledby="privacy-title">
      <Container>
        <Inner>
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <Title id="privacy-title">{t('title')}</Title>
          <Updated>{t('updated')}</Updated>
          <Intro>{t('intro')}</Intro>

          <Block aria-labelledby="privacy-controller">
            <Heading id="privacy-controller">{t('controller.heading')}</Heading>
            <Paragraph>
              {t('controller.body', { name: legal.name })}{' '}
              {hasLegalIdentity && t('controller.identity', { ico: legal.ico, address: legal.address })}
            </Paragraph>
            <Paragraph>
              {t.rich('controller.contact', {
                email,
                mail: (chunks) => <a href={`mailto:${email}`}>{chunks}</a>,
              })}
            </Paragraph>
          </Block>

          {SECTIONS.slice(0, 3).map((id) => (
            <Block key={id} aria-labelledby={`privacy-${id}`}>
              <Heading id={`privacy-${id}`}>{t(`${id}.heading`)}</Heading>
              {(t.raw(`${id}.paragraphs`) as string[]).map((p) => (
                <Paragraph key={p}>{p.replace('{email}', email)}</Paragraph>
              ))}
            </Block>
          ))}

          <Block aria-labelledby="privacy-storage">
            <Heading id="privacy-storage">{t('storage.heading')}</Heading>
            <TableWrap>
              <Table>
                <thead>
                  <tr>
                    {columns.map((c) => (
                      <th key={c} scope="col">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row[0]}>
                      {row.map((cell, i) => (
                        <td key={i}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrap>
            <Paragraph>{t('storage.note')}</Paragraph>
          </Block>

          {SECTIONS.slice(3).map((id) => (
            <Block key={id} aria-labelledby={`privacy-${id}`}>
              <Heading id={`privacy-${id}`}>{t(`${id}.heading`)}</Heading>
              {(t.raw(`${id}.paragraphs`) as string[]).map((p) => (
                <Paragraph key={p}>{p.replace('{email}', email)}</Paragraph>
              ))}
            </Block>
          ))}
        </Inner>
      </Container>
    </Article>
  );
}
