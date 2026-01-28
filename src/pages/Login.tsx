import { Form, Input, Button, Card, Alert } from 'antd';
import { UserOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../api/axios';

interface LoginValues {
    email: string;
    password: string;
}

interface LoginResponse {
    access_token: string;
}

const Login = () => {
    const navigate = useNavigate();

    const { mutate: login, isPending, isError } = useMutation({
        mutationFn: async (values: LoginValues) => {
            const response = await api.post<LoginResponse>('/auth/login', values);
            return response.data;
        },
        onSuccess: (data, variables) => {
            console.log('Login successful:', data);
            if (data.access_token) {
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user_email', variables.email);
            }
            navigate(-1);
        },
    });

    const onFinish = (values: { email: string; password: string }) => {
        login(values);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 p-4 relative">
            <Button
                type="text"
                icon={<ArrowLeftOutlined style={{ fontSize: '24px' }} />}
                onClick={() => navigate(-1)}
                className="absolute top-8 left-8 text-blue-900 hover:bg-blue-200/50 hover:text-blue-700"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Card className="md:w-full max-w-lg w-[500px] shadow-xl rounded-2xl p-8 ">
                    <div className="text-center mb-10">
                        <Link to="/" className="flex flex-col items-center">
                            <span className="text-6xl font-black leading-none tracking-tighter text-blue-900">
                                POS
                            </span>
                            <span className="text-base font-bold tracking-[0.3em] text-blue-600 -mt-1">
                                APPLICATION
                            </span>
                        </Link>
                    </div>

                    {isError && (
                        <Alert
                            title="Login Failed"
                            description={'Please check your credentials.'}
                            type="error"
                            showIcon
                            className="mb-6"
                        />
                    )}

                    <Form
                        name="login"
                        onFinish={onFinish}
                        layout="vertical"
                        size="large"
                        requiredMark={false}
                        className="[&_.ant-form-item-explain-error]:text-base md:[&_.ant-form-item-explain-error]:text-lg!"
                    >
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: 'Please input your email!' },
                                { type: 'email', message: 'Please enter a valid email!' }
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined className="text-gray-400 text-base" />}
                                placeholder="Email"
                                className="rounded-lg py-3 text-lg border-blue-500! border!"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                            className="mb-8"
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-gray-400 text-base" />}
                                placeholder="Password"
                                className="rounded-lg py-3 text-lg border-blue-500! border!"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                loading={isPending}
                                className="rounded-lg h-14 text-lg font-bold"
                            >
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                    <p className="text-center text-gray-500 mt-4">Login with email and any password. But remember that password next time. No registration required.</p>
                </Card>
            </div>
        </div>
    );
};

export default Login;
