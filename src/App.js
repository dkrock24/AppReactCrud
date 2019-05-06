import axios from 'axios';
import React, { Component } from 'react';
import logo from './logo.svg';
import loadingGift from './loading.gif';
import './App.css';

import ListItem from './ListItem';

class App extends Component {

  constructor(){

    super();

    this.state = {
      
      newTodo:'Wash the dishes',

      editing:false,

      editingIndex: null,

      notification : null,

      todos: [],

      loading:true
    };

    this.apiUrl = 'https://5ccb437454c8540014835445.mockapi.io';

    this.alert        = this.alert.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addTodo      = this.addTodo.bind(this);
    this.deleteTodo   = this.deleteTodo.bind(this);
    this.editTodo     = this.editTodo.bind(this);
    this.updateTodo   = this.updateTodo.bind(this);
    this.generateTodoId = this.generateTodoId.bind(this);    

  }

  componentWillMount(){
    console.log('I will mount');
  }

  async componentDidMount(){
    const response = await axios.get(`${this.apiUrl}/todos/todos`);
    this.setState({
      todos: response.data,
      loading:false
    });
    console.log(response);
  }


  alert(notification){

    this.setState({
      notification
    });

    setTimeout( ()=>{
      this.setState({
        notification: null
      });
    }, 2000);

  }

  handleChange(event){

    this.setState({

      newTodo:event.target.value

    });

  }

  generateTodoId(){
    const lastTodo = this.state.todos[ this.state.todos.length -1 ];
    
    if( lastTodo ){
      return lastTodo.id + 1;
    }

    return 1;
  }

  async addTodo(){

    const response = await axios.post(`${this.apiUrl}/todos/todos`,{
       name: this.state.newTodo
    });

   
    const todos = this.state.todos;

    todos.push(response.data);
    

    this.state.newTodo='';

    this.setState({
      todos:todos
    });

    this.alert('Todo added successfully');

  }

  async deleteTodo(index){
    
    const todos = this.state.todos;
    
    const todo = todos[index];

    await axios.delete(`${this.apiUrl}/todos/todos/${todo.id}`); 

    delete todos[index];

    this.setState({ todos:todos });

    this.alert('Todo deleted successfully');
  }

  editTodo(index){

    const todo = this.state.todos[index];

    this.setState({
      editing: true,
      newTodo: todo.name,
      editingIndex: index
    });

  }

  async updateTodo(){

    const todo = this.state.todos[this.state.editingIndex];

    const response = await axios.put(`${this.apiUrl}/todos/todos/${todo.id}`,{name: this.state.newTodo});

    todo.name = this.state.newTodo;

    const todos = this.state.todos;
    todos[this.state.editingIndex] = response.data;

    
    this.setState({ todos , editing:false , editingIndex:null, newTodo:'' });

    this.alert('Todo updating successfully');
  }

  render() {
    
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div className="container">

            {
              this.state.notification &&
              <div className="alert mt-3 alert-success">
                <p className="text-center">{ this.state.notification }</p>
              </div>
            }

            <input type="text" name="ToDo" className="my-4 form-control" value={this.state.newTodo} placeholder="Add Comment" onChange={this.handleChange}/>
            
            <button className="btn-info mb-3 form-control" 
              onClick={ this.state.editing ? this.updateTodo : this.addTodo }
              disabled={this.state.newTodo.length < 5 }
              >
              {this.state.editing ? 'Update Todo List' : 'Add Todo List'}

            </button>
            {
              this.state.loading &&
              <img src={loadingGift} alt="Loading" />
            }

            {
              (!this.state.editing || this.state.loading )&&
            
            <ul className="list-group" style={{color: "black"}}>

              {this.state.todos.map((item, index)=> {

                return <ListItem
                  key={item.id}
                  item={item}
                  editTodo={() => {this.editTodo(index);}}
                  deleteTodo={() => {this.deleteTodo(index);}} />;

              })}

            </ul>
          }
          </div>
         
        </header>
      </div>
    );
  }
}

export default App;
