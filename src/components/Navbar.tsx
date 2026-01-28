import { useState, useEffect } from 'react';
import { Button, Drawer, Space, Typography, Dropdown } from 'antd';
import { MenuOutlined, UserOutlined, LogoutOutlined, ShoppingOutlined, DownOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

const { Text } = Typography;

interface NavButtonsProps {
    vertical?: boolean;
    userEmail: string | null;
    handleLogout: () => void;
    onClose: () => void;
    navigate: (path: string) => void;
}

const NavButtons = ({ vertical = false, userEmail, handleLogout, onClose, navigate }: NavButtonsProps) => (
    <Space orientation={vertical ? 'vertical' : 'horizontal'} className={vertical ? 'w-full px-4' : ''} size={vertical ? 'middle' : 'large'}>
        <Link to="/admin/list" onClick={onClose}>
            <Button
                className={`w-full bg-yellow-500 text-black hover:bg-yellow-300 font-bold border-none h-10 ${vertical ? 'mb-4' : ''}`}
            >
                Admin Panel
            </Button>
        </Link>

        {userEmail ? (
            vertical ? (
                <div className="w-full space-y-4">
                    <div className="px-4 py-2 bg-blue-50 rounded-lg">
                        <Text className="text-black font-bold block truncate">
                            {userEmail}
                        </Text>
                    </div>
                    <Link to="/orders" onClick={onClose}>
                        <Button
                            icon={<ShoppingOutlined />}
                            className="w-full text-left font-bold h-10 mb-2"
                            type="default"
                        >
                            My Orders
                        </Button>
                    </Link>
                    <Button
                        type="primary"
                        danger
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                        className="w-full font-bold h-10"
                    >
                        Logout
                    </Button>
                </div>
            ) : (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: 'orders',
                                label: 'My Orders',
                                icon: <ShoppingOutlined />,
                                onClick: () => {
                                    navigate('/orders');
                                    onClose();
                                }
                            },
                            { type: 'divider' },
                            {
                                key: 'logout',
                                label: 'Logout',
                                icon: <LogoutOutlined />,
                                danger: true,
                                onClick: handleLogout
                            }
                        ]
                    }}
                    placement="bottomRight"
                    arrow
                >
                    <div className="flex items-center gap-2 cursor-pointer group bg-blue-700/50 px-4 py-2 rounded-xl border border-blue-400/30 hover:bg-blue-700 transition-colors">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <UserOutlined className="text-white" />
                        </div>
                        <div className="flex flex-col">
                            <Text className="text-white! text-xs opacity-70 leading-none">Logged in as</Text>
                            <Text className="text-white! font-bold leading-tight max-w-[120px] truncate">
                                {userEmail}
                            </Text>
                        </div>
                        <DownOutlined className="text-white! text-[10px] ml-1 opacity-70 group-hover:opacity-100 transition-opacity" />
                    </div>
                </Dropdown>
            )
        ) : (
            <Link to="/login" onClick={onClose}>
                <Button
                    type="default"
                    icon={<UserOutlined />}
                    className="w-full bg-white text-black hover:bg-gray-100 font-bold border-none h-10 px-6"
                >
                    Login
                </Button>
            </Link>
        )}
    </Space>
);

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(localStorage.getItem('user_email'));
    const navigate = useNavigate();

    useEffect(() => {
        const handleStorageChange = () => {
            setUserEmail(localStorage.getItem('user_email'));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const showDrawer = () => setOpen(true);
    const onClose = () => setOpen(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_email');
        setUserEmail(null);
        navigate('/');
        onClose();
    };

    return (
        <nav className="bg-blue-600 border-b border-blue-500 px-6 py-4 sticky top-0 z-50 shadow-md w-full">
            <div className="flex justify-between items-center max-w-[1600px] mx-auto">
                <Link to="/" className="flex flex-col select-none group">
                    <div className="flex flex-col leading-none">
                        <span className="text-4xl font-black tracking-tighter text-white group-hover:text-blue-200 transition-colors">
                            POS
                        </span>
                        <span className="text-sm font-bold tracking-[0.4em] text-blue-200 -mt-1 ml-1">
                            APPLICATION
                        </span>
                    </div>
                </Link>

                <div className="hidden md:block">
                    <NavButtons userEmail={userEmail} handleLogout={handleLogout} onClose={onClose} navigate={navigate} />
                </div>

                <div className="md:hidden">
                    <Button
                        type="text"
                        icon={<MenuOutlined style={{ fontSize: '24px', color: 'white' }} />}
                        onClick={showDrawer}
                        className="flex items-center justify-center hover:bg-black/10"
                    />
                </div>

                <Drawer
                    title={
                        <Link to="/" className="flex flex-col leading-none">
                            <span className="text-2xl font-black text-blue-600">POS</span>
                            <span className="text-sm font-bold tracking-widest text-blue-400">APPLICATION</span>
                        </Link>
                    }
                    placement="right"
                    onClose={onClose}
                    open={open}
                >
                    <NavButtons vertical userEmail={userEmail} handleLogout={handleLogout} onClose={onClose} navigate={navigate} />
                </Drawer>
            </div>
        </nav>
    );
};

export default Navbar;
