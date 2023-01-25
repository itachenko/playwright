import { Locator, Page } from "@playwright/test";
import { testSelectors } from "./testSelectors";
import { Todo } from "./types";

export class Action {
  constructor(private _page: Page) {}

  public async click(
    selector: string,
    button: "left" | "right" | "middle" = "left"
  ): Promise<void> {
    await this._page.click(selector, { button });
  }

  public async pressKey(key: string): Promise<void> {
    await this._page.keyboard.press(key);
  }

  public async createTodo(text: string): Promise<Todo> {
    await this._page.fill(testSelectors.header.newTodo, text);
    await this.pressKey("Enter");

    const todos = await this.getTodosFromLocalStorage();

    return todos[todos.length - 1];
  }

  public async editTodoByIndex(idx: number, text: string): Promise<void> {
    const item = await this.getTodoItemLocatorByIndex(idx);

    await item.dblclick();
    await item.locator(testSelectors.main.todoList.todoEdit).fill(text);
    await this.pressKey("Enter");
  }

  public async deleteTodoByIndex(idx: number): Promise<void> {
    const item = await this.getTodoItemLocatorByIndex(idx);

    await item.hover();
    await item.locator(testSelectors.main.todoList.todoDelete).click();
  }

  public async completeTodoByIndex(idx: number): Promise<void> {
    const item = await this.getTodoItemLocatorByIndex(idx);

    await item.locator(testSelectors.main.todoList.todoComplete).check();
  }

  public async isTodoCompleted(idx: number): Promise<boolean> {
    const item = await this.getTodoItemLocatorByIndex(idx);

    const cl = await item.getAttribute("class");
    const st = await this.getElementStyle(item, "textDecorationLine");

    return cl === "completed" && st === "line-through";
  }

  public async filterTodos(
    filter: "all" | "active" | "completed"
  ): Promise<void> {
    const element: Locator = this._page.locator(
      testSelectors.footer.filters[filter]
    );

    await element.click();
  }

  public async getTodoItemLocatorByIndex(idx: number): Promise<Locator> {
    const item: Locator = this._page
      .locator(testSelectors.main.todoList.list)
      .nth(idx);

    if (!(await item.isVisible())) {
      throw new Error(`No todo item with idx ${idx}`);
    }

    return item;
  }

  public async getLastVisibleTodo(): Promise<Locator> {
    return this._page.locator(testSelectors.main.todoList.list).last();
  }

  public async getVisibleTodosNames(): Promise<string[]> {
    const visibleTodos = this._page.locator(testSelectors.main.todoList.list);

    const names: string[] = [];

    for (let i = 0; i < (await visibleTodos.count()); i++) {
      const name = await visibleTodos.nth(i).textContent();

      if (name) {
        names.push(name);
      }
    }

    return names;
  }

  public async getTodosFromLocalStorage(
    filter: "all" | "active" | "completed" = "all"
  ): Promise<Todo[]> {
    const todos: Todo[] = await this._page.evaluate(() => {
      return JSON.parse((window as any).localStorage.getItem("react-todos"));
    });

    if (!todos || !todos.length) {
      return [];
    }

    switch (filter) {
      case "all": {
        return todos;
      }
      case "active": {
        return todos.filter((td: Todo) => !td.completed);
      }
      case "completed": {
        return todos.filter((td: Todo) => td.completed);
      }
    }
  }

  public async getTodosCountFromLocalStorage(
    filter: "all" | "active" | "completed" = "all"
  ): Promise<number> {
    return (await this.getTodosFromLocalStorage(filter)).length;
  }

  public async getTodoFromLocalStorageByIndex(idx: number): Promise<Todo> {
    const todos = await this.getTodosFromLocalStorage();

    const todo = todos[idx];

    if (!todo) {
      throw new Error(`No todo with idx ${idx}`);
    }

    return todo;
  }

  private async getElementStyle(
    element: Locator,
    style: string
  ): Promise<string> {
    return await element
      .locator("label")
      .evaluate<string, string>((el, style) => {
        return window.getComputedStyle(el)[style];
      }, style);
  }
}
