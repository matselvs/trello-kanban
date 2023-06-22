import React, { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/form/input";
import "./style-cadastro.css";

type Register = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

const Cadastro: React.FC = () => {
  const [registerData, setRegisterData] = useState<Register>({
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });

  const handleCadastro = async () => {
    try {
      const response = await fetch("https://arnia-kanban.vercel.app/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });
  
      if (response.ok) {
        await response.json();
        
        const localServerResponse = await fetch("http://localhost:3000/api/user/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registerData),
        });
  
        if (localServerResponse.ok) {
          alert("Usuário cadastrado com sucesso!");
          setRegisterData({
            name: "",
            email: "",
            password: "",
            passwordConfirmation: "",
          });
        } else {
          throw new Error("Erro ao cadastrar usuário no local server.");
        }
      } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Erro ao cadastrar usuário.");
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro ao cadastrar usuário.";
      alert(errorMessage);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setRegisterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <form>
      <div className="login-container">
        <h1>Arnia Trello</h1>
        <h3>Cadastro</h3>
        <div className="form-group">
          <Input
            label="Nome Completo"
            name="name"
            value={registerData.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <Input
            label="E-mail"
            name="email"
            value={registerData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <Input
            label="Senha"
            name="password"
            value={registerData.password}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <Input
            label="Confirmar Senha"
            name="passwordConfirmation"
            value={registerData.passwordConfirmation}
            onChange={handleInputChange}
          />
        </div>
        <Link to={"/"} onClick={handleCadastro} className="cadastro-link">
          CADASTRO
        </Link>
      </div>
    </form>
  );
};

export default Cadastro;
