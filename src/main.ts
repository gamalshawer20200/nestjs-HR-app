import 'dotenv/config';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
var cors = require('cors')

const port = process.env.PORT || 8000;

async function bootstrap() {

const app = await NestFactory.create(AppModule);

app.use(cors({
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200,
  credentials: true
}));

  await app.listen(port);
  Logger.log(`Server running on http://localhost:${port}`,'Bootstrap')
}
bootstrap();
