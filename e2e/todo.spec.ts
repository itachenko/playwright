import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // navigate
});

test.describe(`Create`, async () => {
  test(`Should add newly created todo item to the end of the list`, async () => {
    // Given I am a user
    // When I create a new todo item
    // Then it appears last on my todo list
  });
});

test.describe(`Edit`, async () => {
  test.beforeEach(async () => {
    // create a dummy todo
  });

  test(`Should change todo item properties`, async () => {
    // Given I have created a todo item
    // When I edit a todo item
    // Then the todo item gets updated with the new changes
  });
});

test.describe(`Complete`, async () => {
  test.beforeEach(async () => {
    // create a dummy todo
  });

  test(`Should complete a todo item by green check mark`, async () => {
    // Given I have created a todo item
    // When I delete a todo item using the red X
    // Then the todo item is removed from my todo list
  });

  test(`Should not show completed todos in active list`, async () => {
    // Given I have created a todo item
    // When I mark a todo item as completed
    // Then it is marked with a green check mark
    // And it is crossed off my todo list with a Strikethrough
  });

  test(`Should clear completed todos`, async () => {
    // Given I have marked a todo item as complete
    // When I view the Active list
    // Then only Active (Not Completed) todo items are shown
  });
});

test.describe(`Delete`, async () => {
  test.beforeEach(async () => {
    // create a dummy todo
  });

  test(`Should delete a todo item by red X`, async () => {
    // Given I have marked a todo item as complete
    // When I click “Clear Completed”
    // Then the completed todo item is removed from my todo list
    // And the todo item is moved to the Completed list
  });
});
