import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom';
import { Layout, Menu, Button, Typography, Space, message } from 'antd';
import {
    PlusOutlined,
    UnorderedListOutlined,
    LineChartOutlined,
    LogoutOutlined,
    HomeOutlined
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_email');
        message.success('Logged out successfully');
        navigate('/');
    };

    const menuItems = [
        { key: '/admin/list', icon: <UnorderedListOutlined className="text-base md:text-[20px]" />, label: <span className="text-sm md:text-lg font-medium">Product List</span> },
        { key: '/admin/product/create', icon: <PlusOutlined className="text-base md:text-[20px]" />, label: <span className="text-sm md:text-lg font-medium">Create Product</span> },
        { key: '/admin/sales', icon: <LineChartOutlined className="text-base md:text-[20px]" />, label: <span className="text-sm md:text-lg font-medium">Sales List</span> },
    ];

    return (
        <Layout className="min-h-screen">
            <Sider width={250} breakpoint="lg" collapsedWidth="0" theme="light" className="shadow-md flex flex-col">
                <div className="p-6 text-center">
                    <div className="inline-block border-b-2 border-blue-500 pb-1">
                        <Title level={3} style={{ margin: 0, color: '#1677ff' }} className="font-black! text-lg md:text-3xl!">
                            Admin POS
                        </Title>
                    </div>
                </div>
                <Menu
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={({ key }) => navigate(key)}
                    className="border-none py-2 custom-admin-menu grow [&_.ant-menu-item]:mb-3!"
                />
                <div className="px-6 py-6 mt-10 border-t border-gray-100 mb-4">
                    <Button
                        icon={<LogoutOutlined />}
                        block
                        danger
                        size="large"
                        onClick={handleLogout}
                        className="h-10 md:h-12 font-bold text-xs md:text-lg!"
                    >
                        Logout
                    </Button>
                </div>
            </Sider>
            <Layout>
                <Header className="bg-blue-500! flex items-center justify-end px-10 shadow-sm">
                    <Space size={40}>
                        <Link to="/">
                            <Button
                                icon={<HomeOutlined className="text-lg! text-center!" />}
                                type="primary"
                                ghost
                                className="border-white! border-2! text-white! font-bold! px-6!"
                            >
                                Home
                            </Button>
                        </Link>
                    </Space>
                </Header>
                <Content className="m-6 p-6 bg-white rounded-xl shadow-sm min-h-[280px]">
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
