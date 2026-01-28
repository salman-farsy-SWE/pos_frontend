import { Form, Input, InputNumber, Button, Space } from 'antd';

interface ProductFormValues {
    name: string;
    sku: string;
    price: number;
    stock_quantity: number;
}

interface ProductFormProps {
    onFinish: (values: ProductFormValues) => void;
    loading?: boolean;
    initialValues?: Partial<ProductFormValues>;
    submitText?: string;
}

const ProductForm = ({ onFinish, loading, initialValues, submitText = 'Submit' }: ProductFormProps) => {
    const [form] = Form.useForm();

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={initialValues}
            requiredMark="optional"
            size="large"
            className="[&_.ant-form-item-explain-error]:text-base md:[&_.ant-form-item-explain-error]:text-lg!"
        >
            <Form.Item
                label={<span className="font-bold md:text-lg text-base text-gray-700">Product Name</span>}
                name="name"
                rules={[{ required: true, message: 'Please enter product name' }]}
            >
                <Input placeholder="Enter product name..." className="rounded-xl! border-blue-400! hover:border-blue-500! focus:border-blue-600! shadow-sm!" />
            </Form.Item>

            <Form.Item
                label={<span className="font-bold md:text-lg text-base text-gray-700">SKU Code</span>}
                name="sku"
                rules={[{ required: true, message: 'Please enter SKU code' }]}
            >
                <Input placeholder="Enter product sku..." className="font-mono rounded-xl! border-blue-400! hover:border-blue-500! focus:border-blue-600! shadow-sm!" />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form.Item
                    label={<span className="font-bold md:text-lg text-base text-gray-700">Price ($)</span>}
                    name="price"
                    rules={[{ required: true, message: 'Please enter price' }]}
                >
                    <InputNumber<number>
                        className="w-full! rounded-xl! border-blue-400! hover:border-blue-500! focus:border-blue-600! shadow-sm!"
                        min={0 as number}
                        step={0.01 as number}
                        placeholder="0.00"
                        formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => Number(value?.replace(/\$\s?|(,*)/g, ''))}
                    />
                </Form.Item>

                <Form.Item
                    label={<span className="font-bold md:text-lg text-base text-gray-700">Stock Quantity</span>}
                    name="stock_quantity"
                    rules={[{ required: true, message: 'Please enter stock quantity' }]}
                >
                    <InputNumber<number>
                        className="w-full! rounded-xl! border-blue-400! hover:border-blue-500! focus:border-blue-600! shadow-sm!"
                        min={0 as number}
                        placeholder="0"
                    />
                </Form.Item>
            </div>

            <Form.Item className="mb-0 mt-8 pt-4 border-t border-gray-50 text-right">
                <Space size="middle">
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="rounded-xl! px-12! h-12! font-bold! bg-blue-500! hover:bg-blue-600! shadow-lg! shadow-blue-100! text-sm! md:text-lg!"
                    >
                        {submitText}
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default ProductForm;
