export type CandidateFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  workExperience: string;
  cv: File | null;
};

export type CreateCandidateResponse = {
  candidate: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  message: string;
};
