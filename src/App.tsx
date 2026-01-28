import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ProductDetail from './pages/ProductDetail';
import Orders from './pages/Orders';
import AdminLayout from './layouts/AdminLayout';
import MainLayout from './layouts/MainLayout';
import AdminGuard from './components/AdminGuard';
import UserGuard from './components/UserGuard';
import {
  AdminList,
  AdminCreate,
  AdminSales
} from './pages/admin/AdminPages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/orders" element={<UserGuard><Orders /></UserGuard>} />
        </Route>
        <Route path="/login" element={<Login />} />

        {/* Admin Dashboard (Nested) */}
        <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
          <Route path="list" element={<AdminList />} />
          <Route path="product/create" element={<AdminCreate />} />
          <Route path="sales" element={<AdminSales />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
