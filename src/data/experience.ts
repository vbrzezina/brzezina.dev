/** Work history. Roles and descriptions are looked up by id in messages `experience.*`. */

export interface Project {
  id: string;
  client: string;
  stack: readonly string[];
  /** The project being worked on now — marked with a "Current" tag. */
  current?: boolean;
}

export interface Employer {
  id: string;
  company: string;
  start: number;
  /** `null` = current role. */
  end: number | null;
  projects: readonly Project[];
}

export const EXPERIENCE: readonly Employer[] = [
  {
    id: 'epam',
    company: 'EPAM Systems',
    start: 2022,
    end: null,
    projects: [
      // Current project. No description yet — add `projects.sap.description` to the messages files when it can be shared.
      { id: 'sap', client: 'SAP', stack: ['TypeScript', 'NestJS', 'Neo4j'], current: true },
      { id: 'burberry', client: 'Burberry', stack: ['TypeScript', 'React', 'MobX', 'NestJS', 'Express', 'AWS'] },
      { id: 'walmart', client: 'Walmart', stack: ['React', 'TypeScript', 'Redux', 'SWR', 'Ant Design', 'Cypress'] },
    ],
  },
  {
    id: 'starkys',
    company: 'Starky’s Club',
    start: 2019,
    end: 2022,
    projects: [
      { id: 'carvago', client: 'Carvago / Omnetic DMS', stack: ['React', 'TypeScript', 'Redux', 'Next.js'] },
      { id: 'pgm', client: '3G Project Guide Manager', stack: ['React', 'TypeScript', 'NestJS', 'Postgres', 'TypeORM', 'AWS'] },
      { id: 'inventi', client: 'Inventi / Summit Media', stack: ['React', 'TypeScript', 'Redux', 'Next.js'] },
    ],
  },
  {
    id: 'etnetera',
    company: 'Etnetera a.s.',
    start: 2017,
    end: 2019,
    projects: [
      { id: 'logio', client: 'Logio', stack: ['React', 'Node.js', 'Koa.js', 'TypeScript', 'MobX'] },
      { id: 'veolia', client: 'Veolia', stack: ['React', 'Redux', 'Sass', 'TypeScript'] },
    ],
  },
];
