import { CandidateFormValues, CreateCandidateResponse } from '../types/candidate';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3010';

export async function createCandidate(values: CandidateFormValues): Promise<CreateCandidateResponse> {
  const formData = new FormData();

  formData.append('firstName', values.firstName.trim());
  formData.append('lastName', values.lastName.trim());
  formData.append('email', values.email.trim().toLowerCase());
  formData.append('education', values.education.trim());
  formData.append('workExperience', values.workExperience.trim());

  if (values.phone.trim()) {
    formData.append('phone', values.phone.trim());
  }

  if (values.address.trim()) {
    formData.append('address', values.address.trim());
  }

  if (values.cv) {
    formData.append('cv', values.cv);
  }

  const response = await fetch(`${API_BASE_URL}/api/candidates`, {
    method: 'POST',
    body: formData,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || 'No se pudo anadir el candidato. Intenta de nuevo.');
  }

  return payload as CreateCandidateResponse;
}
