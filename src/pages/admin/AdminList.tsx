import { Typography, Table, Space, Button, Input, Modal, message } from 'antd';
import type { TableProps } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import api from '../../api/axios';
import ProductForm from './components/ProductForm';

const { Title } = Typography;
const { Search } = Input;

interface Product {
    id: number;
    name: string;
    sku: string;
    price: number;
    stock_quantity: number;
}

const AdminList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['products', currentPage, searchQuery],
        queryFn: async () => {
            const url = searchQuery
                ? `/products/search?q=${searchQuery}&page=${currentPage}&limit=9`
                : `/products?page=${currentPage}&limit=9`;
            const response = await api.get(url);
            return response.data;
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (values: Partial<Product>) => {
            return await api.patch(`/products/${editingProduct?.id}`, values);
        },
        onSuccess: () => {
            message.success('Product updated successfully!');
            setIsEditModalOpen(false);
            setEditingProduct(null);
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: () => {
            message.error('Failed to update product.');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            return await api.delete(`/products/${id}`);
        },
        onSuccess: () => {
            message.success('Product deleted successfully!');
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: () => {
            message.error('Failed to delete product.');
        }
    });

    const onSearch = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsEditModalOpen(true);
    };

    const columns: TableProps<Product>['columns'] = [
        {
            title: <span className="text-sm md:text-xl">ID</span>,
            dataIndex: 'id',
            key: 'id',
            width: 100,
            render: (id: number) => <span className="text-xs md:text-lg">{id}</span>
        },
        {
            title: <span className="text-sm md:text-xl">Name</span>,
            dataIndex: 'name',
            key: 'name',
            className: 'font-bold text-gray-700',
            render: (name: string) => <span className="text-sm md:text-lg font-bold">{name}</span>
        },
        {
            title: <span className="text-sm md:text-xl">SKU</span>,
            dataIndex: 'sku',
            key: 'sku',
            className: 'font-mono',
            render: (sku: string) => <span className="font-mono text-xs md:text-lg">{sku}</span>
        },
        {
            title: <span className="text-sm md:text-xl">Stock in</span>,
            dataIndex: 'stock_quantity',
            key: 'stock_quantity',
            render: (stock: number) => (
                <span className="text-xs md:text-lg">{stock}</span>
            )
        },
        {
            title: <span className="text-sm md:text-xl">Price</span>,
            dataIndex: 'price',
            key: 'price',
            render: (price: number | string) => (
                <span className="text-xs md:text-lg text-black">${Number(price).toFixed(2)}</span>
            )
        },
        {
            title: <span className="text-sm md:text-xl">Actions</span>,
            key: 'actions',
            width: 280,
            render: (_: void, record: Product) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        ghost
                        icon={<EditOutlined className="text-base! md:text-xl!" />}
                        onClick={() => handleEdit(record)}
                        className="border-blue-200! h-8 w-8 md:h-20 md:w-20 flex items-center justify-center"
                    />
                    <Button
                        danger
                        ghost
                        icon={<DeleteOutlined className="text-base! md:text-xl!" />}
                        onClick={() => deleteMutation.mutate(record.id)}
                        loading={deleteMutation.isPending && deleteMutation.variables === record.id}
                        className="border-red-200! h-8 w-8 md:h-20 md:w-20 flex items-center justify-center"
                    />
                </Space>
            ),
        },
    ];

    return (
        <div className="space-y-6" >
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-50">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                    <Title level={4} style={{ margin: 0 }} className="font-black!">Product Inventory</Title>
                </div>
                <div className="flex flex-col md:flex-row items-end gap-4 md:items-center">
                    <Search
                        placeholder="Search product..."
                        onSearch={onSearch}
                        defaultValue={searchQuery}
                        allowClear
                        enterButton
                        className="md:w-[350px]! w-full! max-w-md! shadow-sm border-blue-500! border! rounded-lg"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            if (!e.target.value) onSearch('');
                        }}
                    />
                    <Link to="/admin/product/create">
                        <Button type="primary" icon={<PlusOutlined />} size="large" className="font-bold shadow-md shadow-blue-100">
                            Create Product
                        </Button>
                    </Link>
                </div>
            </div>

            <Table
                dataSource={data?.data}
                columns={columns}
                rowKey="id"
                loading={isLoading}
                className="shadow-sm rounded-xl overflow-hidden border border-gray-100"
                pagination={{
                    current: currentPage,
                    total: data?.total,
                    pageSize: 9,
                    onChange: (page) => setCurrentPage(page),
                    showSizeChanger: false,
                    position: ['bottomCenter'],
                    className: 'py-4',
                    size: 'middle'
                }}
            />

            <Modal
                title={
                    <div className="flex items-center gap-3 py-1">
                        <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                        <Title level={4} style={{ margin: 0 }} className="font-black!">Edit Product</Title>
                    </div>
                }
                open={isEditModalOpen}
                onCancel={() => {
                    setIsEditModalOpen(false);
                    setEditingProduct(null);
                }}
                footer={null}
                centered
                destroyOnClose
                width={600}
                className="[&_.ant-modal-content]:rounded-3xl"
            >
                {editingProduct && (
                    <ProductForm
                        onFinish={(values) => updateMutation.mutate(values)}
                        loading={updateMutation.isPending}
                        initialValues={editingProduct}
                        submitText="Edit"
                    />
                )}
            </Modal>
        </div >
    );
};

export default AdminList;
