import styled from '@emotion/styled';
import type { SpaceKey } from '@/app/theme';

interface ContainerProps {
  $maxWidth?: string;
  $px?: SpaceKey;
}

export const Container = styled.div<ContainerProps>`
  max-width: ${({ $maxWidth }) => $maxWidth ?? '80rem'};
  margin: 0 auto;
  padding: 0 ${({ $px, theme }) => theme.space[$px ?? 6]};
  width: 100%;
`;
