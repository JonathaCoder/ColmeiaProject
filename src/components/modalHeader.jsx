import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { Button } from 'reactstrap';
import { BiClipboard } from "react-icons/bi";
import axios from 'axios';
import { FaPencilAlt } from "react-icons/fa";
import { GrClose } from "react-icons/gr";
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from "react-toastify";
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';

export default function ModalHeader() {
  const [msn, setMsn] = useState('');
  const [todos, setTodos] = useState([]);
  const [state, setState] = useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  async function mensagem() {
    try {
      if (msn.length <= 0) {
        toast.error('Preencha o campo');
        return;
      }

      const enviado = await axios.post("http://localhost:3000/text", {
        msn: msn
      });

      if (enviado) {
        toast.success('Enviado com sucesso');
      
        setTodos((prevTodos) => [...prevTodos, { id: Date.now(), msn: msn }]);
      
        setMsn('');
      }
    } catch (error) {
      toast.error('Erro no servidor');
    }
  }

  async function deleteTodo(id) {
    try {
      await axios.delete(`http://localhost:3000/text/${id}`);
      toast.success('Deletado com sucesso');
      
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error("Erro ao excluir");
    }
  }

  useEffect(() => {
    async function getTodos() {
      try {
        const response = await axios.get("http://localhost:3000/text");
        setTodos(response.data || []);
      } catch (error) {
        console.error("Error fetching todos:", error);
        toast.error("Error fetching todos");
        setTodos([]); 
      }
    }
    getTodos();
  }, []);

  const list = (anchor) => (
    <div>
      <div></div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className='container-Text'>
        <h1 className='title-Text'> <FaPencilAlt />Anotações:</h1>
        <textarea className='mensagemCamp' cols="30" rows="5" onChange={(e) => setMsn(e.target.value)} value={msn}></textarea>
        <Button color="warning" onClick={mensagem}>
          Salvar
        </Button>
      </div>
   
      <div>
        {todos.length === 0 ? (
          <div className='Loading'>
            <LinearProgress color="warning"/>
          </div>
        ) : (
          todos.map((todo) => (
            <div className='container-Text' key={todo.id}>
              <div className='textCamp'>
                <div className='iconeClose'>
                  <GrClose onClick={() => deleteTodo(todo.id)} />
                </div>
                <p>{todo.msn}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}><BiClipboard className="btn-agenda" /></Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
