import request from 'supertest';
import { app } from '../index';
import prisma from '../prisma';

const baseCandidate = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  education: 'Mathematics',
  workExperience: 'Analytical engine research',
};

function uniqueEmail(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`;
}

describe('POST /api/candidates', () => {
  const createdEmails: string[] = [];

  afterEach(async () => {
    if (createdEmails.length === 0) {
      return;
    }

    await prisma.candidate.deleteMany({
      where: {
        email: {
          in: createdEmails,
        },
      },
    });

    createdEmails.length = 0;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('creates a candidate without CV', async () => {
    const email = uniqueEmail('candidate');
    createdEmails.push(email);

    const response = await request(app)
      .post('/api/candidates')
      .send({
        ...baseCandidate,
        email,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      candidate: {
        id: expect.any(Number),
        firstName: baseCandidate.firstName,
        lastName: baseCandidate.lastName,
        email,
      },
      message: 'Candidate created successfully',
    });
    expect(response.body.candidate.cvStoragePath).toBeUndefined();
  });

  it('allows requests from the frontend development origin', async () => {
    const email = uniqueEmail('candidate-cors');
    createdEmails.push(email);

    const response = await request(app)
      .post('/api/candidates')
      .set('Origin', 'http://localhost:3001')
      .send({
        ...baseCandidate,
        email,
      });

    expect(response.statusCode).toBe(201);
    expect(response.header['access-control-allow-origin']).toBe('http://localhost:3001');
  });

  it('creates a candidate with a PDF CV', async () => {
    const email = uniqueEmail('candidate-pdf');
    createdEmails.push(email);

    const response = await request(app)
      .post('/api/candidates')
      .field('firstName', baseCandidate.firstName)
      .field('lastName', baseCandidate.lastName)
      .field('email', email)
      .field('education', baseCandidate.education)
      .field('workExperience', baseCandidate.workExperience)
      .attach('cv', Buffer.from('%PDF-1.4 test'), {
        filename: 'ada.pdf',
        contentType: 'application/pdf',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.candidate).toMatchObject({
      id: expect.any(Number),
      firstName: baseCandidate.firstName,
      lastName: baseCandidate.lastName,
      email,
    });
    expect(response.body.candidate.cvStoragePath).toBeUndefined();
  });

  it('rejects an invalid email', async () => {
    const response = await request(app)
      .post('/api/candidates')
      .send({
        ...baseCandidate,
        email: 'not-an-email',
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject({
      code: 'VALIDATION_ERROR',
      message: 'Email must have a valid format',
    });
  });

  it('rejects missing required fields', async () => {
    const response = await request(app)
      .post('/api/candidates')
      .send({
        firstName: '',
        email: uniqueEmail('missing-fields'),
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe('VALIDATION_ERROR');
    expect(response.body.message).toContain('Missing required fields');
  });

  it('rejects unsupported CV file types', async () => {
    const response = await request(app)
      .post('/api/candidates')
      .field('firstName', baseCandidate.firstName)
      .field('lastName', baseCandidate.lastName)
      .field('email', uniqueEmail('invalid-file'))
      .field('education', baseCandidate.education)
      .field('workExperience', baseCandidate.workExperience)
      .attach('cv', Buffer.from('plain text'), {
        filename: 'notes.txt',
        contentType: 'text/plain',
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject({
      code: 'INVALID_CV_FILE_TYPE',
    });
  });

  it('rejects CV files larger than 5 MB', async () => {
    const response = await request(app)
      .post('/api/candidates')
      .field('firstName', baseCandidate.firstName)
      .field('lastName', baseCandidate.lastName)
      .field('email', uniqueEmail('large-file'))
      .field('education', baseCandidate.education)
      .field('workExperience', baseCandidate.workExperience)
      .attach('cv', Buffer.alloc(5 * 1024 * 1024 + 1), {
        filename: 'large.pdf',
        contentType: 'application/pdf',
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject({
      code: 'CV_FILE_TOO_LARGE',
    });
  });

  it('returns conflict when candidate email already exists', async () => {
    const email = uniqueEmail('duplicate');
    createdEmails.push(email);

    await request(app)
      .post('/api/candidates')
      .send({
        ...baseCandidate,
        email,
      })
      .expect(201);

    const response = await request(app)
      .post('/api/candidates')
      .send({
        ...baseCandidate,
        email,
      });

    expect(response.statusCode).toBe(409);
    expect(response.body).toMatchObject({
      code: 'CANDIDATE_EMAIL_EXISTS',
    });
  });
});
