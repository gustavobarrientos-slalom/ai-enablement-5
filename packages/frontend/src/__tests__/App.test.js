import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderApp = () => {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>
      <App />
    </QueryClientProvider>
  );
};

const mockFetchSuccess = (initialTodos) => {
  let todos = [...initialTodos];

  global.fetch = jest.fn((url, options) => {
    const method = options?.method || 'GET';

    if (method === 'GET') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(todos),
      });
    }

    if (method === 'POST') {
      const { title } = JSON.parse(options.body);
      const newTodo = {
        id: todos.length + 1,
        title,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      todos = [...todos, newTodo];
      return Promise.resolve({
        ok: true,
        status: 201,
        json: () => Promise.resolve(newTodo),
      });
    }

    if (method === 'DELETE') {
      const id = Number(url.split('/').pop());
      todos = todos.filter((t) => t.id !== id);
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });
    }

    if (method === 'PATCH') {
      const id = Number(url.split('/').slice(-2)[0]);
      todos = todos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      );
      const updated = todos.find((t) => t.id === id);
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(updated),
      });
    }

    if (method === 'PUT') {
      const id = Number(url.split('/').pop());
      const body = JSON.parse(options.body);
      todos = todos.map((t) => (t.id === id ? { ...t, ...body } : t));
      const updated = todos.find((t) => t.id === id);
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(updated),
      });
    }

    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
  });
};

const mockFetchError = () => {
  global.fetch = jest.fn(() => Promise.reject(new Error('Network Error')));
};

afterEach(() => {
  jest.clearAllMocks();
});

test('renders TODO App heading', async () => {
  mockFetchSuccess([]);
  renderApp();

  const headingElement = await screen.findByText(/TODO App/i);
  expect(headingElement).toBeInTheDocument();
});

test('uses a relative API URL when fetching todos', async () => {
  mockFetchSuccess([]);
  renderApp();

  await screen.findByText(/TODO App/i);

  expect(fetch).toHaveBeenCalledWith('/api/todos');
});

test('shows an empty state message when there are no todos', async () => {
  mockFetchSuccess([]);
  renderApp();

  expect(await screen.findByText(/no todos yet/i)).toBeInTheDocument();
});

test('does not show the empty state message when todos exist', async () => {
  mockFetchSuccess([
    { id: 1, title: 'First todo', completed: false, createdAt: '' },
  ]);
  renderApp();

  await screen.findByText('First todo');

  expect(screen.queryByText(/no todos yet/i)).not.toBeInTheDocument();
});

test('displays correct stats for incomplete and completed todos', async () => {
  mockFetchSuccess([
    { id: 1, title: 'Todo 1', completed: false, createdAt: '' },
    { id: 2, title: 'Todo 2', completed: true, createdAt: '' },
    { id: 3, title: 'Todo 3', completed: false, createdAt: '' },
  ]);
  renderApp();

  await screen.findByText('Todo 1');

  expect(await screen.findByText(/2 items left/i)).toBeInTheDocument();
  expect(await screen.findByText(/1 completed/i)).toBeInTheDocument();
});

test('deletes a todo when the delete button is clicked', async () => {
  const user = userEvent.setup();
  mockFetchSuccess([
    { id: 1, title: 'Todo to delete', completed: false, createdAt: '' },
  ]);
  renderApp();

  await screen.findByText('Todo to delete');

  const deleteButton = screen.getByRole('button', { name: /delete/i });
  await user.click(deleteButton);

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith(
      '/api/todos/1',
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  await waitFor(() => {
    expect(screen.queryByText('Todo to delete')).not.toBeInTheDocument();
  });
});

test('allows editing a todo title', async () => {
  const user = userEvent.setup();
  mockFetchSuccess([
    { id: 1, title: 'Original Title', completed: false, createdAt: '' },
  ]);
  renderApp();

  await screen.findByText('Original Title');

  const editButton = screen.getByRole('button', { name: /edit/i });
  await user.click(editButton);

  const editInput = await screen.findByDisplayValue('Original Title');
  await user.clear(editInput);
  await user.type(editInput, 'Updated Title');

  const saveButton = screen.getByRole('button', { name: /save/i });
  await user.click(saveButton);

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith(
      '/api/todos/1',
      expect.objectContaining({ method: 'PUT' })
    );
  });

  expect(await screen.findByText('Updated Title')).toBeInTheDocument();
});

test('displays an error message when fetching todos fails', async () => {
  mockFetchError();
  renderApp();

  expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
});
