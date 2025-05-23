import '@testing-library/jest-dom'
import { render, screen, fireEvent} from '@testing-library/react';

import App from '../App';

test('добавляет новую задачу', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/what needs to be done/i);
  fireEvent.change(input, { target: { value: 'Новая задача' } });
  fireEvent.keyDown(input, { key: 'Enter' });

  expect(screen.getByText('Новая задача')).toBeInTheDocument();
});

test('переключает состояние задачи', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/what needs to be done/i);
  fireEvent.change(input, { target: { value: 'Toggle me' } });
  fireEvent.keyDown(input, { key: 'Enter' });

  const checkbox = screen.getByRole('checkbox');
  expect(checkbox).not.toBeChecked();
  fireEvent.click(checkbox);
  expect(checkbox).toBeChecked();
});
