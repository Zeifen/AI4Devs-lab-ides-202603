import { Request, Response, NextFunction } from 'express';
import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import { HttpError } from './errors';
import candidateRoutes from './routes/candidates';
import prisma from './prisma';

dotenv.config();

export const app = express();
export default prisma;

const port = 3010;
const allowedOrigins = new Set([
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_ORIGIN,
].filter(Boolean));

app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.header('origin');

  if (origin && allowedOrigins.has(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Vary', 'Origin');
  }

  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }

  next();
});
app.use(express.json());
app.use('/api/candidates', candidateRoutes);

app.get('/', (req, res) => {
  res.send('Hola LTI!');
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
    });
    return;
  }

  if (err instanceof multer.MulterError) {
    const isFileSizeError = err.code === 'LIMIT_FILE_SIZE';

    res.status(400).json({
      code: isFileSizeError ? 'CV_FILE_TOO_LARGE' : 'UPLOAD_ERROR',
      message: isFileSizeError ? 'CV file exceeds the maximum size of 5 MB' : 'Invalid file upload',
    });
    return;
  }

  if (err instanceof Error && err.message === 'INVALID_CV_FILE_TYPE') {
    res.status(400).json({
      code: 'INVALID_CV_FILE_TYPE',
      message: 'CV file must be a PDF, DOC, or DOCX document',
    });
    return;
  }

  console.error(err instanceof Error ? err.message : err);
  res.status(500).json({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Something broke!',
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}
