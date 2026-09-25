const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/todo-page');

// Critical user journeys for the TODO app: create, edit, toggle, delete, and
// an API-unavailable error path. Kept to 5 focused, isolated tests using the
// TodoPage Page Object Model. Each test uses a unique title to avoid
// collisions with the shared in-memory backend.

test.describe('TODO App critical journeys', () => {
  test('creates a new todo and updates the items-left stat', async ({
    page,
  }) => {
    const todoPage = new TodoPage(page);
    const title = `Create journey ${Date.now()}`;

    await todoPage.goto();
    await todoPage.addTodo(title);

    await expect(page.getByText(title, { exact: true })).toBeVisible();
    await expect(todoPage.itemsLeftChip()).toBeVisible();
  });

  test('toggles a todo between incomplete and complete', async ({ page }) => {
    const todoPage = new TodoPage(page);
    const title = `Toggle journey ${Date.now()}`;

    await todoPage.goto();
    await todoPage.addTodo(title);

    const checkbox = page
      .locator('li', { hasText: title })
      .getByRole('checkbox');

    await todoPage.toggleTodo(title);
    await expect(checkbox).toBeChecked();

    await todoPage.toggleTodo(title);
    await expect(checkbox).not.toBeChecked();
  });

  test('edits a todo title', async ({ page }) => {
    const todoPage = new TodoPage(page);
    const originalTitle = `Edit journey ${Date.now()}`;
    const updatedTitle = `${originalTitle} - updated`;

    await todoPage.goto();
    await todoPage.addTodo(originalTitle);

    await todoPage.startEditTodo(originalTitle);
    await todoPage.saveEditTodo(updatedTitle);

    await expect(page.getByText(updatedTitle, { exact: true })).toBeVisible();
    await expect(
      page.getByText(originalTitle, { exact: true })
    ).not.toBeVisible();
  });

  test('deletes a todo', async ({ page }) => {
    const todoPage = new TodoPage(page);
    const title = `Delete journey ${Date.now()}`;

    await todoPage.goto();
    await todoPage.addTodo(title);
    await expect(page.getByText(title, { exact: true })).toBeVisible();

    await todoPage.deleteTodo(title);

    await expect(page.getByText(title, { exact: true })).not.toBeVisible();
  });

  test('shows an error message when the API is unavailable', async ({
    page,
  }) => {
    const todoPage = new TodoPage(page);

    // Simulate the backend being unreachable for this page load only.
    await page.route('**/api/todos', (route) => route.abort('failed'));

    await todoPage.goto();

    await expect(todoPage.errorMessage()).toBeVisible();
  });
});
