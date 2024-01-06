import { deployments, ethers, getNamedAccounts } from "hardhat";
import { TodoList } from "../../typechain-types";
import { assert, expect } from "chai";

describe("TodoList", () => {
  let deployer: string;
  let todoList: TodoList;
  beforeEach(async () => {
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["all"]);
    const todoListDeployment = await deployments.get("TodoList");
    todoList = await ethers.getContractAt(
      "TodoList",
      todoListDeployment.address
    );
  });

  describe("storeTodo", function () {
    it("add new todo to list of addressToTodos", async function () {
      await todoList.storeTodo("test todo", Date.now(), false);
      const todos = await todoList.getTodos();
      assert.equal(todos.length, 1);
    });

    it("emit todostore", async function () {
      await todoList.storeTodo("test todo", Date.now(), false);
      expect(await todoList.getTodos()).to.emit(todoList, "TodoStore");
    });
  });

  describe("markTodoDone", function () {
    it("mark todo as done from list of addressToTodos", async function () {
      await todoList.storeTodo("test todo", Date.now(), false);
      await todoList.markTodoDone(1);
      const todos = await todoList.getTodos();
      const todo = await todoList.getTodo(1);
      assert.equal(todos.length, 1);
      assert.equal(todo[3].valueOf(), true);
    });
  });

  describe("markTodoUndone", function () {
    it("mark todo as undone from list of addressToTodos", async function () {
      await todoList.storeTodo("test todo", Date.now(), true);
      await todoList.markTodoUndone(1);
      const todos = await todoList.getTodos();
      const todo = await todoList.getTodo(1);
      assert.equal(todos.length, 1);
      assert.equal(todo[3].valueOf(), false);
    });
  });

  describe("updateTodo", function () {
    it("update todo from list of addressToTodos", async function () {
      await todoList.storeTodo("test todo", Date.now(), false);
      await todoList.updateTodo("test todo updated", Date.now(), true, 1);
      const todos = await todoList.getTodos();
      const todo = await todoList.getTodo(1);
      assert.equal(todos.length, 1);
      assert.equal(todo[3].valueOf(), true);
    });
  });

  describe("removeTodo", function () {
    it("remove todo from list of addressToTodos", async function () {
      await todoList.storeTodo("test todo", Date.now(), false);
      await todoList.removeTodo(1);
      const todos = await todoList.getTodos();
      assert.equal(todos.length, 0);
    });
    it("remove first todo from list of addressToTodos", async function () {
      await todoList.storeTodo("test todo", Date.now(), false);
      await todoList.storeTodo("test todo 2", Date.now(), false);
      await todoList.removeTodo(1);
      const todos = await todoList.getTodos();
      assert.equal(todos.length, 1);
    });
  });
  describe("clearTodo", function () {
    it("clear todo from list of addressToTodos", async function () {
      await todoList.storeTodo("test todo", Date.now(), false);
      await todoList.clearTodo();
      const todos = await todoList.getTodos();
      assert.equal(todos.length, 0);
    });
  });

  describe("getTodo", function () {
    it("return error if todo not found", async function () {
      await todoList.storeTodo("test todo", Date.now(), false);
      await expect(todoList.getTodo(3)).to.be.revertedWithCustomError(
        todoList,
        "TodoList__NotFound"
      );
    });
    it("return todo from index", async function () {
      await todoList.storeTodo("test todo", Date.now(), false);
      const todo = await todoList.getTodo(1);
      assert.equal(todo[3].valueOf(), false);
      assert.equal(todo[1].valueOf(), "test todo");
    });
  });

  describe("getTodoIndex", function () {
    it("return error if todo not found", async function () {
      await todoList.storeTodo("test todo", Date.now(), false);
      await expect(todoList.getTodoIndex(3)).to.be.revertedWithCustomError(
        todoList,
        "TodoList__NotFound"
      );
    });
  });

  describe("getCurrentId", function () {
    it("return currentId after add new todo", async function () {
      await todoList.storeTodo("test todo", Date.now(), false);
      const currentId = await todoList.getCurrentId();
      assert.equal(currentId, 2n);
    });
  });
});
