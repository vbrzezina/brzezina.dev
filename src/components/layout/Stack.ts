import styled from '@emotion/styled';
import type { CSSProperties } from 'react';
import type { SpaceKey } from '@/app/theme';

interface StackProps {
  $direction?: 'row' | 'column';
  $gap?: SpaceKey;
  $align?: CSSProperties['alignItems'];
  $justify?: CSSProperties['justifyContent'];
  $wrap?: boolean;
}

export const Stack = styled.div<StackProps>`
  display: flex;
  flex-direction: ${({ $direction }) => $direction ?? 'column'};
  gap: ${({ $gap, theme }) => theme.space[$gap ?? 4]};
  ${({ $align }) => $align && `align-items: ${$align};`}
  ${({ $justify }) => $justify && `justify-content: ${$justify};`}
  ${({ $wrap }) => $wrap && `flex-wrap: wrap;`}
`;
