import { HttpError } from '../errors';

export type CandidateInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  education: string;
  workExperience: string;
};

const requiredFields: Array<keyof CandidateInput> = [
  'firstName',
  'lastName',
  'email',
  'education',
  'workExperience',
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readField(body: Record<string, unknown>, field: keyof CandidateInput): string {
  const value = body[field];

  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
}

export function validateCandidateInput(body: Record<string, unknown>): CandidateInput {
  const candidate: CandidateInput = {
    firstName: readField(body, 'firstName'),
    lastName: readField(body, 'lastName'),
    email: readField(body, 'email').toLowerCase(),
    phone: readField(body, 'phone') || undefined,
    address: readField(body, 'address') || undefined,
    education: readField(body, 'education'),
    workExperience: readField(body, 'workExperience'),
  };

  const missingFields = requiredFields.filter((field) => !candidate[field]);

  if (missingFields.length > 0) {
    throw new HttpError(400, `Missing required fields: ${missingFields.join(', ')}`, 'VALIDATION_ERROR');
  }

  if (!emailPattern.test(candidate.email)) {
    throw new HttpError(400, 'Email must have a valid format', 'VALIDATION_ERROR');
  }

  return candidate;
}
