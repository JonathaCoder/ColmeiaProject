import React from "react";
import Header from "../../components/Header";
import { Link } from 'react-router-dom';
import { HiMiniArrowLeft } from "react-icons/hi2";
import axios from "axios";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { HiArchiveBoxXMark, HiOutlinePencil } from "react-icons/hi2";
import { Table } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CiSearch } from "react-icons/ci";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Example from "../../components/Navigate";
import { CircularProgress } from '@mui/material';
import { HiArrowDownTray } from "react-icons/hi2";
import { useState, useEffect} from "react";
import Tooltip from '@mui/material/Tooltip';
import { RxEnter } from "react-icons/rx";





export default function Exit(args){
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [valorValue, setValor] = useState("");
  const [ProcedimentoValue, setProcedimento] = useState("");
  const [dateValue, setDate] = useState("");
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [editingClient, setEditingClient] = useState(null);
  const [valueId, setID] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [totalClients, setTotalClients] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const toggleCreateModal = () => setCreateModal(!createModal);
  const toggleEditModal = () => setEditModal(!editModal);
  const [value, setValue] = React.useState(0);


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    axios.get("http://localhost:3000/create").then((response) => {
      setTodos(response.data);
      setFilteredTodos(response.data);
      setTotalClients(response.data.length);
    })
    .finally(() => {
      setIsLoading(false);
    });
  }, []);

  async function CreateTodo() {
    if (
      nameValue.length <= 0 ||
      emailValue.length <= 0 ||
      ProcedimentoValue.length <= 0 ||
      valorValue.length <= 0 ||
      dateValue.length <= 0
    ) {
      return toast.error("Preencha Todos os Campos");
    }
    try {
      const response = await axios.post("http://localhost:3000/create", {
        id: valueId,
        name: nameValue,
        email: emailValue,
        valor: parseInt(valorValue),
        procedimento: ProcedimentoValue,
        data: dateValue,
      });

      toast.success("Criado com sucesso");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {}
  }

  const openEditModal = (client) => {
    setEditingClient(client);
    setEditModal(true);
  };

  const closeEditModal = () => {
    setEditingClient(null);
    setEditModal(false);
  };

  const handleUpdate = async () => {
    if (editingClient) {
      try {
        await axios.put(`http://localhost:3000/create/${editingClient.id}`, {
          id: editingClient.id,
          name: editingClient.name,
          email: editingClient.email,
          procedimento: editingClient.procedimento,
          valor: editingClient.valor,
          data: editingClient.data,
        });

        setEditingClient(null);
        toast.success("Editado com sucesso");

        setEditModal(false);

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        console.error("Error updating client:", error);
      }
    }
  };

  async function deleteTodo(id) {
    await axios.delete(`http://localhost:3000/create/${id}`);
    toast.success("deletado com sucesso");
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

  useEffect(() => {
    const filtered = todos.filter((todo) =>
      todo.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTodos(filtered);
  }, [searchTerm, todos]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    axios.get("http://localhost:3000/create").then((response) => {
      setTodos(response.data);
      setFilteredTodos(response.data.slice(0, itemsPerPage));
    });
  }, [itemsPerPage]);

  const onPageChange = (page) => {
    setCurrentPage(page);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setFilteredTodos(todos.slice(startIndex, endIndex));
  };

  //Dowload

  const generateReportData = () => {
    const reportData = todos.map((todo) => ({
      id: todo.id,
      name: todo.name,
      email: todo.email,
      procedimento: todo.procedimento,
      valor: todo.valor,
      data: todo.data,
    }));

    return reportData;
  };

  const downloadReport = () => {
    const reportData = generateReportData();
try {
  toast.success('O Dowload Sera iniciado')
  const csvContent =
      "data:text/xlsx;charset=utf-8," +
      "ID,Name,Email,Procedimento,Valor,Data\n" +
      reportData.map((row) => Object.values(row).join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/xlsx" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "client_report.xlsx";
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
} catch (error) {
  toast.error('Error ao Fazer Dowload')
}
    
  };

  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };


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
 
      {isLoading ? (
       
        <div className="loading-container">
          <div className="LoadingConteudo">
          
          <CircularProgress />

          <h1>carregando..</h1>
          </div>
        </div>
      ) : (
       
       <>
      <Header />
      <div>
      <Link to='/estoque' open={open} onClose={handleClose} onOpen={handleOpen} title="Voltar">  
      
      <Tooltip >
    <HiMiniArrowLeft className="iconVoltar" />
    </Tooltip>
    </Link>
      </div>
      
      <div className="containerBtn">
      
        <div className="search">
          <CiSearch />
          <input
            type="text"
            className="inputSearch"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar Nome"
          />
     <Button variant="Entrada" href="/entrada" color="info" className="entrada-exit">
     <RxEnter />  Entrada
      </Button>
         
          <Button className="btnDownload" color="info" outline onClick={downloadReport}>
          <HiArrowDownTray />  Baixar Relatorio
          </Button>
          <Button
            className="btnAdd"
            color="warning"
            onClick={toggleCreateModal}
          >
            Cadaster +
          </Button>
          <Modal isOpen={createModal} toggle={toggleCreateModal} {...args}>
            <ModalHeader toggle={toggleCreateModal}>+ New Client</ModalHeader>
            <ModalBody className="form">
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
                  label="Nome"
                  variant="outlined"
                  onChange={(e) => setNameValue(e.target.value)}
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
                  label="Email"
                  variant="outlined"
                  onChange={(e) => setEmailValue(e.target.value)}
                  required
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
                  label="Procedimento"
                  variant="outlined"
                  onChange={(e) => setProcedimento(e.target.value)}
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
                  id="standard-number"
                  label="Number"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="$"
                  variant="standard"
                  onChange={(e) => setValor(e.target.value)}
                />
              </Box>

              <input
                type="date"
                className="inputDate"
                onChange={(e) => setDate(e.target.value)}
              ></input>
            </ModalBody>
            <ModalFooter>
              <Button color="warning" onClick={CreateTodo}>
                + Create
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
      <div>
        <Modal isOpen={editModal} toggle={toggleEditModal} {...args}>
          <ModalHeader toggle={toggleEditModal}>Edit Client</ModalHeader>
          <ModalBody className="form">
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
                label="Nome"
                variant="outlined"
                value={editingClient ? editingClient.name : ""}
                onChange={(e) =>
                  setEditingClient({ ...editingClient, name: e.target.value })
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
                label="Email"
                variant="outlined"
                value={editingClient ? editingClient.email : ""}
                onChange={(e) =>
                  setEditingClient({ ...editingClient, email: e.target.value })
                }
                required
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
                label="Procedimento"
                variant="outlined"
                value={editingClient ? editingClient.procedimento : ""}
                onChange={(e) =>
                  setEditingClient({
                    ...editingClient,
                    procedimento: e.target.value,
                  })
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
                id="standard-number"
                label="Number"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder="$"
                variant="standard"
                value={editingClient ? editingClient.valor : ""}
                onChange={(e) =>
                  setEditingClient({ ...editingClient, valor: e.target.value })
                }
              />
            </Box>

            <input
              type="date"
              className="inputDate"
              value={editingClient ? editingClient.data : ""}
              onChange={(e) =>
                setEditingClient({ ...editingClient, data: e.target.value })
              }
            ></input>
          </ModalBody>
          <ModalFooter>
            <Button color="warning" onClick={handleUpdate}>
              Editar
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
              <th>Email</th>
              <th>Procedimento</th>
              <th>Valor</th>
              <th>Data</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTodos.map((todo, index) => (
              <tr key={index}>
                <th scope="row">{todo.id}</th>
                <td>{todo.name}</td>
                <td>{todo.email}</td>
                <td>{todo.procedimento}</td>
                <td>{todo.valor}</td>
                <td>{todo.data}</td>
                <td>
                  <Button
                    color="danger"
                    onClick={() => deleteTodo(todo.id)}
                    className="excluir"
                  >
                    <HiArchiveBoxXMark />
                  </Button>
                  <Button
                    color="warning"
                    onClick={() => openEditModal(todo)}
                    className="editar"
                  >
                    <HiOutlinePencil />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div>
          <p>
            <strong>Total de Clientes</strong> {totalClients}
          </p>
        </div>
      </div>
      <Example
        totalPages={Math.ceil(todos.length / itemsPerPage)}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
      
</>
      )}
    </div>
  );

}