export const testSelectors = {
  header: {
    newTodo: ".new-todo",
  },
  main: {
    todoList: {
      list: ".todo-list > li",
      todoEdit: ".edit",
      todoDelete: ".destroy",
      todoComplete: ".toggle",
    },
  },
  footer: {
    filters: {
      all: ".filters >> text=All",
      active: ".filters >> text=Active",
      completed: ".filters >> text=Completed",
    },
    clearCompleted: ".clear-completed",
  },
};
