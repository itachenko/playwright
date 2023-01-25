import { test } from "@playwright/test";
import { Action } from "./framework/action";
import { Assertion } from "./framework/assertion";
import { Navigation } from "./framework/navigation";
import { generateRandomString } from "./framework/utils";
import { testSelectors } from "./framework/testSelectors";

let action: Action;
let assert: Assertion;
let navigateTo: Navigation;

test.beforeEach(async ({ page }) => {
  action = new Action(page);
  assert = new Assertion();
  navigateTo = new Navigation(page);

  await navigateTo.mainPage();
});

test.describe(`Create`, async () => {
  test(`Should create a todo item`, async () => {
    // Act
    const item = await action.createTodo(generateRandomString());

    // Assert
    assert.areEqual(await action.getTodosCountFromLocalStorage(), 1);

    const visibleTodos = await action.getVisibleTodosNames();
    assert.areEqual(visibleTodos.length, 1);
    assert.areEqual(visibleTodos.includes(item.title), true);
  });

  test(`Should add newly created todo item to the end of the list`, async () => {
    // Arrange
    await action.createTodo(generateRandomString());

    // Act
    const secondItem = await action.createTodo(generateRandomString());

    // Assert
    const todosCount = await action.getTodosCountFromLocalStorage();
    assert.areEqual(todosCount, 2);
    assert.areEqual(
      await action.getTodoFromLocalStorageByIndex(todosCount - 1),
      secondItem
    );

    assert.areEqual((await action.getVisibleTodosNames()).length, 2);
    assert.areEqual(
      (await (await action.getLastVisibleTodo()).textContent()) as string,
      secondItem.title
    );
  });
});

test.describe(`Edit`, async () => {
  test(`Should change todo item properties`, async () => {
    // Arrange
    const item = await action.createTodo(generateRandomString());

    // Act
    const newTitle = generateRandomString();
    await action.editTodoByIndex(0, newTitle);

    // Assert
    const updatedTodo = await action.getTodoFromLocalStorageByIndex(
      (await action.getTodosCountFromLocalStorage()) - 1
    );
    assert.areEqual(item.id, updatedTodo.id);
    assert.areEqual(item.completed, updatedTodo.completed);
    assert.areEqual(updatedTodo.title, newTitle);
  });
});

test.describe(`Complete`, async () => {
  test.beforeEach(async () => {
    for (let i = 0; i < 5; i++) {
      await action.createTodo(`${generateRandomString()}-${i}`);
    }

    await action.getTodosCountFromLocalStorage("active");
    assert.areEqual(await action.getTodosCountFromLocalStorage("active"), 5);
    assert.areEqual(await action.getTodosCountFromLocalStorage("completed"), 0);
  });

  test(`Should complete a todo item by green check mark`, async () => {
    // Act
    await action.completeTodoByIndex(0);

    // Assert
    assert.areEqual(await action.getTodosCountFromLocalStorage("active"), 4);
    assert.areEqual(await action.getTodosCountFromLocalStorage("completed"), 1);
    assert.areEqual(await action.isTodoCompleted(0), true);
  });

  test(`Should not show completed todos in active list`, async () => {
    // Arrange
    const itemTitle = await (
      await action.getTodoItemLocatorByIndex(0)
    ).textContent();
    await action.completeTodoByIndex(0);

    assert.areEqual(await action.getTodosCountFromLocalStorage("active"), 4);
    assert.areEqual(await action.getTodosCountFromLocalStorage("completed"), 1);

    // Act
    await action.filterTodos("active");

    // Assert
    const visibleTodos = await action.getVisibleTodosNames();
    assert.areEqual(visibleTodos.length, 4);
    assert.areEqual(visibleTodos.includes(itemTitle!), false);
  });

  test(`Should clear completed todos`, async () => {
    await action.completeTodoByIndex(0);

    assert.areEqual(await action.getTodosCountFromLocalStorage("active"), 4);
    assert.areEqual(await action.getTodosCountFromLocalStorage("completed"), 1);

    await action.filterTodos("completed");
    let visibleTodos = await action.getVisibleTodosNames();
    assert.areEqual(visibleTodos.length, 1);

    // Act
    await action.click(testSelectors.footer.clearCompleted);

    // Assert
    assert.areEqual(await action.getTodosCountFromLocalStorage("completed"), 0);
    visibleTodos = await action.getVisibleTodosNames();
    assert.areEqual(visibleTodos.length, 0);
  });
});

test.describe(`Delete`, async () => {
  test(`Should delete a todo item by red X`, async () => {
    // Arrange
    await action.createTodo(generateRandomString());
    assert.areEqual(await action.getTodosCountFromLocalStorage(), 1);

    // Act
    await action.deleteTodoByIndex(0);

    // Assert
    assert.areEqual(await action.getTodosCountFromLocalStorage(), 0);
    assert.areEqual((await action.getVisibleTodosNames()).length, 0);
  });
});
