import React from "react";
import Header from "../../components/Header";
import { useState,useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { HiOutlinePencil } from "react-icons/hi2";
import { Table } from "react-bootstrap";
import axios from "axios";
import { HiArrowSmUp } from "react-icons/hi";
import { HiArrowSmDown } from "react-icons/hi";
import { Link } from 'react-router-dom';
import { HiMiniArrowLeft } from "react-icons/hi2";
import { ToastContainer, toast } from "react-toastify";
import { CiSearch } from "react-icons/ci";

export default function Enter(args){
  const toggle = () => setModal(!modal);
  const [name,setName] = useState('');
  const [Quantidade,setQuantidade] = useState('')
  const [dataEntrada,setDataEntrada] = useState('')
  const [valorProduto,setValorProduto] = useState('')
  const [modal, setModal] = useState(false);
  const [ModalExit,setModalExit] = useState(false)
  const [Id,setId] = useState('');
  const [todos,setTodos] = useState([])
  const [arrowDownModal, setArrowDownModal] = useState(false);
  const [editingClient,setEditingClient] = useState(null)
  const [dataSaida,setDataSaida] = useState('')
  const [totalClients, setTotalClients] = useState(0);
  const [Tipo,setTipo] = useState('')
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState({
    name: '',
    valorProduto: 0,
    quantidade: '',
    dataEntrada: '',
    Tipo:''
  });
  

  const toggleModal = () => setModalExit(!ModalExit);

  const toggleArrowDownModal = (entry) => {
    setSelectedEntry(entry);
    setArrowDownModal(!arrowDownModal);
  };

  const toggleModalExit = () => {
    setName(selectedEntry.name);
    setQuantidade(selectedEntry.quantidade);
    setValorProduto(selectedEntry.valorProduto);
    setDataEntrada(selectedEntry.dataEntrada);
    setDataSaida(selectedEntry.dataSaida || ''); 
    setTipo(selectedEntry.Tipo);
    setModalExit(!ModalExit);
  };
  useEffect(() => {
    const filtered = todos.filter((todo) =>
    todo.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTodos(filtered);
  }, [searchTerm, todos]);
  
  useEffect(() => {
    axios.get("http://localhost:3000/entrada")
      .then((response) => {
        setTodos(response.data);
        setTotalClients(response.data.length)
   
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data. Please try again.");
     
      });
  }, []);
  async function CreateTodo() {
    if (name.length <= 0 || Quantidade.length <= 0 || valorProduto.length <= 0 || dataEntrada.length <= 0) {
      return toast.error('Preencha todos os Campos!');
    }

    try {
      const response = await axios.post('http://localhost:3000/entrada', {
        id: Id,
        name: name,
        quantidade: parseInt(Quantidade),
        valorProduto: parseInt(valorProduto),
        dataEntrada: dataEntrada,
        dataSaida: dataSaida,
        Tipo: Tipo,
      });

      setTodos((prevTodos) => [...prevTodos, response.data]); 
      toast.success('Criado com sucesso');
      toggle(); 

      
      setName('');
      setQuantidade('');
      setValorProduto('');
      setDataEntrada('');
      setDataSaida('');
      setTipo('');
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  }
  console.log(Tipo)
  const currencies = [
    {
      value: '',
      label: '',
    },
    {
      value: 'Entrada',
      label: 'Entrada',
    },
    {
      value: 'Saida',
      label: 'Saida',
    },
   
  ];

  const handleUpdate = async () => {
    if (editingClient) {
      try {
        await axios.put(`http://localhost:3000/entrada/${editingClient.id}`, {
          id: editingClient.id,
          name: editingClient.name,
          quantidade: parseInt(editingClient.quantidade),
          valorProduto: parseInt(editingClient.valorProduto),
          dataEntrada: editingClient.dataEntrada,
          dataSaida: editingClient.dataSaida,
          Tipo: editingClient.Tipo,
        });

        setTodos((prevTodos) =>
          prevTodos.map((todo) => (todo.id === editingClient.id ? editingClient : todo))
        ); 

        toast.success('Editado com sucesso');
        toggleModalExit(); 

     
        setEditingClient(null);
      } catch (error) {
        console.error('Error updating client:', error);
        toast.error('Erro ao editar o registro. Tente novamente.');
      }
    }
  }

  const saidasCount = todos.filter(entry => entry.Tipo === 'Saida').length;
  const entradasCount = todos.filter(entry => entry.Tipo === 'Entrada').length;

  return (
    <div>
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
        <Header/>
        <Link to='/estoque'  title="Voltar">  
      
    <HiMiniArrowLeft className="iconVoltar" />
   
    </Link>
    
    <div className="containerBtn">
    <CiSearch className="searchIcon" />
          <input
            type="text"
            className="inputSearch"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por Nome"
          />
      <Button color="warning" onClick={toggle} className="btnAdd">
        Add Entrada +
      </Button>
      <Modal isOpen={modal} toggle={toggle} {...args}>
        <ModalHeader toggle={toggle}>Modal title</ModalHeader>
        <ModalBody>
        <Box
                component="form"
                sx={{
                  "& > :not(style)": { m: 1, width: "25ch" },
                }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  id="outlined-basic"
                  label="Nome Produto"
                  variant="outlined"
                  onChange={(e) => setName(e.target.value)}
                />
              </Box>
              <Box
                component="form"
                sx={{
                  "& > :not(style)": { m: 1, width: "25ch" },
                }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  id="outlined-basic"
                  label="Valor Produto"
                  variant="outlined"
                  type="number"
                  required
                  onChange={(e)=> setValorProduto(e.target.value) }
                />
              </Box>
              <Box
                component="form"
                sx={{
                  "& > :not(style)": { m: 1, width: "25ch" },
                }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  id="outlined-basic"
                  label="Quantidade"
                  variant="outlined"
                  type="number"
                  onChange={(e)=> setQuantidade(e.target.value) }
                />
              </Box>
              <Box
                component="form"
                sx={{
                  "& > :not(style)": { m: 1, width: "25ch" },
                }}
                noValidate
                autoComplete="off"
              >
            
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  type="date"
                  onChange={(e)=> setDataEntrada(e.target.value) }
                />
              </Box>
            
              <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
       
        <TextField
          id="outlined-select-currency-native"
          select
          label="Status"
          defaultValue=""
          onChange={(e)=> setTipo(e.target.value)}
          SelectProps={{
            native: true,
          }}
          helperText="Selecione o status"
        >
          {currencies.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
      </div>
     
    </Box>
             
        </ModalBody>
        <ModalFooter>
          <Button color="warning" onClick={CreateTodo}>
          Add +
          </Button>
        </ModalFooter>
      </Modal>
    </div>

      <div className="tabela">
        <Table hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>Quantidade</th>
              <th>Valor Produto</th>
              <th>Data Entrada</th>
              <th>Data Saida</th>
              <th>status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
  {filteredTodos.map((entry) => (
    <tr key={entry.id}>
      <th scope="row">{entry.id}</th>
      <td>{entry.name}</td>
      <td>{entry.quantidade}</td>
      <td>R$: {entry.valorProduto}</td>
      <td>{entry.dataEntrada}</td>
      <td>{entry.dataSaida}</td>
   
      <td>
                  {entry.Tipo === "Entrada" ? (
                      <HiArrowSmUp className="iconEntrada" />
                    
                  ) : (
                    <HiArrowSmDown className="iconSaida" />
                  
                  )}
                  
       </td>

      <td>
      <Button
    color="info"
    className="exit"
    onClick={() => {
      toggleModalExit();
      setEditingClient(entry);
    }}
  >
    <HiArrowSmDown />
  </Button>
      
      </td>
    </tr>
  ))}
</tbody>

        </Table>
        <div className="camposContainer">
       <div className="campos">
  
     <strong>Entradas: {entradasCount}</strong> <HiArrowSmUp className="iconEntrada"/>
     
     
      
       </div>
       <div className="campos">
       <strong>Saidas: {saidasCount}</strong> <HiArrowSmDown className="iconSaida" />
       </div>
    </div>
      </div>

      <div className="ModalExit">
     
      <Modal isOpen={ModalExit} toggle={toggleModal} {...args}>
        <ModalHeader toggle={toggleModal}>Modal title</ModalHeader>
        <ModalBody>
        <Box
                component="form"
                sx={{
                  "& > :not(style)": { m: 1, width: "25ch" },
                }}
                noValidate
                autoComplete="off"
              >
                  <TextField
    id="outlined-basic"
    label="Nome Produto"
    variant="outlined"
    value={editingClient ? editingClient.name : ""}
    onChange={(e) =>
      setEditingClient((prevClient) => ({
        ...prevClient,
        name: e.target.value,
      }))
    }
  />
              </Box>
              <Box
                component="form"
                sx={{
                  "& > :not(style)": { m: 1, width: "25ch" },
                }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  id="outlined-basic"
                  label="Valor Produto"
                  variant="outlined"
                  type="number"
                  required
                  value={editingClient ? editingClient.valorProduto : ""}
                  onChange={(e) =>
                    setEditingClient((prevClient) => ({
                      ...prevClient,
                      valorProduto: e.target.value,
                    }))
                  }
                />
              </Box>
              <Box
                component="form"
                sx={{
                  "& > :not(style)": { m: 1, width: "25ch" },
                }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  id="outlined-basic"
                  label="Quantidade"
                  variant="outlined"
                  type="number"
                  value={editingClient ? editingClient.quantidade : ""}
                  onChange={(e) =>
                    setEditingClient((prevClient) => ({
                      ...prevClient,
                      quantidade: e.target.value,
                    }))
                  }
                />
              </Box>
              <Box
                component="form"
                sx={{
                  "& > :not(style)": { m: 1, width: "25ch" },
                }}
                noValidate
                autoComplete="off"
              >
                 <p>Data Entrada:</p>
                <TextField
                disabled
                  id="outlined-basic"
                  variant="outlined"
                 
                  value={editingClient ? editingClient.dataEntrada : ""}
                  onChange={(e) =>
                    setEditingClient((prevClient) => ({
                      ...prevClient,
                      dataEntrada: e.target.value,
                    }))
                  }
                />
              </Box>
              <Box
                component="form"
                sx={{
                  "& > :not(style)": { m: 1, width: "25ch" },
                }}
                noValidate
                autoComplete="off"
              >
                <p>Data Saida:</p>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  type="date"
                  value={editingClient ? editingClient.dataSaida : ""}
                  onChange={(e) =>
                    setEditingClient((prevClient) => ({
                      ...prevClient,
                      dataSaida: e.target.value,
                    }))
                  }
                />
              </Box>
              <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
       
      <TextField
  id="outlined-select-currency-native"
  select
  label="Status"
  defaultValue=""
  SelectProps={{
    native: true,
  }}
  helperText="Selecione o status"
  value={editingClient ? editingClient.Tipo : ""}
  onChange={(e) =>
    setEditingClient((prevClient) => ({
      ...prevClient,
      Tipo: e.target.value,
    }))
  }
>
  {currencies.map((option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ))}
</TextField>
      </div>
     
    </Box>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleUpdate}>
           Saida
          </Button>
         
        </ModalFooter>
      </Modal>
      
    </div>
     
    </div>
  )
}
