import { Card, Typography } from 'antd';

const { Text, Title } = Typography;

interface ProductCardProps {
    name: string;
    sku: string;
    price: number;
}

const ProductCard = ({ name, sku, price }: ProductCardProps) => {
    return (
        <div className="h-full p-[2px] rounded-xl bg-linear-to-br from-blue-100 to-blue-300 shadow-sm hover:shadow-md transition-shadow">
            <Card
                hoverable
                className="h-full rounded-[10px] border-none"
                styles={{ body: { padding: '16px' } }}
            >
                <div className="space-y-2">
                    <Text type="secondary" className="block text-sm">SKU: {sku}</Text>
                    <Title level={5} className="mb-2 line-clamp-2">{name}</Title>
                    <Text strong className="block text-lg text-blue-600">${Number(price).toFixed(2)}</Text>
                </div>
            </Card>
        </div>
    );
};

export default ProductCard;
