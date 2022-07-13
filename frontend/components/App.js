import React from 'react'
import axios from 'axios'

const URL = 'http://localhost:9000/api/todos'

export default class App extends React.Component {
  state = {
    todos: [],
    error: '',
    nameInput: '',
  }
  fetchAllTodos = () => {
    axios.get(URL)
      .then(res => {
        this.setState({
          ...this.state,
          todos: res.data.data
        })
      })
      .catch(err => {
        this.setState({
          ...this.state,
          error: err.response.data.message
        })
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
            this.state.todos.map(todo => {
              return <div key={todo.id}>{todo.name}</div>
            })
          }
        </div>
        <form id="todoForm">
          <input value={this.state.nameInput}></input>
          <input type="submit"></input>
          <button>Clear Completed</button>
        </form>
      </div>
    )
  }
}
