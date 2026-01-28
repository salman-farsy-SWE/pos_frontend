import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Typography, Button, Spin, Alert, InputNumber, message } from 'antd';
import { ArrowLeftOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useState } from 'react';
import api from '../api/axios';

const { Title, Text } = Typography;

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState<number>(1);

    const { data, isLoading, error } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const response = await api.get(`/products/${id}`);
            return response.data;
        },
        enabled: !!id,
    });

    const product = data?.data;

    const { mutate: buyProduct, isPending: isBuying } = useMutation({
        mutationFn: async () => {
            const response = await api.post('/sales', {
                product_sku: product.sku,
                quantity: quantity,
            });
            return response.data;
        },
        onSuccess: () => {
            message.success('Purchase successful!', 2);
            setTimeout(() => {
                navigate('/');
            }, 1000);
        },
        onError: (err: { response?: { data?: { message?: string } } }) => {
            message.error(err.response?.data?.message || 'Failed to complete purchase. Please try again.');
        },
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 flex-col gap-4">
                <Alert
                    title="Error"
                    description="Failed to load product details."
                    type="error"
                    showIcon
                />
                <Button onClick={() => navigate(-1)}>Go Back</Button>
            </div>
        );
    }

    const handleQuantityChange = (value: number | null) => {
        if (value) setQuantity(value);
    };


    return (
        <div className="min-h-screen flex justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl p-8 relative overflow-hidden">
                <Button
                    icon={<ArrowLeftOutlined />}
                    type="text"
                    className="absolute top-6 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                    size="large"
                    onClick={() => navigate(-1)}
                />

                <div className="grid md:grid-cols-2 gap-12 mt-8">
                    <div className="flex flex-col justify-center space-y-4 pl-8">
                        <div>
                            <Text type="secondary" className="text-lg! font-medium tracking-wide text-gray-500 uppercase block mb-1">
                                SKU: {product.sku}
                            </Text>
                            <Title level={1} className="text-5xl! font-bold! text-gray-900! mb-2! mt-2!">
                                {product.name}
                            </Title>
                            <Text strong className="text-4xl! text-blue-600 block mt-8">
                                ${Number(product.price).toFixed(2)}
                            </Text>
                        </div>
                    </div>

                    {/* Right Column: Actions */}
                    <div className="flex flex-col justify-center space-y-8 border-l border-gray-100 pl-12">
                        <div>
                            <Text type="secondary" className="block text-base! font-medium text-gray-500 mb-1">Stock Available</Text>
                            <div className="flex items-baseline space-x-2">
                                <Text strong className="text-3xl! text-gray-800">{product.stock_quantity}</Text>
                                <Text type="secondary" className="text-lg!">units</Text>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Text strong className="block text-base! text-gray-700">Quantity</Text>
                            <InputNumber<number>
                                min={1 as number}
                                max={product.stock_quantity as number}
                                value={quantity}
                                onChange={handleQuantityChange}
                                size="large"
                                className="w-full rounded-lg border-blue-500! border! hover:border-blue-600! focus:border-blue-600!"
                                style={{ width: '100%' }}
                            />
                            <Button
                                type="primary"
                                size="large"
                                icon={<ShoppingCartOutlined />}
                                block
                                className="rounded-lg bg-blue-600 hover:bg-blue-500 h-12 text-lg font-bold shadow-lg shadow-blue-200 mt-4"
                                loading={isBuying}
                                disabled={product?.stock_quantity <= 0}
                                onClick={() => {
                                    const token = localStorage.getItem('token');
                                    if (!token) {
                                        message.info('Please login to buy this product');
                                        navigate('/login');
                                        return;
                                    }
                                    buyProduct();
                                }}
                            >
                                {product.stock_quantity > 0 ? 'Buy Now' : 'Out of Stock'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
