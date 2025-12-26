import "bootstrap/dist/css/bootstrap.min.css";
import * as Icon from "react-bootstrap-icons";
import { use, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebaseConnection";
import { signOut } from "firebase/auth";
import {
	collection,
	addDoc,
	orderBy,
	query,
	where,
	onSnapshot,
	deleteDoc,
	doc,
	updateDoc,
} from "firebase/firestore";

function Admin() {
	const [taskInput, setTaskInput] = useState("");
	const [user, setUser] = useState({});
	const [tarefas, setTarefas] = useState([]);
	const [edit, setEdit] = useState({});

	useEffect(() => {
		async function loadTasks() {
			const userDetail = localStorage.getItem("@detailUser");
			setUser(JSON.parse(userDetail));

			if (userDetail) {
				const data = JSON.parse(userDetail);

				const tarefaRef = collection(db, "tarefas");

				const q = query(
					tarefaRef,
					orderBy("created", "desc"),
					where("userUid", "==", data?.uid)
				);
				const unsub = onSnapshot(q, (snapshot) => {
					let lista = [];
					snapshot.forEach((doc) => {
						lista.push({
							id: doc.id,
							...doc.data(),
							// tarefa: doc.data().tarefa,
							// userUid: doc.data().userUid,
						});
					});

					setTarefas(lista);
				});
			}
		}

		loadTasks();
	}, []);

	async function handleAddTask(e) {
		e.preventDefault();

		if (taskInput === "") {
			alert("Digite uma tarefa!");
			return;
		}

		if (edit?.id) {
			handleUpdateTask();
			return;
		}

		await addDoc(collection(db, "tarefas"), {
			tarefa: taskInput,
			created: new Date(),
			userUid: user?.uid,
		})
			.then(() => {
				setTaskInput("");
			})
			.catch((error) => {
				console.log("ERRO AO CADASTRAR TAREFA: " + error);
			});
	}

	async function checkTask(tarefa) {
		const docRef = doc(db, "tarefas", tarefa.id);

		await updateDoc(docRef, {
			completed: !tarefa.completed,
		});
	}

	async function deleteTask(id) {
		const docRef = doc(db, "tarefas", id);

		await deleteDoc(docRef);
	}

	async function editTask(item) {
		setTaskInput(item.tarefa);
		setEdit(item);
	}

	async function handleUpdateTask() {
		const docRef = doc(db, "tarefas", edit.id);

		await updateDoc(docRef, {
			tarefa: taskInput,
		})
			.then(() => {
				setTaskInput("");
				setEdit({});
			})
			.catch((error) => {
				console.log("ERRO AO ATUALIZAR TAREFA: " + error);
				setTaskInput("");
				setEdit({});
			});
	}

	async function handleLogout(e) {
		await signOut(auth);
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
							<h4>To Do</h4>
						</div>

						<div className="card-body">
							<div className="input-group mb-3">
								<input
									type="text"
									id="taskInput"
									className="form-control"
									placeholder="Adicionar nova tarefa"
									value={taskInput}
									onChange={(e) => setTaskInput(e.target.value)}
								/>
								{Object.keys(edit).length > 0 ? (
									<button
										className="btn btn-warning me-2"
										onClick={handleUpdateTask}
									>
										Atualizar
									</button>
								) : (
									<button className="btn btn-primary" onClick={handleAddTask}>
										Adicionar
									</button>
								)}
							</div>
							<ul className="list-group">
								{tarefas.map((item) => (
									<li
										key={item.id}
										className="list-group-item d-flex justify-content-between align-itens-center"
									>
										<span
											style={{
												textDecoration: item.completed
													? "line-through"
													: "none",
												color: item.completed ? "gray" : "black",
											}}
										>
											{item.tarefa}
										</span>
										<div>
											<button
												className="btn btn-warning btn-sm me-2"
												onClick={() => editTask(item)}
											>
												<Icon.PencilSquare />
											</button>
											<button
												className="btn btn-success btn-sm me-2"
												onClick={() => checkTask(item)}
											>
												{item.completed ? (
													<Icon.CheckSquareFill />
												) : (
													<Icon.CheckSquare />
												)}
											</button>
											<button
												className="btn btn-danger btn-sm me-2"
												onClick={() => deleteTask(item.id)}
											>
												<Icon.Trash3 />
											</button>
										</div>
									</li>
								))}
							</ul>
						</div>

						<div className="card-footer text-center">
							<button className="btn btn-danger mt-3" onClick={handleLogout}>
								<Icon.DoorClosed /> Sair
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Admin;
