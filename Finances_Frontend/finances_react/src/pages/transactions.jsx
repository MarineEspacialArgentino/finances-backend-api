import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import { NumericFormat } from "react-number-format";


// Componente de página de transacciones
export default function TransactionsPage() {
    const navigate = useNavigate();
    const location = useLocation();
    // Obtener el id de la categoría desde la query string
    const searchParams = new URLSearchParams(location.search);
    const selectedCategory = searchParams.get("categoria");

    // Verificar si el usuario está autenticado
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    //  Estados para transacciones
    const [transactions, setTransactions] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [newAmount, setNewAmount] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    // Obtener transacciones desde la API
    const fetchTransactions = async () => {
        try {
            const response = await api.get("/transacciones/");
            // Filtrar por categoría si corresponde
            const filtered = selectedCategory
                ? response.data.filter((t) => String(t.category) === String(selectedCategory))
                : response.data;
            setTransactions(filtered);
        } catch (error) {
            console.error("Error al obtener transacciones:", error);
        } finally {
            setCargando(false);
        }
    };
    // Refrescar transacciones al cambiar la categoría seleccionada
    useEffect(() => {
        fetchTransactions();
        
    }, [selectedCategory]);
    // Manejar Agregar Transacciones
    const handleAddTransaction = async () => {
        try {
            setErrorMsg("");
            const amountNum = Number(newAmount);
            if (!selectedCategory) {
                setErrorMsg("Selecciona una categoría válida.");
                return;
            }
            
            if (!amountNum || amountNum <= 0) {
                setErrorMsg("El monto debe ser mayor a 0.");
                return;
            }
            
            const payload = {
                amount: amountNum,
                category: selectedCategory
            };
            // Incluir descripción si se proporciona
            if (newDescription) payload.description = newDescription;
            const response = await api.post("/transacciones/", payload);
            setTransactions([...transactions, response.data]);
            setNewAmount("");
            setNewDescription("");
        } catch (error) {
            console.error("Error al agregar transacción:", error);
            setErrorMsg("No se pudo agregar la transacción.");
        }
    };
    // Manejar Eliminar Transacciones
    const handleDeleteTransaction = async (id) => {
        try {
            await api.delete(`/transacciones/${id}/`);
            setTransactions(transactions.filter((transaction) => transaction.id !== id));
        } catch (error) {
            console.error("Error al eliminar transacción:", error);
        }
    };
    // Renderizado del componente
    return (
        <div className="container-fluid py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-md-12 col-lg-11 col-xl-10">
                    <div className="card shadow-lg p-5">
                        <div className="d-flex align-items-center mb-3">
                            <div className="d-flex align-items-center gap-2">
                                <button className="btn btn-sm btn-outline-secondary" onClick={() => navigate('/categorias')}>Volver a categorías</button>
                                <h2 className="mb-0">Transacciones</h2>
                            </div>
                        </div>
                {errorMsg && (
                    <div className="alert alert-danger" role="alert">{errorMsg}</div>
                )}
                {cargando ? (
                    <div className="text-center my-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-2">Cargando transacciones...</p>
                    </div>
                ) : (
                    <ul className="list-group mb-3">
                        {transactions.length === 0 ? (
                            <li className="list-group-item text-center text-muted">No hay transacciones</li>
                        ) : (
                            transactions.map((transaction) => (
                                <li key={transaction.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div className="d-flex flex-column">
                                        <span className="fw-bold">
                                            {/* Formatear monto */}
                                            <NumericFormat
                                                value={transaction.amount}
                                                displayType="text"
                                                thousandSeparator="," 
                                                decimalSeparator="."
                                                decimalScale={2}
                                                fixedDecimalScale
                                                prefix="$"
                                            />
                                        </span>
                                        {transaction.description && <span className="text-muted">{transaction.description}</span>}
                                        <span className="badge bg-light text-dark mt-1">{transaction.date}</span>
                                    </div>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteTransaction(transaction.id)}>
                                        Eliminar
                                    </button>
                                </li>
                            ))
                        )}
                    </ul>
                )}
                <div className="row g-2 align-items-center">
                    <div className="col-12 col-sm-4">
                        {/* Formatear monto */}
                        <NumericFormat
                            className="form-control"
                            value={newAmount}
                            onValueChange={(values) => setNewAmount(values.value)}
                            thousandSeparator="," 
                            decimalSeparator="."
                            decimalScale={2}
                            fixedDecimalScale
                            allowNegative={false}
                            placeholder="Monto"
                        />
                    </div>
                    <div className="col-12 col-sm-8">
                        <input
                            type="text"
                            className="form-control"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            placeholder="Descripción"
                        />
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-12">
                        <button className="btn btn-success w-100" onClick={handleAddTransaction} disabled={!newAmount || !selectedCategory}>Agregar</button>
                    </div>
                </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
    
