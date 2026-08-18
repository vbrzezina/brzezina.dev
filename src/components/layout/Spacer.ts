import styled from '@emotion/styled';
import type { SpaceKey } from '@/app/theme';

interface SpacerProps {
  $size?: SpaceKey;
}

export const Spacer = styled.div<SpacerProps>`
  flex-shrink: 0;
  width: ${({ $size, theme }) => theme.space[$size ?? 4]};
  height: ${({ $size, theme }) => theme.space[$size ?? 4]};
`;
