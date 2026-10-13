"use client";

import { useId } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { useTranslations } from "next-intl";
import { ARCHITECTURE_LAYERS } from "@/data/skills";

/*
 * Blueprint-style system diagram for the About section — the bio's lede ("frontend → backend →
 * cloud") drawn as layers. Geometry lives in a 400 × 500 viewBox (the slot's 4:5 ratio), so it
 * scales as one piece. Colours come from tokens, so both themes work without extra rules.
 */

const W = 400;
const H = 500;
const NODE_W = 100;
const NODE_H = 36;
const COLS = [200, 320]; // node centres; the first column is the request path
const ROW_Y = [80, 185, 290, 395];
const LABEL_X = 32;
const half = NODE_H / 2;

// The request enters from the top edge and runs down the first column to the data layer.
const SPINE_TOP = 24;
const SPINE_BOTTOM = ROW_Y[ROW_Y.length - 1] + half;

const travel = keyframes`
  from { stroke-dashoffset: 0; }
  to { stroke-dashoffset: -100; }
`;

const Figure = styled.figure`
  position: relative;
  aspect-ratio: 4 / 5;
  max-width: 28rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  overflow: hidden;

  svg {
    display: block;
    width: 100%;
    height: 100%;
    font-family: ${({ theme }) => theme.fonts.mono};
  }

  .grid {
    stroke: ${({ theme }) => theme.colors.grid};
  }
  .separator {
    stroke: ${({ theme }) => theme.colors.border};
    stroke-dasharray: 2 4;
  }
  .layer {
    fill: ${({ theme }) => theme.colors.fgTertiary};
    font-size: 10.5px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }
  .edge {
    stroke: ${({ theme }) => theme.colors.borderStrong};
  }
  .edge-path {
    stroke: ${({ theme }) => theme.colors.accent};
    stroke-opacity: 0.45;
  }
  .node rect {
    fill: ${({ theme }) => theme.colors.canvas};
    stroke: ${({ theme }) => theme.colors.borderStrong};
  }
  .node text {
    fill: ${({ theme }) => theme.colors.fgSecondary};
    font-size: 13px;
  }
  .node-path rect {
    stroke: ${({ theme }) => theme.colors.accent};
  }
  .node-path text {
    fill: ${({ theme }) => theme.colors.fg};
  }
  .entry {
    fill: ${({ theme }) => theme.colors.accent};
  }
  .pulse {
    stroke: ${({ theme }) => theme.colors.accent};
    stroke-width: 2;
    stroke-linecap: round;
    stroke-dasharray: 6 94;
    /* A few passes to show the request path, then it rests — nothing here should move forever (WCAG 2.2.2). */
    animation: ${travel} 3.2s linear 3;
  }
  .caption {
    fill: ${({ theme }) => theme.colors.fgTertiary};
    font-size: 11px;
  }

  ${({ theme }) => theme.mq.reducedMotion} {
    .pulse {
      display: none;
    }
  }
`;

export function AboutDiagram({ className }: { className?: string }) {
  const t = useTranslations("about.diagram");
  const uid = useId();
  const titleId = `${uid}-title`;
  const gridId = `${uid}-grid`;

  const separators = ROW_Y.slice(1).map((y, i) => Math.round((ROW_Y[i] + y) / 2));

  return (
    <Figure className={className}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby={titleId}>
        <title id={titleId}>{t("title")}</title>

        <defs>
          <pattern id={gridId} width="20" height="20" patternUnits="userSpaceOnUse">
            <path className="grid" d="M20 0H0V20" fill="none" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill={`url(#${gridId})`} />

        {separators.map((y) => (
          <line key={y} className="separator" x1={LABEL_X} x2={W - LABEL_X} y1={y} y2={y} />
        ))}

        {/* Edges first, so the nodes sit on top of them. */}
        <g fill="none" strokeWidth="1">
          {ROW_Y.slice(0, -1).map((y, i) => (
            <g key={y}>
              <line className="edge-path" x1={COLS[0]} x2={COLS[0]} y1={y + half} y2={ROW_Y[i + 1] - half} />
              <line className="edge" x1={COLS[1]} x2={COLS[1]} y1={y + half} y2={ROW_Y[i + 1] - half} />
            </g>
          ))}
          {ROW_Y.map((y) => (
            <line key={y} className="edge" x1={COLS[0] + NODE_W / 2} x2={COLS[1] - NODE_W / 2} y1={y} y2={y} />
          ))}
          <line className="edge-path" x1={COLS[0]} x2={COLS[0]} y1={SPINE_TOP} y2={ROW_Y[0] - half} />
          <path className="pulse" d={`M${COLS[0]} ${SPINE_TOP}V${SPINE_BOTTOM}`} pathLength={100} />
        </g>
        <circle className="entry" cx={COLS[0]} cy={SPINE_TOP} r="3" />

        {ARCHITECTURE_LAYERS.map((layer, row) => (
          <g key={layer.id}>
            <text className="layer" x={LABEL_X} y={ROW_Y[row]} dominantBaseline="central">
              {t(`layers.${layer.id}`)}
            </text>
            {layer.nodes.map((name, col) => (
              <g key={name} className={col === 0 ? "node node-path" : "node"}>
                <rect
                  x={COLS[col] - NODE_W / 2}
                  y={ROW_Y[row] - half}
                  width={NODE_W}
                  height={NODE_H}
                  rx="4"
                  strokeWidth="1"
                />
                <text x={COLS[col]} y={ROW_Y[row]} textAnchor="middle" dominantBaseline="central">
                  {name}
                </text>
              </g>
            ))}
          </g>
        ))}

        <text className="caption" x={LABEL_X} y={H - 32}>
          {t("caption")}
        </text>
      </svg>
    </Figure>
  );
}
