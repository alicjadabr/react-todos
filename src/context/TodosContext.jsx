import React from 'react'
import { useState, useEffect, createContext, useContext } from 'react'
import { v4 as uuidv4 } from 'uuid'

const TodosContext = createContext(null)

export const TodosProvider = ({ children }) => {
  const [todos, setTodos] = useState(getInitialTodos())

  function getInitialTodos() {
    const temp = localStorage.getItem('todos')
    const savedTodos = JSON.parse(temp)
    return savedTodos || []
  }

  useEffect(() => {
    const temp = JSON.stringify(todos)
    localStorage.setItem('todos', temp)
  }, [todos])

  const todoChangeHandler = (id) => {
    setTodos(prev => prev.map(todo => {
      if(todo.id === id) {
        return {
          ...todo,
          completed: !todo.completed,
        }
      }
      return todo
    }))
  }

  const todoAddHandler = (title) => {
    const newTodo = {
      id: uuidv4(),
      title: title,
      completed: false
    }
    setTodos([...todos, newTodo])
  }

  const todoDeleteHandler = (id) => {
    setTodos([
      ...todos.filter(todo => todo.id !== id)
    ])
  }

  const setUpdate = (updatedTitle, id) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          todo.title = updatedTitle
        }
        return todo
      })
    )
  }


  return (
    <TodosContext.Provider 
      value={{
        todos,
        todoChangeHandler,
        todoDeleteHandler,
        todoAddHandler,
        setUpdate,
      }}
    >
      {children}
    </TodosContext.Provider>
  )
}
export const useTodosContext = () => useContext(TodosContext)
