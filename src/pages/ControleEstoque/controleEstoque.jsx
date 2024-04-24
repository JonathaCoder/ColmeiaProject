import Header from "../../components/Header";
import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
} from "reactstrap";
import { Link } from "react-router-dom";
import { HiMiniArrowLeft } from "react-icons/hi2";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { GoTrash, GoPencil } from "react-icons/go";
import { CiSearch } from "react-icons/ci";

function ControleEstoque(args) {
  const [modal, setModal] = useState(false);
  const [ProdName, setNomeProduto] = useState("");
  const [ProdValor, setValorProduto] = useState("");
  const [ProdQuantia, setQuantidade] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggle = () => setModal(!modal);
  const toggleEditModal = () => setEditModal(!editModal);

  const handleUpdate = async () => {
    if (editingProduct) {
      try {
        await axios.put(
          `http://localhost:3000/createEstoque/${editingProduct.id}`,
          {
            ProdName: editingProduct.ProdName,
            ProdValor: editingProduct.ProdValor,
            ProdQuantia: editingProduct.ProdQuantia,
          }
        );

        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === editingProduct.id ? editingProduct : todo
          )
        );

        toast.success("Produto editado com sucesso");
        setEditModal(false);
      } catch (error) {
        console.error("Error updating product:", error);
        toast.error("Erro ao editar o produto. Por favor, tente novamente.");
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/createEstoque/${id}`);

      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));

      toast.success("Produto excluído com sucesso");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Erro ao excluir o produto. Por favor, tente novamente.");
    }
  };

  const openEditModal = (todo) => {
    setEditingProduct(todo);
    setEditModal(true);
  };

  const handleCreate = async () => {
    try {
      if (
        ProdName.length <= 0 ||
        ProdValor.length <= 0 ||
        ProdQuantia.length <= 0
      ) {
        toast.error("Preencha todos os campos");
        return;
      }

      await axios.post("http://localhost:3000/createEstoque", {
        ProdName: ProdName,
        ProdValor: parseInt(ProdValor),
        ProdQuantia: parseInt(ProdQuantia),
      });

      toast.success("Produto criado com sucesso");

      fetchTodos();

      setNomeProduto("");
      setValorProduto("");
      setQuantidade("");

      toggle();
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Erro ao criar o produto.");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost:3000/createEstoque");
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Erro ao obter os dados. Por favor, tente novamente.");
    }
  };

  const filteredTodos = todos.filter((todo) =>
    todo.ProdName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <Header />
      <Link to="/estoque" title="Voltar">
        <HiMiniArrowLeft className="iconVoltar" />
      </Link>

      <div className="containerBtn">
        <div className="search-bar">
          <CiSearch />
          <input
            type="text"
            className="inputSearch"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar Nome"
          />
        </div>
        <Button color="warning" onClick={toggle} className="btnAdd">
          Adicionar Produto
        </Button>

        <Modal isOpen={modal} toggle={toggle} {...args}>
          <ModalHeader toggle={toggle}>Adicionar Produto</ModalHeader>
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
                value={ProdName}
                onChange={(e) => setNomeProduto(e.target.value)}
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
                value={ProdValor}
                onChange={(e) => setValorProduto(e.target.value)}
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
                value={ProdQuantia}
                onChange={(e) => setQuantidade(e.target.value)}
              />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button color="warning" onClick={handleCreate}>
              Adicionar Produto
            </Button>
          </ModalFooter>
        </Modal>
      </div>
      <div>
        <Modal isOpen={editModal} toggle={toggleEditModal} {...args}>
          <ModalHeader toggle={toggleEditModal}>Editar Produto</ModalHeader>
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
                label="Nome Produto"
                variant="outlined"
                value={editingProduct ? editingProduct.ProdName : ""}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    ProdName: e.target.value,
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
                label="Valor Produto"
                variant="outlined"
                type="number"
                required
                value={editingProduct ? editingProduct.ProdValor : ""}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    ProdValor: e.target.value,
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
                label="Quantidade"
                variant="outlined"
                type="number"
                value={editingProduct ? editingProduct.ProdQuantia : ""}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    ProdQuantia: e.target.value,
                  })
                }
              />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button color="warning" onClick={handleUpdate}>
              Salvar Alterações
            </Button>
          </ModalFooter>
        </Modal>
      </div>
      <div className="tabela">
        <Table hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Nome Produto</th>
              <th>Quantidade Produto</th>
              <th>Valor Produto</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTodos.map((todo, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{todo.ProdName}</td>
                <td>{todo.ProdQuantia}</td>
                <td>{todo.ProdValor}</td>
                <td>
                  <Button
                    color="danger"
                    className="excluir"
                    onClick={() => handleDelete(todo.id)}
                  >
                    <GoTrash />
                  </Button>
                  <Button
                    color="success"
                    className="editar"
                    onClick={() => openEditModal(todo)}
                  >
                    <GoPencil />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default ControleEstoque;
