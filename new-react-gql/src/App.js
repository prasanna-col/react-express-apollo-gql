import React, { useEffect, useState } from 'react';
import './App.css';
import { useQuery, useMutation, gql } from '@apollo/client';
import { TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
// useQuery -- to get the data from server
// useMutation -- tp push data or update on server.
const READ_TODOS = gql`
  query todosData{
    todos {
      id
      text
      name
      phone
      completed
    }
  }
`;

const CREATE_TODO = gql`
  mutation CreateTodo(
      $text: String!
      $name: String!
      $phone: String!
    ) {
    createTodo(
      text: $text
      name: $name
      phone: $phone
    )
  }
`;

const REMOVE_TODO = gql`
  mutation RemoveTodo($id: String!) {
    removeTodo(id: $id)
  }
`;

const UPDATE_TODO = gql`
  mutation UpdateTodo(
    $id: String!
    $text: String!
    $name: String!
    $phone: String!
    ) {
    updateTodo(
      id: $id
      text: $text
      name: $name
      phone: $phone
      )
  }
`;

const UPDATE_TODOSTATUS = gql`
  mutation UpdateTodo($id: String!) {
    updateTodoStatus(id: $id)
  }
`;

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: theme.spacing(1),
  },
}));

function App() {



  const classes = useStyles();

  const { data, loading, error } = useQuery(READ_TODOS);
  const [addTodo] = useMutation(CREATE_TODO); //  Here createTodo is user defined
  const [deleteTodo] = useMutation(REMOVE_TODO); // deleteTodo is user defined, not to be same as in REMOVE_TODO.
  const [editTodo] = useMutation(UPDATE_TODO);
  const [updateTodoStaus] = useMutation(UPDATE_TODOSTATUS);

  const [name, setname] = useState("");
  const [phone, setPhone] = useState("");
  const [task, setTask] = useState("");

  useEffect(() => {
    console.log("update", data)
  }, [data])

  let input;

  var todoData = data?.todos




  const handleTask = (val, key) => {
    console.log("todoData", todoData)
    console.log("val", val, key)

    todoData[key].text = val
  }
  // console.log("data", data)

  if (loading) return <p>loading...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  return (
    <div className="app">

      <h3>Create New Todo (Task)</h3>


      <div className="flexContainer">
        <TextField required id="filled-basic" label="Name" variant="filled"
          value={name}
          onChange={(e) => { setname(e.target.value) }}
        />
        <TextField required id="filled-basic" label="Phone" variant="filled"
          value={phone}
          onChange={(e) => { setPhone(e.target.value) }}
        />
        <TextField required multiline maxRows={4} id="filled-basic" label="Task" variant="filled"
          value={task}
          onChange={(e) => { setTask(e.target.value) }}
        />
        <Button
          style={{ width: "30%" }}
          variant="contained"
          color="primary"
          size="small"
          className={classes.button}
          onClick={() => {
            var createdata = {
              text: task,
              name: name,
              phone: phone
            }
            // console.log("createdata", createdata)
            addTodo({ variables: createdata });
            window.location.reload(); // to refresh the page
          }}
        >
          Save
      </Button>
      </div>

      <ul>

        <h3>List data (Read)</h3>

        {todoData.map((todo, key) => {
          // console.log("data.todos[key].text", data.todos[key].text)
          return (
            <div className={todo.completed ? "listContainer completedBg" : "listContainer pendingBg"}>

              <span className={todo.completed ? "taskCompleted" : "taskNotCompleted"}>Assigned to: {todo.name}</span>

              {
                todo.completed ?
                  <span className={todo.completed ? "taskCompleted" : "taskNotCompleted"}>Task: {todo.text}</span> :
                  <TextField required multiline maxRows={4} id="filled-basic" label="Task" variant="filled"
                    value={todo.text}

                    onChange={(e) => {
                      handleTask(e.target.value, key)
                      // todoData[key].text =  e.target.value
                      // console.log("txt --"+ e.target.value)
                    }}

                  />
              }


              <div className="listBtnContainer">
                <Button style={{}} color="primary" variant="contained" size="small" className={classes.button}
                  onClick={() => {
                    var data = {
                      id: todo.id,
                      text: todo.text,
                      name: todo.name,
                      phone: todo.phone
                    }

                    editTodo({ variables: data });

                    window.location.reload();
                  }}
                >
                  {"Update task"}
                </Button>

                <Button style={{ marginLeft: '5%' }} variant="contained" color="secondary" size="small" className={classes.button}
                  onClick={() => {
                    console.log("secondary")
                    deleteTodo({ variables: { id: todo.id } });
                    window.location.reload();
                  }}
                >
                  {"Delete"}
                </Button>

                <Button style={{ marginLeft: '5%', backgroundColor: todo.completed ? "gold" : "red", color: "#fff" }} variant="contained" size="small" className={classes.button}
                  onClick={() => {
                    var data = {
                      id: todo.id,
                      text: todo.text,
                      name: todo.name,
                      phone: todo.phone
                    }
                    // editTodo({ variables: data });
                    updateTodoStaus({ variables: { id: todo.id } })
                    window.location.reload();
                  }}
                >
                  {todo.completed ? "Task Completed " : "Complete task"}
                </Button>
              </div>


            </div>
          )
        }
        )}
      </ul>
    </div>
  );
}

export default App;