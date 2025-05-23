// import { render, screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import App from '../App';
// import { Provider } from 'mobx-react';
// import { TodoStore } from '../stores/TodoStore';

// describe('Добавление задач', () => {
//   test('Пользователь может добавить новую задачу', async () => {
//     render(
//       <Provider taskStore={TodoStore}>
//         <App />
//       </Provider>
//     );

//     const input = screen.getByPlaceholderText(/введите задачу/i);
//     await userEvent.type(input, 'Протестировать функциональность');
//     await userEvent.keyboard('{Enter}');

//     expect(screen.getByText('Протестировать функциональность')).toBeInTheDocument();
//   });
  
//   test('Можно переключить статус задачи', async () => {
//   render(
//     <Provider taskStore={TodoStore}>
//       <App />
//     </Provider>
//   );

//   const input = screen.getByPlaceholderText(/введите задачу/i);
//   await userEvent.type(input, 'Завершить таск{enter}');

//   const checkbox = screen.getByRole('checkbox');
//   await userEvent.click(checkbox);

//   expect(checkbox).toBeChecked();
// });
// });
