import React from 'react'
import axios from 'axios'
import Form from './Form'

const URL = 'http://localhost:9000/api/todos'

export default class App extends React.Component {
  state = {
    todos: [],
    error: '',
    nameInput: '',
    displayCompleted: true,
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
        this.setState({ ...this.state, todos: this.state.todos.concat(res.data.data)})
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

  toggleDisplayCompleted = () => {
    this.setState({
      ...this.state, displayCompleted: !this.state.displayCompleted
    })
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
            this.state.todos.reduce((acc, todo) => {
              if (this.state.displayCompleted || !todo.completed) return acc.concat(
                <div onClick={this.toggleCompleted(todo.id)}key={todo.id}>{todo.name} {todo.completed ? ' ✔️' : ''}</div>
              )
              return acc
            }, [])
            // return <div onClick={this.toggleCompleted(todo.id)}key={todo.id}>{todo.name} {todo.completed ? ' ✔️' : ''}</div>
          }
        </div>
        <Form 
          onTodoFormSubmit={this.onTodoFormSubmit}
          onTodoNameInputChange={this.onTodoNameInputChange}
          toggleDisplayCompleted={this.toggleDisplayCompleted}
          displayCompleted={this.state.displayCompleted}
          nameInput={this.state.nameInput}
        />
      </div>
    )
  }
}
