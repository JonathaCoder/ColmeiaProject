import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { HiArchiveBoxXMark } from "react-icons/hi2";
import { GoRepoPush } from "react-icons/go";
import { Table } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CiSearch } from "react-icons/ci";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Example from "../../../components/Navigate";
import Header from "../../../components/Header";
import { CircularProgress } from "@mui/material";
import { HiArrowDownTray } from "react-icons/hi2";
import { MdAttachMoney } from "react-icons/md";
import { HiMiniArrowLeft } from "react-icons/hi2";
import { Link } from "react-router-dom";

function CampanhaForm(args) {
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

  useEffect(() => {
    try {
      axios
        .get("http://localhost:3000/create")
        .then((response) => {
          setTodos(response.data);
          setFilteredTodos(response.data);
          setTotalClients(response.data.length);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error) {}
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

    const existingClient = todos.find((client) => client.email === emailValue);

    if (existingClient) {
      return toast.error(
        "Cliente já possui procedimento marcado. Favor finalizar antes de marcar outro"
      );
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

      if (!response) {
        toast.error("Já existe um cliente com este e-mail");
        return;
      }

      toast.success("Criado com sucesso");

      setTodos((prevTodos) => [...prevTodos, response.data]);
      toggleCreateModal();

      setNameValue("");
      setEmailValue("");
      setProcedimento("");
      setValor("");
      setDate("");
    } catch (error) {
      console.error("Error creating client:", error);
      toast.error("Erro ao criar cliente");
    }
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

        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === editingClient.id ? editingClient : todo
          )
        );

        setEditModal(false);
      } catch (error) {
        console.error("Error updating client:", error);
      }
    }
  };

  async function deleteTodo(id) {
    await axios.delete(`http://localhost:3000/create/${id}`);
    toast.success("Deletado com Sucesso");

    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
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

  function dataAtualFormatada() {
    var data = new Date(),
      dia = data.getDate().toString(),
      diaF = dia.length == 1 ? "0" + dia : dia,
      mes = (data.getMonth() + 1).toString(),
      mesF = mes.length == 1 ? "0" + mes : mes,
      anoF = data.getFullYear();
    return diaF + "/" + mesF + "/" + anoF;
  }
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
      toast.success("O Dowload Sera iniciado");
      const csvContent =
        "ID, Name, Email, Procedimento, Valor, Data\n" +
        reportData.map((row) => Object.values(row).join(", ")).join("\n");

      const blob = new Blob([csvContent], { type: "text/xlsx" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "Relatorio.xlsx" + "  " + dataAtualFormatada();
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Error ao Fazer Dowload");
    }
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
          <Link to="/HomeUser" title="Voltar">
            <HiMiniArrowLeft className="iconVoltar" />
          </Link>
          <div className="containerBtn">
            <div className="search">
              <CiSearch />
              <input
                type="text"
                className="inputSearch"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar Campanhas"
              />
             
              <Modal isOpen={createModal} toggle={toggleCreateModal} {...args}>
                <ModalHeader toggle={toggleCreateModal}>
                  + New Client
                </ModalHeader>
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
                      id="outlined-basic"
                      label="Valor"
                      variant="outlined"
                      type="number"
                      onChange={(e) => setValor(e.target.value)}
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
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </Box>
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
              <ModalHeader toggle={toggleEditModal}>Remarcar</ModalHeader>
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
                      setEditingClient({
                        ...editingClient,
                        name: e.target.value,
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
                    id="outlined-basic"
                    label="Email"
                    variant="outlined"
                    value={editingClient ? editingClient.email : ""}
                    onChange={(e) =>
                      setEditingClient({
                        ...editingClient,
                        email: e.target.value,
                      })
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
                  id="outlined-basic"
                  label=""
                  variant="outlined"
                  type="number"
                  value={editingClient ? editingClient.valor : ""}
                  onChange={(e) =>
                    setEditingClient({
                      ...editingClient,
                      valor: e.target.value,
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
                  id="outlined-basic"
                  variant="outlined"
                  type="date"
                  value={editingClient ? editingClient.data : ""}
                  onChange={(e) =>
                    setEditingClient({ ...editingClient, data: e.target.value })
                  }
                />
              </Box>

              </ModalBody>
              <ModalFooter>
                <Button color="warning" onClick={handleUpdate}>
                  Remarcar Procedimento
                </Button>
              </ModalFooter>
            </Modal>
          </div>

          <div className="tabela">
            <Table hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nome Campanha</th>
                  <th>Tipo Campanha</th>
                  <th>Premiação</th>
                  <th>
                    Descrição 
                  </th>
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
                      <GoRepoPush />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div>
              <p className="valor">
                <strong>Total de Clientes: </strong> {totalClients}
                <p className="valorTotal">
                  <strong>Valor Total de Procedimentos: </strong>
                  {todos.reduce((total, todo) => total + todo.valor, 0)}
                </p>
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

export default CampanhaForm;
