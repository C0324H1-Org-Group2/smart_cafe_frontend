import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {toast} from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {login} from "../services/Api";
import {hasRole} from "../manager/HasRole";

const LoginForm = () => {
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        username: Yup.string().required('Tên đăng nhập là bắt buộc'),
        password: Yup.string().required('Mật khẩu là bắt buộc'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await login(values); // Đăng nhập người dùng

            if (hasRole('ROLE_ADMIN')) {
                window.location.href = '/admin/users'; // Đường dẫn cho admin
            } else if (hasRole('ROLE_MANAGER')) {
                window.location.href = '/admin/home'; // Đường dẫn cho manager
            } else if (hasRole('ROLE_EMPLOYEE')) {
                window.location.href = '/admin/sell'; // Đường dẫn cho employee
            } else {
                toast.error('Vai trò không hợp lệ. Vui lòng kiểm tra lại quyền trong Database.');
            }

            toast.success('Đăng nhập thành công!');
        } catch (error) {
            toast.error('Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.');
        }
        setSubmitting(false);
    };

    return (
        <div id="app">
            <section className="section">
                <div className="container mt-5">
                    <div className="row">
                        <div className="col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4">
                            <div className="login-brand">
                                <img src="/assets/img/stisla-fill.svg" alt="logo" width="100" className="shadow-light rounded-circle" />
                            </div>

                            <div className="card card-primary">
                                <div className="card-header">
                                    <h4>Đăng Nhập</h4>
                                </div>

                                <div className="card-body">
                                    <Formik
                                        initialValues={{ username: '', password: '' }}
                                        validationSchema={validationSchema}
                                        onSubmit={handleSubmit}
                                    >
                                        {({ isSubmitting }) => (
                                            <Form className="login-form">
                                                <div className="form-group">
                                                    <label htmlFor="username">Tên đăng nhập</label>
                                                    <Field name="username" type="text" className="form-control" />
                                                    <ErrorMessage name="username" component="div" className="error-message" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="password">Mật khẩu</label>
                                                    <Field name="password" type="password" className="form-control" />
                                                    <ErrorMessage name="password" component="div" className="error-message" />
                                                </div>
                                                <div className="form-group">
                                                    <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={isSubmitting}>
                                                        Đăng Nhập
                                                    </button>
                                                </div>
                                                <div className="form-group text-center">
                                                    <a href="/admin/forgot-password" className="text-small">
                                                        Quên mật khẩu?
                                                    </a>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>

                                    <div className="text-center mt-4 mb-3">
                                        <div className="text-job text-muted">Login With Social</div>
                                    </div>
                                    <div className="row sm-gutters">
                                        <div className="col-6">
                                            <a className="btn btn-block btn-social btn-facebook">
                                                <span className="fab fa-facebook"></span> Facebook
                                            </a>
                                        </div>
                                        <div className="col-6">
                                            <a className="btn btn-block btn-social btn-twitter">
                                                <span className="fab fa-twitter"></span> Twitter
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="simple-footer">
                                CodeGym 2024
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LoginForm;
