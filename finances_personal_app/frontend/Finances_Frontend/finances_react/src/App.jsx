import Login from './pages/login';
import CategoryPage from './pages/category';
import TransactionsPage from './pages/transactions';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
	export default function App() {
		return (
			<BrowserRouter>
				   <Routes>			
					   <Route path="/" element={<Navigate to="/login" replace />} />
					   
					   <Route path="/login" element={<Login />} />
					   
					   <Route path="/categorias" element={<CategoryPage />} />
					   
					   <Route path="/transacciones" element={<TransactionsPage />} />
				   </Routes>
			</BrowserRouter>
		);
}
