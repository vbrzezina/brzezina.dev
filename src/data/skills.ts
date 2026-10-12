/**
 * Skill groups. Category labels live in messages `about.skills.categories`.
 * Groups with `translate: true` hold message keys (`about.skills.items.*`) instead of proper nouns.
 */

export interface SkillGroup {
  id: 'frontend' | 'backend' | 'cloud' | 'databases' | 'practices' | 'genai';
  items: readonly string[];
  translate?: boolean;
}

export const SKILL_GROUPS: readonly SkillGroup[] = [
  {
    id: 'frontend',
    items: ['TypeScript', 'React', 'Next.js', 'Emotion', 'MUI', 'Redux', 'RTK Query', 'React Hook Form', 'React Query', 'GraphQL', 'Jest', 'Cypress'],
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
  { id: 'practices', items: ['ciCd', 'codeReview', 'codeStandards', 'accessibility'], translate: true },
  { id: 'genai', items: ['Claude', 'Claude Code', 'Prompt engineering'] },
];

export const LANGUAGE_IDS = ['en', 'cs', 'sk'] as const;
