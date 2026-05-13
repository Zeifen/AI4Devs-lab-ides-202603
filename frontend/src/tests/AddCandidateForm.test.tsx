import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AddCandidateForm } from '../components/AddCandidateForm';

const originalFetch = global.fetch;

function fillRequiredFields(email = 'ada@example.com') {
  fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Ada' } });
  fireEvent.change(screen.getByLabelText(/apellido/i), { target: { value: 'Lovelace' } });
  fireEvent.change(screen.getByLabelText(/correo electronico/i), { target: { value: email } });
  fireEvent.change(screen.getByLabelText(/educacion/i), { target: { value: 'Mathematics' } });
  fireEvent.change(screen.getByLabelText(/experiencia laboral/i), {
    target: { value: 'Analytical engine research' },
  });
}

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
  global.fetch = originalFetch;
});

test('validates required fields before submitting', () => {
  render(<AddCandidateForm />);

  fireEvent.click(screen.getByRole('button', { name: /guardar candidato/i }));

  expect(screen.getAllByText(/el nombre es obligatorio/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/el apellido es obligatorio/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/el correo electronico es obligatorio/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/la educacion es obligatoria/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/la experiencia laboral es obligatoria/i).length).toBeGreaterThan(0);
  expect(global.fetch).not.toHaveBeenCalled();
});

test('validates email format before submitting', () => {
  render(<AddCandidateForm />);
  fillRequiredFields('invalid-email');

  fireEvent.click(screen.getByRole('button', { name: /guardar candidato/i }));

  expect(screen.getAllByText(/ingresa un correo electronico valido/i).length).toBeGreaterThan(0);
  expect(global.fetch).not.toHaveBeenCalled();
});

test('rejects unsupported CV files before submitting', () => {
  render(<AddCandidateForm />);
  fillRequiredFields();

  const cvInput = screen.getByLabelText(/cv/i);
  const file = new File(['notes'], 'notes.txt', { type: 'text/plain' });
  fireEvent.change(cvInput, { target: { files: [file] } });
  fireEvent.click(screen.getByRole('button', { name: /guardar candidato/i }));

  expect(screen.getAllByText(/el cv debe ser un archivo pdf, doc o docx/i).length).toBeGreaterThan(0);
  expect(global.fetch).not.toHaveBeenCalled();
});

test('submits FormData and shows success message', async () => {
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => ({
      candidate: {
        id: 1,
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
      },
      message: 'Candidate created successfully',
    }),
  });

  render(<AddCandidateForm />);
  fillRequiredFields();

  const cvInput = screen.getByLabelText(/cv/i);
  const file = new File(['%PDF-1.4'], 'ada.pdf', { type: 'application/pdf' });
  fireEvent.change(cvInput, { target: { files: [file] } });
  fireEvent.click(screen.getByRole('button', { name: /guardar candidato/i }));

  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

  const [, requestInit] = (global.fetch as jest.Mock).mock.calls[0];
  expect(requestInit.method).toBe('POST');
  expect(requestInit.body).toBeInstanceOf(FormData);
  expect(await screen.findByText(/candidato ada lovelace anadido exitosamente/i)).toBeInTheDocument();
});

test('shows loading state while submitting', async () => {
  let resolveFetch: (value: unknown) => void = () => undefined;
  (global.fetch as jest.Mock).mockImplementation(
    () =>
      new Promise((resolve) => {
        resolveFetch = resolve;
      }),
  );

  render(<AddCandidateForm />);
  fillRequiredFields();

  fireEvent.click(screen.getByRole('button', { name: /guardar candidato/i }));

  expect(screen.getByRole('button', { name: /enviando candidato/i })).toBeDisabled();

  resolveFetch({
    ok: true,
    json: async () => ({
      candidate: {
        id: 1,
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
      },
      message: 'Candidate created successfully',
    }),
  });

  await waitFor(() => expect(screen.getByRole('button', { name: /guardar candidato/i })).toBeEnabled());
});

test('shows API errors without breaking the form', async () => {
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: false,
    json: async () => ({
      message: 'A candidate with this email already exists',
    }),
  });

  render(<AddCandidateForm />);
  fillRequiredFields();

  fireEvent.click(screen.getByRole('button', { name: /guardar candidato/i }));

  expect(await screen.findByText(/a candidate with this email already exists/i)).toBeInTheDocument();
});
