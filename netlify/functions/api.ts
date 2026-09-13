import serverless from 'serverless-http';
import express from 'express';
import { apiRouter } from '../../serverApp';

const netlifyApp = express();
netlifyApp.use(express.json());
netlifyApp.use('/api', apiRouter);
netlifyApp.use('/.netlify/functions/api', apiRouter);
netlifyApp.use('/', apiRouter);

export const handler = serverless(netlifyApp);

