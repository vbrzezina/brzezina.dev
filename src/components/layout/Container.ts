import styled from '@emotion/styled';

interface ContainerProps {
  $maxWidth?: string;
}

export const Container = styled.div<ContainerProps>`
  width: 100%;
  max-width: calc(${({ $maxWidth, theme }) => $maxWidth ?? theme.layout.maxWidth} + 2 * ${({ theme }) => theme.layout.gutter});
  margin-inline: auto;
  padding-inline: ${({ theme }) => theme.layout.gutter};
`;
