import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as functions from 'firebase-functions';

import { AppModule } from './src/app.module';
import { credential, initializeApp } from 'firebase-admin';
import { ValidationPipe } from '@nestjs/common';

const expressServer = express();

initializeApp({
  credential: credential.cert(functions.config().my_firebase_config),
  databaseURL: 'https://nestjs-20698-default-rtdb.firebaseio.com',
});

const createFunction = async (expressInstance): Promise<void> => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await app.init();
};

export const api = functions.https.onRequest(async (request, response) => {
  await createFunction(expressServer);
  expressServer(request, response);
});
