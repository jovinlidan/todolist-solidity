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
      await todoList.storeTodo(
        "test todo",
        new Date().getTime().toString(),
        false
      );
      const todos = await todoList.getTodos();
      assert.equal(todos.length, 1);
    });

    it("emit todostore", async function () {
      await todoList.storeTodo(
        "test todo",
        new Date().getTime().toString(),
        false
      );
      expect(await todoList.getTodos()).to.emit(todoList, "TodoStore");
    });
  });

  describe("updateTodo", function () {
    it("update todo from list of addressToTodos", async function () {
      await todoList.storeTodo(
        "test todo",
        new Date().getTime().toString(),
        false
      );
      await todoList.updateTodo(
        "test todo updated",
        new Date().getTime().toString(),
        true,
        0
      );
      const todos = await todoList.getTodos();
      const todo = await todoList.getTodo(0);
      assert.equal(todos.length, 1);
      assert.equal(todo[2].valueOf(), true);
    });

    it("return error if index out of bound", async function () {
      await todoList.storeTodo(
        "test todo",
        new Date().getTime().toString(),
        false
      );
      await expect(
        todoList.updateTodo(
          "test todo updated",
          new Date().getTime().toString(),
          true,
          1
        )
      ).to.be.revertedWithCustomError(todoList, "TodoList__NotFound");
    });
  });

  describe("removeTodo", function () {
    it("remove todo from list of addressToTodos", async function () {
      await todoList.storeTodo(
        "test todo",
        new Date().getTime().toString(),
        false
      );
      await todoList.removeTodo(0);
      const todos = await todoList.getTodos();
      assert.equal(todos.length, 0);
    });

    it("return error if index out of bound", async function () {
      await todoList.storeTodo(
        "test todo",
        new Date().getTime().toString(),
        false
      );
      await expect(todoList.removeTodo(1)).to.be.revertedWithCustomError(
        todoList,
        "TodoList__NotFound"
      );
    });
  });
  describe("clearTodo", function () {
    it("clear todo from list of addressToTodos", async function () {
      await todoList.storeTodo(
        "test todo",
        new Date().getTime().toString(),
        false
      );
      await todoList.clearTodo();
      const todos = await todoList.getTodos();
      assert.equal(todos.length, 0);
    });
  });

  describe("getTodo", function () {
    it("return todo from index", async function () {
      await todoList.storeTodo(
        "test todo",
        new Date().getTime().toString(),
        false
      );
      const todo = await todoList.getTodo(0);
      assert.equal(todo[2].valueOf(), false);
      assert.equal(todo[0].valueOf(), "test todo");
    });
  });
});
