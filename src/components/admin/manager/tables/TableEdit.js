
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTableById, updateTable } from '../../service/tableService';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ConfirmationModal from './ConfirmationModal'; // Import modal component

// Define validation schema with Yup for only the state field
const validationSchema = Yup.object({
    state: Yup.string().required('State is required'),
});

const TableEdit = () => {
    const { tableId } = useParams();
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formValues, setFormValues] = useState(null);
    const [tableData, setTableData] = useState(null);

    useEffect(() => {
        const fetchTable = async () => {
            try {
                const data = await getTableById(tableId);
                setTableData(data);
                setInitialValues({
                    state: data.state, // Only set initial value for state
                });
            } catch (error) {
                console.error('Error fetching table information:', error);
                toast.error('Error fetching table information.');
            }
        };

        fetchTable();
    }, [tableId]);

    const handleSubmit = (values, { setSubmitting }) => {
        setFormValues(values);
        setShowModal(true);
        setSubmitting(false);
    };

    const handleConfirm = async () => {
        setShowModal(false);

        try {
            const updatedTablePayload = {
                ...tableData,
                state: formValues.state
            };
            await updateTable(tableId, updatedTablePayload);
            toast.success('Table updated successfully!');
            navigate('/admin/tables/list'); // Navigate to the table list page
        } catch (error) {
            console.error('Error updating table:', error);
            toast.error('Failed to update table.');
        }
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    if (!initialValues) return <p>Loading...</p>;

    return (
        <div className="main-content">
            <div className="section-body">
                <h2 className="section-title">Edit Table</h2>
                <div className="card-body">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form>
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
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Updating...' : 'Update'}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                show={showModal}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                message="Are you sure you want to update this table?"
            />
        </div>
    );
};

export default TableEdit;

