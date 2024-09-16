import React, { useState, useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import '../ManagerOrder.css';
import ServiceDetailModal from "./ServiceDetailModal";
import {deleteService, getAllServicesIdDesc, getAllServicesIdDescNotDeleted} from "../../service/ServiceService";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Button, Modal} from "react-bootstrap";

const TableService = () => {


    const [allServices, setAllServices] = useState([]);
    const [services, setServices] = useState([]);
    const [page, setPage] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const itemsPerPage = 10;
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const totalPages = Math.ceil(allServices.length / itemsPerPage);
    const isLastPage = page >= totalPages - 1;
    const [showDeleted, setShowDeleted] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);






    useEffect(() => {
        const fetchData = async () => {
            let data;
            if (showDeleted) {
                data = await getAllServicesIdDesc(page);
            } else {
                data = await getAllServicesIdDescNotDeleted(page);
            }
            setAllServices(data);
        };

        fetchData();
    }, [page,showDeleted]);

    useEffect(() => {
        const startIndex = page * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const servicesForCurrentPage = allServices.slice(startIndex, endIndex);
        setServices(servicesForCurrentPage);
    }, [page, allServices]);

    const handleShowModal = (service) => {
        setSelectedService(service);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedService(null);
        setShowModal(false);
    };

    const handleSearch = () => {
        const filteredServices = allServices.filter(service =>
            service.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setServices(filteredServices);
    };
    const handleCreateClick = () => {
        navigate('/admin/service/add'); // Điều hướng đến trang tạo bàn
    };

    const handleShowDeleteModal = (service) => {
        setServiceToDelete(service);
        setShowDeleteModal(true);
    };


    const handleConfirmDelete = async () => {
        if (serviceToDelete) {
            await deleteService(serviceToDelete.serviceId);
            setShowDeleteModal(false);
            setServiceToDelete(null);
            // Refresh danh sách dịch vụ sau khi xóa
            const data = await getAllServicesIdDesc(page);
            setAllServices(data);
        }
    };


    return (
        <>
            <div className="main-content">
                <div className="section-body">
                    <h2 className="section-title">Service List</h2>
                    <div className="card-body">
                        <div className="d-flex justify-content-between mb-3">
                            <div className="d-flex align-items-center">
                                <button className="btn btn-success" onClick={handleCreateClick}>
                                    <i className="fas fa-plus"></i>Create Product
                                </button>
                                <button
                                    className={`btn ${showDeleted ? 'btn-secondary' : 'btn-success'} ml-2`}
                                    onClick={() => {
                                        setShowDeleted(!showDeleted);
                                    }}>
                                    {showDeleted ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            <div className="d-flex">
                                <input
                                    type="text"
                                    className="form-control mr-2"
                                    placeholder="Search by service name"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button className="btn btn-primary" onClick={handleSearch}>
                                    Search
                                </button>
                            </div>
                        </div>

                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-striped table-md">
                                    <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {services.map((service, index) => (
                                        <tr key={service.serviceId}>
                                            <td>{page * itemsPerPage + index + 1}</td>
                                            <td>{service.serviceName}</td>
                                            <td>{service.price.toLocaleString('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            })}</td>
                                            <td>
                                                <div className={`${service.isDelete}`}>
                                                    {service.isDelete === 'ACTIVE' ? 'Active' : 'Deleted'}
                                                </div>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-secondary"
                                                    onClick={() => handleShowModal(service)}>
                                                    <i className="fas fa-info-circle"></i>
                                                </button>
                                                <Link to={`/admin/service/update/${service.serviceId}`} className="btn btn-primary ml-2">
                                                    <i className="fas fa-edit"></i>
                                                </Link>
                                                {service.isDelete === 'ACTIVE' && (
                                                    <button
                                                        className="btn btn-danger"
                                                        onClick={() => handleShowDeleteModal(service)}>
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="card-footer text-right">
                            <nav className="d-inline-block">
                                <ul className="pagination mb-0">
                                    <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                                        <Link className="page-link" to="#" onClick={() => setPage(page - 1)} tabIndex="-1">
                                            <i className="fas fa-chevron-left"></i>
                                        </Link>
                                    </li>
                                    <li className="page-item active">
                                        <Link className="page-link" to="#">
                                            {page + 1} <span className="sr-only">(current)</span>
                                        </Link>
                                    </li>
                                    <li className={`page-item ${isLastPage ? 'disabled' : ''}`}>
                                        <Link
                                            className="page-link"
                                            to="#"
                                            onClick={() => !isLastPage && setPage(page + 1)}>
                                            <i className="fas fa-chevron-right"></i>
                                        </Link>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            <ServiceDetailModal
                show={showModal}
                handleClose={handleCloseModal}
                serviceDetails={selectedService}
            />
            {showDeleteModal && (
                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Xác nhận xóa</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Bạn có chắc chắn muốn xóa sản phẩm: {serviceToDelete?.serviceName} ?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                            Hủy
                        </Button>
                        <Button variant="danger" onClick={handleConfirmDelete}>
                            Xóa
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </>
    );
};

export default TableService;