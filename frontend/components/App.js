import React from 'react'
import axios from 'axios'

const URL = 'http://localhost:9000/api/todos'

export default class App extends React.Component {
  state = {
    todos: [],
    error: '',
    nameInput: '',
  }

  onTodoNameInputChange = e => {
    const { value } = e.target 
    this.setState({
      ...this.state,
      nameInput: value
    })
  }

  resetFormInput = () => {
    this.setState({
      ...this.state,
      nameInput: ''
    })
  }

  setAxiosResponseError = err => {
    this.setState({
      ...this.state,
      error: err.response.data.message
    })
  }

  postNewTodo = () => {
    axios.post(URL, { name: this.state.nameInput })
      .then(res => {
        this.setState({ ...this.state, todos: this.state.todos.concact(res.data.data)})
        this.resetFormInput()
      })
      .catch(this.setAxiosResponseError)
  }

  onTodoFormSubmit = e => {
    e.preventDefault()
    this.postNewTodo()
  }

  fetchAllTodos = () => {
    axios.get(URL)
      .then(res => {
        this.setState({
          ...this.state,
          todos: res.data.data
        })
      })
      .catch(this.setAxiosResponseError)
      
  }

  toggleCompleted = id => () => {
    axios.patch(`${URL}/${id}`)
      .then(res => {
        this.setState({
          ...this.state,
          todos: this.state.todos.map(todo => {
            if(todo.id !== id) return todo
            return res.data.data
          })
        })
      })
      .catch(this.setAxiosResponseError)
  }

  componentDidMount() {
    this.fetchAllTodos()
  }

  render() {
    return (
      <div>
        <div id="error">Error: {this.state.error}</div>
        <div id="todos">
          <h2>Todos:</h2>
          {
            this.state.todos.map(todo => {
              return <div onClick={this.toggleCompleted(todo.id)}key={todo.id}>{todo.name} {todo.completed ? ' ✔️' : ''}</div>
            })
          }
        </div>
        <form id="todoForm" onSubmit={this.onTodoFormSubmit}>
          <input value={this.state.nameInput} onChange={this.onTodoNameInputChange} type="text" placeholder='Type todo'></input>
          <input type="submit"></input>
          <button>Clear Completed</button>
        </form>
      </div>
    )
  }
}
