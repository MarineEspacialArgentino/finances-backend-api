import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

// Componente de página de login
export default function Login() {
    // Estados para el Login
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    // Estados para el registro
    const [regUsername, setRegUsername] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [regMessage, setRegMessage] = useState("");

    // Navegación
    const navigate = useNavigate();

    // Manejar el Login
    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");
        try {
            // Obtener tokens JWT
            const { data } = await api.post("/token/", { username, password });
            localStorage.setItem("accessToken", data.access);
            localStorage.setItem("refreshToken", data.refresh);
            setIsLoggedIn(true);

            // Obtener datos del usuario autenticado
            const res = await api.get("/usuarios/");
            setUserData(res.data);
            setMessage("Login exitoso");
            // Redirigir a la página principal después del login
            navigate("/categorias");
        } catch (error) {
            console.error("Error de login:", error);
            setMessage("Credenciales inválidas o error en el servidor");
            setIsLoggedIn(false);
        }
    };

    // Manejar el Logout
    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsLoggedIn(false);
        setUserData(null);
        setMessage("Sesión cerrada");
    };

    // Manejar el Registro
    const handleRegister = async (e) => {
        e.preventDefault();
        setRegMessage("");
        try {
            const { data } = await api.post("/register/", {
                username: regUsername,
                password: regPassword,
            });
            setRegMessage(data.message || "Usuario registrado exitosamente");
            setRegUsername("");
            setRegPassword("");
        } catch (error) {
            setRegMessage("Error al registrar usuario");
        }
    };

    // Devuelve el JSX para la interfaz de login/registro
    return (
        <div className="container" style={{ maxWidth: 400, margin: "2rem auto" }}>
            <div className="card shadow-sm p-4">
                <h2 className="mb-4 text-center">Login</h2>
                {!isLoggedIn ? (
                    <>  
                        {/* Sección de login */}

                        <form onSubmit={handleLogin}>
                            <div className="mb-3">
                                <label className="form-label">Usuario</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    autoComplete="username"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Contraseña</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Entrar</button>
                        </form>
                        {message && <div className="alert alert-info mt-3">{message}</div>}
                        <hr className="my-4" />

                        {/* Sección de registro */}

                        <h3 className="mb-3 text-center">Registrar</h3>
                        <form onSubmit={handleRegister}>
                            <div className="mb-3">
                                <label className="form-label">Usuario</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={regUsername}
                                    onChange={(e) => setRegUsername(e.target.value)}
                                    autoComplete="username"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Contraseña</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={regPassword}
                                    onChange={(e) => setRegPassword(e.target.value)}
                                    autoComplete="new-password"
                                />
                            </div>
                            <button type="submit" className="btn btn-success w-100">Registrar</button>
                        </form>
                        {regMessage && <div className="alert alert-info mt-3">{regMessage}</div>}
                    </>
                ) : (
                    <div className="text-center">
                        <p>Sesión iniciada</p>
                        <button className="btn btn-danger" onClick={handleLogout}>Salir</button>
                    </div>
                )}
                {userData && (
                    <pre className="bg-light p-3 mt-3 border rounded">
                        {JSON.stringify(userData, null, 2)}
                    </pre>
                )}
            </div>
        </div>
    );
}

