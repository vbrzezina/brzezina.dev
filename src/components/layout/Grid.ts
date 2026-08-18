import styled from '@emotion/styled';
import type { SpaceKey } from '@/app/theme';

interface GridProps {
  $columns?: number | string;
  $rows?: number | string;
  $gap?: SpaceKey;
  $columnGap?: SpaceKey;
  $rowGap?: SpaceKey;
}

export const Grid = styled.div<GridProps>`
  display: grid;
  grid-template-columns: ${({ $columns }) => {
    if (typeof $columns === 'number') return `repeat(${$columns}, 1fr)`;
    return $columns ?? '1fr';
  }};
  ${({ $rows }) =>
    $rows &&
    `grid-template-rows: ${typeof $rows === 'number' ? `repeat(${$rows}, 1fr)` : $rows};`}
  ${({ $gap, theme }) => $gap != null && `gap: ${theme.space[$gap]};`}
  ${({ $columnGap, theme }) => $columnGap != null && `column-gap: ${theme.space[$columnGap]};`}
  ${({ $rowGap, theme }) => $rowGap != null && `row-row: ${theme.space[$rowGap]};`}
`;
