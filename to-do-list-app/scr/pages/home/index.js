import "bootstrap/dist/css/bootstrap.min.css";
import * as Icon from "react-bootstrap-icons";
import { use, useState } from "react";
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConnection";

function Home() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	async function handleLogin(e) {
		e.preventDefault();

		if (email !== "" && password !== "") {
			await signInWithEmailAndPassword(auth, email, password)
				.then(() => {
					navigate("/admin", { replace: true });
				})
				.catch((error) => {
					console.log("ERROR: " + error);
				});
		} else {
			alert("Preencha todos os campos!");
		}
	}

	return (
		<div className="container mt-5">
			<div className="row justify-content-center">
				<div className="col-md-6">
					<h1 className="text-center">
						<Icon.CardChecklist
							className="me-3"
							color="royalblue"
							size={"38"}
						/>
						To Do List
					</h1>

					<div className="card shadow mt-5">
						<div className="card-header text-center">
							<h4>Login</h4>
						</div>

						<div className="card-body">
							<form onSubmit={handleLogin}>
								<div className="mb-3">
									<label className="form-label">E-mail</label>
									<input
										type="email"
										className="form-control"
										placeholder="Digite seu e-mail"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</div>
								<div className="mb-3">
									<label className="form-label">Senha</label>
									<input
										type="password"
										className="form-control"
										placeholder="Digite sua senha"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
									/>
								</div>
								<button type="submit" className="btn btn-primary w-100">
									Entrar
								</button>
							</form>

							<p className="text-center mt-3">
								{"Ainda não tem uma conta? "}
								<Link to="/Register">Cadastre-se.</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Home;
