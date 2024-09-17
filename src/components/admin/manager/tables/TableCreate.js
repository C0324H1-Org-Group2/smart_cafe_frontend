import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createTable } from '../../service/tableService'; // Đảm bảo đường dẫn đúng
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Định nghĩa schema xác thực với Yup
const validationSchema = Yup.object({
    code: Yup.string()
        .matches(/^TB\d+$/, 'Code must start with "TB" followed by numbers') // Biểu thức chính quy để kiểm tra định dạng
        .required('Code is required'),
    state: Yup.string()
        .required('State is required'),
    on: Yup.boolean()
});

const TableCreate = () => {
    const navigate = useNavigate();

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            // Gửi dữ liệu với đúng tên trường 'on'
            await createTable(values);
            toast.success('Table created successfully!');
            navigate('/admin/tables/list'); // Điều hướng về trang danh sách bảng
        } catch (error) {
            console.error('Error creating table:', error);
            toast.error('Failed to create table.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="main-content">
            <div className="section-body">
                <h2 className="section-title">Create Table</h2>
                <div className="card-body">
                    <Formik
                        initialValues={{ code: '', state: '', on: true }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <div className="form-group">
                                    <label htmlFor="code">Code</label>
                                    <Field
                                        type="text"
                                        className="form-control"
                                        id="code"
                                        name="code"
                                    />
                                    <ErrorMessage name="code" component="div" className="text-danger" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="state">State</label>
                                    <Field
                                        type="text"
                                        className="form-control"
                                        id="state"
                                        name="state"
                                    />
                                    <ErrorMessage name="state" component="div" className="text-danger" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="on">Status</label>
                                    <Field as="select" className="form-control" id="on" name="on">
                                        <option value={true}>On</option>
                                        <option value={false}>Off</option>
                                    </Field>
                                    <ErrorMessage name="on" component="div" className="text-danger" />
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Creating...' : 'Create'}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default TableCreate;
