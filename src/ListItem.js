import React from 'react';

const ListItem = (props) => {
  return (
    <li key={props.index} className="list-group-item">
      {props.item.name}
      <button className="btn-sm ml-4 btn btn-danger" onClick={ props.deleteTodo }>Delete</button>
      <button className="btn-sm ml-4 btn btn-success" onClick={ props.editTodo }>Update</button>  
    </li>
  );
};

export default ListItem;