import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../App';

test('renders the add candidate action', () => {
  render(<App />);

  expect(screen.getByRole('button', { name: /anadir candidato/i })).toBeInTheDocument();
});

test('shows the candidate form after clicking the add action', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /anadir candidato/i }));

  expect(screen.getByRole('heading', { name: /anadir candidato/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/correo electronico/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/telefono/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/direccion/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/educacion/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/experiencia laboral/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/cv/i)).toBeInTheDocument();
});
