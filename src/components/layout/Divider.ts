import styled from '@emotion/styled';

interface DividerProps {
  $orientation?: 'horizontal' | 'vertical';
}

export const Divider = styled.div<DividerProps>`
  ${({ $orientation }) =>
    $orientation === 'vertical'
      ? `width: 1px; height: 100%;`
      : `width: 100%; height: 1px;`}
  background: var(--border);
  flex-shrink: 0;
`;
