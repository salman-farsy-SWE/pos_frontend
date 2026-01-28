import { Typography, Table, Input } from 'antd';
import type { TableProps } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../../api/axios';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Search } = Input;

interface Sale {
    id: number;
    user_email: string;
    product_name: string;
    product_sku: string;
    product_price: number;
    quantity: number;
    total_amount: number;
    created_at: string;
}

const AdminSales = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const pageSize = 9;

    const { data, isLoading } = useQuery({
        queryKey: ['admin-sales', currentPage, searchQuery],
        queryFn: async () => {
            const url = searchQuery
                ? `/sales/search?q=${searchQuery}&page=${currentPage}&limit=${pageSize}`
                : `/sales?page=${currentPage}&limit=${pageSize}`;
            const response = await api.get(url);
            return response.data;
        },
    });

    const onSearch = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const columns: TableProps<Sale>['columns'] = [
        {
            title: <span className="text-sm md:text-xl text-black">Email</span>,
            dataIndex: 'user_email',
            key: 'user_email',
            render: (email: string) => <span className="text-xs md:text-lg text-black">{email}</span>
        },
        {
            title: <span className="text-sm md:text-xl text-black">Product</span>,
            dataIndex: 'product_name',
            key: 'product_name',
            render: (name: string) => <span className="text-sm md:text-lg font-semibold text-black">{name}</span>
        },
        {
            title: <span className="text-sm md:text-xl text-black">SKU</span>,
            dataIndex: 'product_sku',
            key: 'product_sku',
            render: (sku: string) => <span className="text-xs md:text-lg font-mono text-black">{sku}</span>
        },
        {
            title: <span className="text-sm md:text-xl text-black">Price</span>,
            dataIndex: 'product_price',
            key: 'product_price',
            render: (price: number | string) => <span className="text-xs md:text-lg text-black">${Number(price).toFixed(2)}</span>
        },
        {
            title: <span className="text-sm md:text-xl text-black">Qty</span>,
            dataIndex: 'quantity',
            key: 'quantity',
            render: (qty: number) => <span className="text-xs md:text-lg text-black">{qty}</span>
        },
        {
            title: <span className="text-sm md:text-xl text-black">Total</span>,
            dataIndex: 'total_amount',
            key: 'total_amount',
            render: (total: number | string) => <span className="text-sm md:text-lg font-semibold text-black">${Number(total).toFixed(2)}</span>
        },
        {
            title: <span className="text-sm md:text-xl text-black">Date</span>,
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date: string) => (
                <span className="text-xs md:text-lg text-black">
                    {dayjs(date).format('MMM DD, YYYY')}
                </span>
            )
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-50">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                    <Title level={4} style={{ margin: 0 }} className="font-black!">Sales Records</Title>
                </div>
                <div className="flex flex-col md:flex-row items-end gap-4 md:items-center">
                    <Search
                        placeholder="Search sales..."
                        onSearch={onSearch}
                        defaultValue={searchQuery}
                        allowClear
                        enterButton
                        className="md:w-[400px]! w-full! max-w-md! shadow-sm border-blue-500! border! rounded-lg"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            if (!e.target.value) onSearch('');
                        }}
                    />
                </div>
            </div>

            <Table<Sale>
                dataSource={data?.data}
                columns={columns}
                rowKey="id"
                loading={isLoading}
                className="shadow-sm rounded-xl overflow-hidden border border-gray-100"
                pagination={{
                    current: currentPage,
                    total: data?.total,
                    pageSize: pageSize,
                    onChange: (page) => setCurrentPage(page),
                    showSizeChanger: false,
                    position: ['bottomCenter'],
                    className: 'py-4',
                    size: 'middle'
                }}
            />
        </div>
    );
};

export default AdminSales;
