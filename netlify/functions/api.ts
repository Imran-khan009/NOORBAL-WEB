import serverless from 'serverless-http';
import { app } from '../../serverApp';

export const handler = serverless(app);
