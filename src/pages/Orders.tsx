import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Row, Col, Pagination, Spin, Alert, Card, Typography } from 'antd';
import api from '../api/axios';

const { Title, Text } = Typography;

interface OrderItem {
    id: number;
    product_name: string;
    product_sku: string;
    product_price: number;
    quantity: number;
    total_amount: number;
}

interface OrdersResponse {
    data: OrderItem[];
    total: number;
}

const fetchOrders = async (page: number): Promise<OrdersResponse> => {
    const response = await api.get(`/sales/orders?page=${page}&limit=6`);
    return response.data;
};

const Orders = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const { data, isLoading, error } = useQuery({
        queryKey: ['orders', currentPage],
        queryFn: () => fetchOrders(currentPage),
    });

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            <main className="max-w-6xl mx-auto px-4 py-8">
                <div className="mb-8 flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                    <Title level={2} className="mb-0! mt-0!">My Orders</Title>
                </div>

                {isLoading && (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <Spin size="large" />
                    </div>
                )}

                {error && (
                    <Alert
                        message="Error"
                        description="Failed to load orders. Please try again later."
                        type="error"
                        showIcon
                    />
                )}

                {data && (
                    <>
                        <Row gutter={[20, 20]}>
                            {data.data.map((order) => (
                                <Col xs={24} sm={12} md={8} key={order.id}>
                                    <Card
                                        className="rounded-xl shadow-sm hover:shadow-md transition-shadow border-none overflow-hidden"
                                        styles={{ body: { padding: 0 } }}
                                    >
                                        <div className="bg-blue-600 p-4 text-white">
                                            <div className="text-[11px] opacity-80 uppercase tracking-wider font-bold">Product SKU</div>
                                            <div className="font-mono text-lg">{order.product_sku}</div>
                                        </div>
                                        <div className="p-5 space-y-4">
                                            <div>
                                                <Text type="secondary" className="text-[11px] uppercase font-bold tracking-tight">Product Name</Text>
                                                <div className="text-lg font-bold truncate text-gray-800">{order.product_name}</div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 pt-1">
                                                <div>
                                                    <Text type="secondary" className="text-[11px] uppercase font-bold">Quantity</Text>
                                                    <div className="text-base font-bold">{order.quantity} units</div>
                                                </div>
                                                <div>
                                                    <Text type="secondary" className="text-[11px] uppercase font-bold text-right block">Unit Price</Text>
                                                    <div className="text-base font-bold text-right">${Number(order.product_price).toFixed(2)}</div>
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                                <Text className="text-sm font-medium text-gray-500">Total Amount</Text>
                                                <Text className="text-2xl font-black text-blue-600">${Number(order.total_amount).toFixed(2)}</Text>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        {data.data.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
                                <Text type="secondary" className="text-lg">You haven't placed any orders yet.</Text>
                            </div>
                        )}

                        <div className="flex justify-center mt-12">
                            <Pagination
                                current={currentPage}
                                total={data.total}
                                pageSize={6}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                                size='large'
                            />
                        </div>
                    </>
                )}
            </main>
        </div >
    );
};

export default Orders;
