/**
 * Skill groups. Category labels live in messages `about.skills.categories`.
 * Items are proper nouns (rendered as-is) or `{ key }` references to `about.skills.items.*`
 * for anything that needs translating.
 */

export type SkillItem = string | { key: string };

export interface SkillGroup {
  id: 'frontend' | 'backend' | 'cloud' | 'databases' | 'practices' | 'genai';
  items: readonly SkillItem[];
}

export const SKILL_GROUPS: readonly SkillGroup[] = [
  {
    id: 'frontend',
    items: ['React', 'Next.js', 'Emotion', 'MUI', 'Redux', 'RTK Query', 'React Hook Form', 'React Query', 'GraphQL', 'Jest', 'Cypress'],
  },
  {
    id: 'backend',
    items: ['Node.js', 'NestJS', 'Express.js', 'REST', 'GraphQL', 'Apollo Server', 'TypeORM', 'Strapi', 'Elasticsearch'],
  },
  {
    id: 'cloud',
    items: ['AWS Lambda', 'Step Functions', 'API Gateway', 'EC2', 'EBS', 'S3', 'SQS', 'SNS', 'Cognito', 'CDK', 'Docker'],
  },
  { id: 'databases', items: ['PostgreSQL', 'MySQL', 'DynamoDB', 'Cassandra / AstraDB', 'Redis'] },
  {
    id: 'practices',
    items: [{ key: 'ciCd' }, { key: 'codeReview' }, { key: 'codeStandards' }, { key: 'accessibility' }],
  },
  { id: 'genai', items: ['Claude', 'Claude Code', { key: 'promptEngineering' }] },
];

export const LANGUAGE_IDS = ['en', 'cs'] as const;

/**
 * The About diagram: one row per layer, two nodes each. The first column is the request path
 * the pulse travels down. Node names are proper nouns; layer labels live in `about.diagram.layers`.
 */
export const ARCHITECTURE_LAYERS = [
  { id: 'client', nodes: ['React', 'Next.js'] },
  { id: 'api', nodes: ['NestJS', 'GraphQL'] },
  { id: 'serverless', nodes: ['Lambda', 'SQS'] },
  { id: 'data', nodes: ['PostgreSQL', 'DynamoDB'] },
] as const;
