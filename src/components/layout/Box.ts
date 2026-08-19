import styled from '@emotion/styled';
import type { SpaceKey } from '@/app/theme';

interface BoxProps {
  $p?: SpaceKey;
  $px?: SpaceKey;
  $py?: SpaceKey;
  $pt?: SpaceKey;
  $pb?: SpaceKey;
  $m?: SpaceKey;
  $mx?: SpaceKey;
  $my?: SpaceKey;
  $bg?: string;
  $width?: string;
  $height?: string;
  $borderRadius?: string;
}

export const Box = styled.div<BoxProps>`
  ${({ $p, theme }) => $p != null && `padding: ${theme.space[$p]};`}
  ${({ $px, theme }) => $px != null && `padding-left: ${theme.space[$px]}; padding-right: ${theme.space[$px]};`}
  ${({ $py, theme }) => $py != null && `padding-top: ${theme.space[$py]}; padding-bottom: ${theme.space[$py]};`}
  ${({ $pt, theme }) => $pt != null && `padding-top: ${theme.space[$pt]};`}
  ${({ $pb, theme }) => $pb != null && `padding-bottom: ${theme.space[$pb]};`}
  ${({ $m, theme }) => $m != null && `margin: ${theme.space[$m]};`}
  ${({ $mx, theme }) => $mx != null && `margin-left: ${theme.space[$mx]}; margin-right: ${theme.space[$mx]};`}
  ${({ $my, theme }) => $my != null && `margin-top: ${theme.space[$my]}; margin-bottom: ${theme.space[$my]};`}
  ${({ $bg }) => $bg && `background: ${$bg};`}
  ${({ $width }) => $width && `width: ${$width};`}
  ${({ $height }) => $height && `height: ${$height};`}
  ${({ $borderRadius }) => $borderRadius && `border-radius: ${$borderRadius};`}
`;
