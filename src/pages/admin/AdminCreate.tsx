import { Typography, Card, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import ProductForm from './components/ProductForm';

const { Title } = Typography;

interface ProductCreateValues {
    name: string;
    sku: string;
    price: number;
    stock_quantity: number;
}

const AdminCreate = () => {
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: async (values: ProductCreateValues) => {
            return await api.post('/products', values);
        },
        onSuccess: () => {
            message.success('Product created successfully!');
            navigate('/admin/list');
        },
        onError: () => {
            message.error('Failed to create product.');
        }
    });

    const onFinish = (values: ProductCreateValues) => {
        mutation.mutate(values);
    };

    return (
        <div className="max-w-2xl py-4">
            <Card
                className="shadow-md rounded-2xl border-gray-100 overflow-hidden"
                title={
                    <div className="flex items-center gap-3 py-1">
                        <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                        <Title level={4} style={{ margin: 0 }} className="font-black! text-lg md:text-xl!">Create Product</Title>
                    </div>
                }
            >
                <ProductForm
                    onFinish={onFinish}
                    loading={mutation.isPending}
                    submitText="Create"
                />
            </Card>
        </div>
    );
};

export default AdminCreate;
