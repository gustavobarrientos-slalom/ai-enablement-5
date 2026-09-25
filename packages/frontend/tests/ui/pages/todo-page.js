// Page Object Model for the TODO app UI, used by Playwright tests in tests/ui.
class TodoPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.titleInput = page.getByPlaceholder(/what needs to be done/i);
    this.addButton = page.getByRole('button', { name: /^add$/i });
  }

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async addTodo(title) {
    await this.titleInput.fill(title);
    await this.addButton.click();
  }

  todoItem(title) {
    return this.page.getByText(title, { exact: true }).locator('..').locator('..');
  }

  async toggleTodo(title) {
    const item = this.page.locator('li', { hasText: title });
    await item.getByRole('checkbox').click();
  }

  async deleteTodo(title) {
    const item = this.page.locator('li', { hasText: title });
    await item.getByRole('button', { name: /delete/i }).click();
  }

  async startEditTodo(title) {
    const item = this.page.locator('li', { hasText: title });
    await item.getByRole('button', { name: /edit/i }).click();
  }

  async saveEditTodo(newTitle) {
    const editInput = this.page.locator('li input[type="text"]');
    await editInput.fill(newTitle);
    await this.page
      .locator('li')
      .filter({ has: editInput })
      .getByRole('button', { name: /save/i })
      .click();
  }

  itemsLeftChip() {
    return this.page.getByText(/items left/i);
  }

  completedChip() {
    return this.page.getByText(/completed/i);
  }

  emptyStateMessage() {
    return this.page.getByText(/no todos yet/i);
  }

  errorMessage() {
    return this.page.getByText(/something went wrong/i);
  }
}

module.exports = { TodoPage };
