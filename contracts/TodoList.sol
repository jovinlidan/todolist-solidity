// SPDX-License-Identifier: MIT

pragma solidity >=0.8.2 <0.9.0;

error TodoList__NotFound();

contract TodoList {
    struct Todo {
        uint256 id;
        string message;
        uint256 date;
        bool isCompleted;
    }

    event TodoStore(address owner);
    event TodoRemove(address owner);
    event TodoUpdate(address owner);
    event TodoClear(address owner);


    mapping (address =>  Todo[])  private  s_addressToTodos;
    uint256 private s_currentId = 1;
    
    function storeTodo(string memory message, uint256 date, bool isCompleted) public {
        s_addressToTodos[msg.sender].push(Todo(s_currentId++, message, date, isCompleted));
        emit TodoStore(msg.sender);
    }

    function markTodoDone(uint256 id) public {
        Todo[] storage myTodos = s_addressToTodos[msg.sender];
        uint256 todoIndex = getTodoIndex(id);
        myTodos[todoIndex].isCompleted = true;
        s_addressToTodos[msg.sender] = myTodos;
        emit TodoUpdate(msg.sender);
    }


    function markTodoUndone(uint256 id) public {
        Todo[] storage myTodos = s_addressToTodos[msg.sender];
        uint256 todoIndex = getTodoIndex(id);
        myTodos[todoIndex].isCompleted = false;
        s_addressToTodos[msg.sender] = myTodos;
        emit TodoUpdate(msg.sender);
    }

    function updateTodo(string memory message , uint256 date, bool isCompleted, uint256 id) public {
        Todo[] storage myTodos = s_addressToTodos[msg.sender];
        uint256 todoIndex = getTodoIndex(id);
        myTodos[todoIndex] = Todo(myTodos[todoIndex].id, message, date, isCompleted); 
        s_addressToTodos[msg.sender] = myTodos;
        emit TodoUpdate(msg.sender);
    }

    function removeTodo(uint256 id) public {
        Todo[] storage myTodos = s_addressToTodos[msg.sender];
        uint256 todoIndex = getTodoIndex(id);
        if(todoIndex != myTodos.length - 1){ 
            myTodos[todoIndex] = myTodos[myTodos.length - 1];
        }
        myTodos.pop();
        s_addressToTodos[msg.sender] = myTodos;
        emit TodoRemove(msg.sender);
    }

    function clearTodo() public {
        delete s_addressToTodos[msg.sender];
        emit TodoClear(msg.sender);
    }

    function getTodos() public view returns(Todo[] memory) {
        return s_addressToTodos[msg.sender];
    }
    function getTodoIndex(uint256 id) public view returns(uint256) {
        Todo[] storage myTodos = s_addressToTodos[msg.sender];
        for(uint256 i = 0; i < myTodos.length; i++){
            if(myTodos[i].id == id){
                return i;
            }
        }
        revert TodoList__NotFound();
    }
    function getTodo(uint256 id) public view returns(Todo memory) {
        Todo[] storage myTodos = s_addressToTodos[msg.sender];
        for(uint256 i = 0; i < myTodos.length; i++){
            if(myTodos[i].id == id){
                return myTodos[i];
            }
        }
        revert TodoList__NotFound();
    }
    function getCurrentId() public view returns(uint256){
        return s_currentId;
    }
}