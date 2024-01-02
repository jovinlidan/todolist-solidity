// SPDX-License-Identifier: MIT

pragma solidity >=0.8.2 <0.9.0;

error TodoContract__NotFound();

contract TodoContract {
    struct Todo {
        string message;
        string date;
        bool isCompleted;
    }

    event TodoStore(address owner);
    event TodoRemove(address owner);
    event TodoClear(address owner);


    address[] private s_owners;
    mapping (address =>  Todo[])  private  s_addressToTodos;


    function storaTodo(string memory message, string memory date, bool isCompleted) public {
        if(s_addressToTodos[msg.sender].length > 0 ) { //have todo
        }
        else { // doesn't have todo
            s_owners.push(msg.sender);
        }
        s_addressToTodos[msg.sender].push(Todo(message, date, isCompleted));
        emit TodoStore(msg.sender);
    }

    function removeTodo(uint256 index) public {
        Todo[] storage myTodos = s_addressToTodos[msg.sender];
        if(index >= myTodos.length){
            revert TodoContract__NotFound();
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

    function getOwner(uint256 index) public view returns (address) {
        return s_owners[index];
    }




    
}