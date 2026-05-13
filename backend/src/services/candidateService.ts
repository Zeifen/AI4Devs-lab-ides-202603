import { Prisma } from '@prisma/client';
import { HttpError } from '../errors';
import prisma from '../prisma';
import { CandidateInput } from '../validators/candidateValidator';

type CandidateCvFile = Pick<Express.Multer.File, 'originalname' | 'mimetype' | 'size'>;

export async function createCandidate(input: CandidateInput, cvFile?: CandidateCvFile) {
  try {
    return await prisma.candidate.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        address: input.address,
        education: input.education,
        workExperience: input.workExperience,
        cvFileName: cvFile?.originalname,
        cvMimeType: cvFile?.mimetype,
        cvSizeBytes: cvFile?.size,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new HttpError(409, 'A candidate with this email already exists', 'CANDIDATE_EMAIL_EXISTS');
    }

    throw error;
  }
}
