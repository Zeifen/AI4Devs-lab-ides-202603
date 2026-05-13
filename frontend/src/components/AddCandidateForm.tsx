import React, { ChangeEvent, FormEvent, useState } from 'react';
import { createCandidate } from '../api/candidates';
import { CandidateFormValues } from '../types/candidate';
import './AddCandidateForm.css';

const MAX_CV_SIZE_BYTES = 5 * 1024 * 1024;
const allowedCvTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const allowedCvExtensions = ['.pdf', '.doc', '.docx'];

type FormErrors = Partial<Record<keyof CandidateFormValues, string>>;

const initialValues: CandidateFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  education: '',
  workExperience: '',
  cv: null,
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeEmail(email: string) {
  return email.trim().replace(/[\u200B-\u200D\uFEFF]/g, '').toLowerCase();
}

function hasAllowedCvExtension(fileName: string) {
  return allowedCvExtensions.some((extension) => fileName.toLowerCase().endsWith(extension));
}

function validateValues(values: CandidateFormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.firstName.trim()) {
    errors.firstName = 'El nombre es obligatorio.';
  }

  if (!values.lastName.trim()) {
    errors.lastName = 'El apellido es obligatorio.';
  }

  const normalizedEmail = normalizeEmail(values.email);

  if (!normalizedEmail) {
    errors.email = 'El correo electronico es obligatorio.';
  } else if (!isValidEmail(normalizedEmail)) {
    errors.email = 'Ingresa un correo electronico valido.';
  }

  if (!values.education.trim()) {
    errors.education = 'La educacion es obligatoria.';
  }

  if (!values.workExperience.trim()) {
    errors.workExperience = 'La experiencia laboral es obligatoria.';
  }

  if (values.cv) {
    const hasAllowedType = allowedCvTypes.includes(values.cv.type);
    const hasAllowedExtension = hasAllowedCvExtension(values.cv.name);

    if (!hasAllowedType && !hasAllowedExtension) {
      errors.cv = 'El CV debe ser un archivo PDF, DOC o DOCX.';
    } else if (values.cv.size > MAX_CV_SIZE_BYTES) {
      errors.cv = 'El CV no debe superar 5 MB.';
    }
  }

  return errors;
}

function getActiveErrorMessages(errors: FormErrors) {
  return Object.values(errors).filter((message): message is string => Boolean(message));
}

export function AddCandidateForm() {
  const [values, setValues] = useState<CandidateFormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formError, setFormError] = useState('');

  function updateField(field: keyof CandidateFormValues, value: string | File | null) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
    setSuccessMessage('');
    setFormError('');
  }

  function handleTextChange(field: keyof Omit<CandidateFormValues, 'cv'>) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updateField(field, event.target.value);
    };
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    updateField('cv', event.target.files?.[0] || null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateValues(values);
    setErrors(nextErrors);
    const activeErrorMessages = getActiveErrorMessages(nextErrors);

    if (activeErrorMessages.length > 0) {
      setFormError('Revisa los campos marcados antes de enviar.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');
    setSuccessMessage('');

    try {
      const result = await createCandidate(values);
      setSuccessMessage(`Candidato ${result.candidate.firstName} ${result.candidate.lastName} anadido exitosamente.`);
      setValues(initialValues);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'No se pudo anadir el candidato. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="candidate-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <label className="field" htmlFor="firstName">
          <span>Nombre</span>
          <input
            id="firstName"
            name="firstName"
            value={values.firstName}
            onChange={handleTextChange('firstName')}
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={errors.firstName ? 'firstName-error' : undefined}
          />
          {errors.firstName && <span className="field-error" id="firstName-error">{errors.firstName}</span>}
        </label>

        <label className="field" htmlFor="lastName">
          <span>Apellido</span>
          <input
            id="lastName"
            name="lastName"
            value={values.lastName}
            onChange={handleTextChange('lastName')}
            aria-invalid={Boolean(errors.lastName)}
            aria-describedby={errors.lastName ? 'lastName-error' : undefined}
          />
          {errors.lastName && <span className="field-error" id="lastName-error">{errors.lastName}</span>}
        </label>

        <label className="field" htmlFor="email">
          <span>Correo electronico</span>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleTextChange('email')}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && <span className="field-error" id="email-error">{errors.email}</span>}
        </label>

        <label className="field" htmlFor="phone">
          <span>Telefono</span>
          <input id="phone" name="phone" value={values.phone} onChange={handleTextChange('phone')} />
        </label>

        <label className="field field-wide" htmlFor="address">
          <span>Direccion</span>
          <input id="address" name="address" value={values.address} onChange={handleTextChange('address')} />
        </label>

        <label className="field field-wide" htmlFor="education">
          <span>Educacion</span>
          <textarea
            id="education"
            name="education"
            value={values.education}
            onChange={handleTextChange('education')}
            rows={4}
            aria-invalid={Boolean(errors.education)}
            aria-describedby={errors.education ? 'education-error' : undefined}
          />
          {errors.education && <span className="field-error" id="education-error">{errors.education}</span>}
        </label>

        <label className="field field-wide" htmlFor="workExperience">
          <span>Experiencia laboral</span>
          <textarea
            id="workExperience"
            name="workExperience"
            value={values.workExperience}
            onChange={handleTextChange('workExperience')}
            rows={5}
            aria-invalid={Boolean(errors.workExperience)}
            aria-describedby={errors.workExperience ? 'workExperience-error' : undefined}
          />
          {errors.workExperience && (
            <span className="field-error" id="workExperience-error">{errors.workExperience}</span>
          )}
        </label>

        <label className="field field-wide" htmlFor="cv">
          <span>CV</span>
          <input
            id="cv"
            name="cv"
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
            aria-invalid={Boolean(errors.cv)}
            aria-describedby="cv-help cv-error"
          />
          <span className="field-help" id="cv-help">PDF, DOC o DOCX. Maximo 5 MB.</span>
          {errors.cv && <span className="field-error" id="cv-error">{errors.cv}</span>}
        </label>
      </div>

      {formError && (
        <div className="form-alert form-alert-error" role="alert">
          <p>{formError}</p>
          {getActiveErrorMessages(errors).length > 0 && (
            <ul>
              {getActiveErrorMessages(errors).map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {successMessage && (
        <div className="form-alert form-alert-success" role="status">
          {successMessage}
        </div>
      )}

      <button className="submit-button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando candidato...' : 'Guardar candidato'}
      </button>
    </form>
  );
}
