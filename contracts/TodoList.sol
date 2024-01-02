// SPDX-License-Identifier: MIT

pragma solidity >=0.8.2 <0.9.0;

error TodoList__NotFound();

contract TodoList {
    struct Todo {
        string message;
        string date;
        bool isCompleted;
    }

    event TodoStore(address owner);
    event TodoRemove(address owner);
    event TodoUpdate(address owner);
    event TodoClear(address owner);


    mapping (address =>  Todo[])  private  s_addressToTodos;


    function storeTodo(string memory message, string memory date, bool isCompleted) public {
        s_addressToTodos[msg.sender].push(Todo(message, date, isCompleted));
        emit TodoStore(msg.sender);
    }

    function updateTodo(string memory message, string memory date, bool isCompleted, uint256 index) public {
        Todo[] storage myTodos = s_addressToTodos[msg.sender];
        if(index >= myTodos.length){
            revert TodoList__NotFound();
        }
        myTodos[index] = Todo(message, date, isCompleted);
        s_addressToTodos[msg.sender] = myTodos;
        emit TodoUpdate(msg.sender);
    }

    function removeTodo(uint256 index) public {
        Todo[] storage myTodos = s_addressToTodos[msg.sender];
        if(index >= myTodos.length){
            revert TodoList__NotFound();
        }
        myTodos[index] = myTodos[myTodos.length - 1];
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
    function getTodo(uint256 index) public view returns(Todo memory) {
        return s_addressToTodos[msg.sender][index];
    }

    // function getOwner(uint256 index) public view returns (address) {
    //     return s_owners[index];
    // }




    
}