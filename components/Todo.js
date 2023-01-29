import React, { useEffect, useState,useRef }  from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db, storage } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import { uid } from "uid";
import { set, ref, onValue, remove, update } from "firebase/database";
import "./login.css";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from '@mui/icons-material/Logout';
import CheckIcon from '@mui/icons-material/Check';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';

function Todo() {
  const [todo, setTodo] = useState("");
  const [filter, setFilter] = useState("All");
  const [tag, setTag] = useState("Unchecked");
  const [todos, setTodos] = useState([]);
  const [foundTodos, setFoundTodos] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [tempUidd, setTempUidd] = useState("");
  const [name, setName] = useState('');
  const [found, setFound] = useState(false);
  const navigate = useNavigate();
  const [checked, setChecked] = React.useState("All");

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // read
        onValue(ref(db, `/${auth.currentUser.uid}`), (snapshot) => {
          setTodos([]);
          const data = snapshot.val();
          if (data !== null) {
            Object.values(data).map((todo) => {
              setTodos((oldArray) => [...oldArray, todo]);
              setFoundTodos((oldArray) => [...oldArray, todo]);
            });
          }
        });
      } else if (!user) {
        navigate("/");
      }
    });
  }, []);


  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        alert(err.message);
      });

  };

  // add
  const writeToDatabase = () => {
    const uidd = uid();
    set(ref(db, `/${auth.currentUser.uid}/${uidd}`), {
      todo: todo,
      tag: tag,
      uidd: uidd
    });

    setTodo("");
  };
  const [foundTodo, setFoundTodo] = useState(todos);

  // update
  const handleUpdate = (todo) => {
    setIsEdit(true);
    setTodo(todo.todo);
    setTempUidd(todo.uidd);
  };

  const handleEditConfirm = () => {
    update(ref(db, `/${auth.currentUser.uid}/${tempUidd}`), {
      todo: todo,
      tempUidd: tempUidd
    });

    setTodo("");
    setFoundTodos(todos);
    setIsEdit(false);
  };

  const handleFilter = (filter) => {
      setChecked(filter);
      setName("Filtering");
      if(filter=="All"){
         setFoundTodos(todos);
      }else if(filter=="Checked"){
        const results = todos.filter((todo) => {
           return todo.tag=="Checked";
        });
        setFoundTodos(results);
      }else if(filter=="Unchecked"){
        const results = todos.filter((todo) => {
           return todo.tag=="Unchecked";
        });
        setFoundTodos(results);
      }
  };

  const handleChecked = (todo) => {
        setTag("Checked");
        update(ref(db, `/${auth.currentUser.uid}/${todo.uidd}`), {
          tag: tag
        });
      setName("Filtering");
      if(filter=="All"){
         setFoundTodos(todos);
      }else if(filter=="Checked"){
        const results = todos.filter((todo) => {
           return todo.tag=="Checked";
        });
        setFoundTodos(results);
      }else if(filter=="Unchecked"){
        const results = todos.filter((todo) => {
           return todo.tag=="Unchecked";
        });
        setFoundTodos(results);
      }
      setName("");
      {this.renderIcon()}   
  };

  const handleUnchecked = (todo) => {
        setTag("Unchecked");
        setTempUidd(todo.uidd);
        update(ref(db, `/${auth.currentUser.uid}/${todo.uidd}`), {
          tag: tag
        });
      setName("Filtering");
      if(filter=="All"){
         setFoundTodos(todos);
      }else if(filter=="Checked"){
        const results = todos.filter((todo) => {
           return todo.tag=="Checked";
        });
        setFoundTodos(results);
      }else if(filter=="Unchecked"){
        const results = todos.filter((todo) => {
           return todo.tag=="Unchecked";
        });
        setFoundTodos(results);
      }
      setName("");
      {this.renderIcon()}   
  };

  // delete
  const handleDelete = (uid) => {
    remove(ref(db, `/${auth.currentUser.uid}/${uid}`));
  };

  const handleInput = (e) => {
    const keyword = e.target.value;
    if (keyword !== '') {
      const results = todos.filter((todo) => {
        return todo.todo.toLowerCase().startsWith(keyword.toLowerCase());
      });
      setFoundTodos(results);
    }
    setName(keyword);
  };
  return (
    <div className="todos">
      <input
        className="add-edit-input"
        type="text"
        placeholder="Add todo..."
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
      />
      <input
        className="search"
        type="search"
        placeholder="Search Todo"
        onChange={handleInput}
      />
      <div>
      <span className="checkbox">All</span>
      <input
        className="checkbox"
        type="checkbox"
        checked={checked === "All"}
        onChange={() => handleFilter("All")}
      />
      <span className="checkbox">Checked</span>
      <input
        className="checkbox"
        type="checkbox"
        checked={checked === "Checked"}
        onChange={() => handleFilter("Checked")}
      />
      <span className="checkbox">Unchecked</span>
      <input
        className="checkbox"
        type="checkbox"
        checked={checked === "Unchecked"}
        onChange={() => handleFilter("Unchecked")}
      />
      </div>
      { todos.length > 0 && name!='' ? (foundTodos.map((todo) => (

        <div className="todo" >
        <a
          href={'https://firebasestorage.googleapis.com/v0/b/todo-b8e25.appspot.com/o/files%2F'+todo.uidd+'.png?alt=media'} download="file" target="_blank" download>
        <img src={'https://firebasestorage.googleapis.com/v0/b/todo-b8e25.appspot.com/o/files%2F'+todo.uidd+'.png?alt=media'} width="100" height="50"         
         onError={(e) =>
             (e.target.onerror = null)(
               (e.target.src =
                  "https://img.freepik.com/free-vector/red-prohibited-sign-no-icon-warning-stop-symbol-safety-danger-isolated-vector-illustration_56104-912.jpg?w=1480&t=st=1675002635~exp=1675003235~hmac=7fe71b4622737f79b66603be169dbf836cb54bbd1dbec406a926e7b38753ac46")
               )
            }
         /></a>
         <h1 style={{textDecoration: todo.tag!="Checked" ? "line-through" : "none" }}>{todo.todo}</h1>
         <Popup trigger={<button className="upload">Upload Image</button>} position="right center">
             <iframe src={'/todoimage?todo:'+todo.uidd+''} width="100%" height="100%" scrolling="no" frameBorder="0" />
          </Popup>

          <EditIcon
            fontSize="large"
            onClick={() => handleUpdate(todo)}
            className="edit-button"
          />
          <DeleteIcon
            fontSize="large"
            onClick={() => handleDelete(todo.uidd)}
            className="delete-button"
          />
          {todo.tag=="Checked" ? <CheckIcon
            fontSize="large"
            onClick={() => handleUnchecked(todo)}
            className="edit-button"
          />:<DoDisturbIcon
            fontSize="large"
            onClick={() => handleChecked(todo)}
            className="edit-button"
          />}
        </div>
          ))
        ) : (todos.map((todo) => (
        <div className="todo" >
        <a
          href={'https://firebasestorage.googleapis.com/v0/b/todo-b8e25.appspot.com/o/files%2F'+todo.uidd+'.png?alt=media'} download="file" target="_blank"
         download>
        <img src={'https://firebasestorage.googleapis.com/v0/b/todo-b8e25.appspot.com/o/files%2F'+todo.uidd+'.png?alt=media'} width="100" height="50"         
         onError={(e) =>
             (e.target.onerror = null)(
               (e.target.src =
                  "https://img.freepik.com/free-vector/red-prohibited-sign-no-icon-warning-stop-symbol-safety-danger-isolated-vector-illustration_56104-912.jpg?w=1480&t=st=1675002635~exp=1675003235~hmac=7fe71b4622737f79b66603be169dbf836cb54bbd1dbec406a926e7b38753ac46")
               )
            }
         /></a>
          <h1 style={{textDecoration: todo.tag!="Checked" ? "line-through" : "none" }}>{todo.todo}</h1>
           
          <Popup trigger={<button className="upload">Upload Image</button>} position="right center">
              <iframe src={'/todoimage?todo:'+todo.uidd+''} width="100%" height="100%" scrolling="no" frameBorder="0" />
          </Popup>
          <EditIcon
            fontSize="large"
            onClick={() => handleUpdate(todo)}
            className="edit-button"
          />
          <DeleteIcon
            fontSize="large"
            onClick={() => handleDelete(todo.uidd)}
            className="delete-button"
          />
          {todo.tag=="Checked" ? <CheckIcon
            fontSize="large"
            onClick={() => handleUnchecked(todo)}
            className="edit-button"
          />:<DoDisturbIcon
            fontSize="large"
            onClick={() => handleChecked(todo)}
            className="edit-button"
          />}
        </div>
          ))
        )}


      {isEdit ? (
        <div>
        <CheckIcon onClick={handleEditConfirm} className="add-confirm-icon"/>
        </div>
      ) : (
        <div>
          <AddIcon onClick={writeToDatabase} className="add-confirm-icon" />
        </div>
      )}
        <LogoutIcon onClick={handleSignOut} className="logout-icon" />
    </div>
  );
}

export default Todo;
