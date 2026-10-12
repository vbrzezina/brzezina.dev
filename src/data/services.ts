/** Service offerings. Titles and descriptions live in messages `services.items.*`. */

export const SERVICES = [
  { id: 'fullstack', stack: ['Next.js', 'React', 'TypeScript', 'Emotion', 'MUI'] },
  { id: 'backend', stack: ['Node.js', 'NestJS', 'GraphQL', 'TypeORM', 'PostgreSQL'] },
  { id: 'serverless', stack: ['Lambda', 'Step Functions', 'API Gateway', 'Cognito', 'CDK'] },
] as const;

export const ENGAGEMENT_FACTS = [
  { id: 'engagement', icon: 'briefcase' },
  { id: 'remote', icon: 'globe' },
  { id: 'languages', icon: 'chat' },
] as const;
