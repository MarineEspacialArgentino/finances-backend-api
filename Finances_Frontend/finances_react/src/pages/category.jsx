import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";

// Componente de página de categorías
export default function CategoryPage() {
    const navigate = useNavigate();
    // Verificar si el usuario está autenticado
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);
    

    //  Estados para categorías
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [categoryType, setCategoryType] = useState("expense");
    const [cargando, setCargando] = useState(true);

    // Obtener categorías desde la API
    const fetchCategories = async () => {
        try {
            const response = await api.get("/categorias/");
            setCategories(response.data);
        } catch (error) {
            console.error("Error al obtener categorías:", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Manejar Agregar Categorias
    const handleAddCategory = async () => {
        try {
            const response = await api.post("/categorias/", { name: newCategory, type: categoryType });
            setCategories([...categories, response.data]);
            setNewCategory("");
            setCategoryType("expense");
            return response;
        } catch (error) {
            console.error("Error al agregar categoría:", error);
        }
    };
    // Manejar Eliminar Categorias
    const handleDeleteCategory = async (id) => {
        try {
            await api.delete(`/categorias/${id}/`);
            setCategories(categories.filter((category) => category.id !== id));
        } catch (error) {
            console.error("Error al eliminar categoría:", error);
        }
    };
    // Renderizado del componente
    return (
        <div className="container-fluid py-4 px-2 px-md-3">
            <div className="card shadow-lg p-4 p-md-5 w-100">
                        <h2 className="mb-4 text-center">Categorías</h2>
                        <div className="row g-2 align-items-center">
                            <div className="col-12 col-sm-6">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    placeholder="Nueva categoría"
                                />
                            </div>
                            <div className="col-12 col-sm-6 col-md-4">
                                <select
                                    className="form-select"
                                    value={categoryType}
                                    onChange={(e) => setCategoryType(e.target.value)}
                                >
                                    <option value="income">Ingreso</option>
                                    <option value="expense">Gasto</option>
                                </select>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12">
                                <button className="btn btn-success w-100" onClick={handleAddCategory} disabled={!newCategory.trim()}>Agregar</button>
                            </div>
                        </div>
                        {cargando ? (
                            <div className="text-center my-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                                <p className="mt-2">Cargando categorías...</p>
                            </div>
                        ) : (
                            <ul className="list-group mb-3">
                                {categories.length === 0 ? (
                                    <li className="list-group-item text-center text-muted">No hay categorías</li>
                                ) : (
                                    categories.map((category) => (
                                        <li key={category.id} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="fw-semibold">{category.name}</span>
                                                <span className={`badge ${category.type === 'income' ? 'bg-success' : 'bg-danger'}`}>{category.type === 'income' ? 'Ingreso' : 'Gasto'}</span>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => navigate(`/transacciones?categoria=${category.id}`)}
                                                >
                                                    Ver transacciones
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDeleteCategory(category.id)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </li>
                                    ))
                                )}
                            </ul>
                        )}
            </div>
        </div>
    );
}



