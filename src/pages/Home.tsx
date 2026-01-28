import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Row, Col, Pagination, Spin, Alert, Input } from 'antd';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const { Search } = Input;

interface Product {
    id: number;
    name: string;
    sku: string;
    price: number;
}

interface ProductsResponse {
    data: Product[];
    total: number;
}

const fetchProducts = async (page: number, search: string): Promise<ProductsResponse> => {
    const url = search
        ? `/products/search?q=${search}&page=${page}&limit=9`
        : `/products?page=${page}&limit=9`;
    try {
        const response = await api.get(url);
        console.log('API Response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Fetch products error:', error);
        throw error;
    }
};

const Home = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const { data, isLoading, error } = useQuery({
        queryKey: ['products', currentPage, searchQuery],
        queryFn: () => fetchProducts(currentPage, searchQuery),
    });

    const onSearch = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };


    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="min-h-screen bg-gray-50/50">

            <main className="max-w-7xl mx-auto px-4 py-8">
                {isLoading && (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <Spin size="large" />
                    </div>
                )}

                {error && (
                    <Alert
                        title="Error"
                        description="Failed to load products. Please try again later."
                        type="error"
                        showIcon
                    />
                )}

                {data && data.data && Array.isArray(data.data) && (
                    <>
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex-1">
                                {searchQuery && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-6 bg-blue-500 rounded-full" />
                                        <span className="text-xl font-bold text-gray-800">
                                            Results ({data.total || 0})
                                        </span>
                                    </div>
                                )}
                            </div>
                            <Search
                                placeholder="Search product..."
                                onSearch={onSearch}
                                defaultValue={searchQuery}
                                allowClear
                                enterButton
                                size="large"
                                className="max-w-md w-full shadow-sm rounded-lg border-blue-500! border! [&_input]:border-blue-500!"
                                onChange={(e) => {
                                    if (!e.target.value) onSearch('');
                                }}
                            />
                        </div>
                        <Row gutter={[25, 25]}>
                            {data.data.map((product) => (
                                <Col xs={24} sm={12} md={8} key={product.id}>
                                    <Link to={`/product/${product.id}`} className="block h-full">
                                        <ProductCard
                                            name={product.name}
                                            sku={product.sku}
                                            price={product.price}
                                        />
                                    </Link>
                                </Col>
                            ))}
                        </Row>

                        <div className="flex justify-center mt-12 md:ml-72">
                            <Pagination
                                current={currentPage}
                                total={data.total || 0}
                                pageSize={9}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                                size='large'
                            />
                        </div>
                    </>
                )}
                {data && (!data.data || !Array.isArray(data.data)) && (
                    <Alert
                        title="Invalid Response"
                        description={`Unexpected data format. Received: ${JSON.stringify(data).substring(0, 100)}...`}
                        type="warning"
                        showIcon
                    />
                )}
            </main>
        </div>
    );
};

export default Home;
