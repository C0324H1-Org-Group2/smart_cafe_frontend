import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../ManagerOrder.css';

const ServiceDetailModal = ({ show, handleClose, serviceDetails }) => {

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Thông tin sản phẩm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
    {serviceDetails ? (
        <>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <img src={serviceDetails.imageUrl && serviceDetails.imageUrl.startsWith('http') ? serviceDetails.imageUrl : `/images/${serviceDetails.imageUrl}`} alt={serviceDetails.serviceName} style={{width: '50%', height: 'auto'}}/>
            </div>
            <table className="table table-striped" style={{marginTop: '20px'}}>
                <tbody>
                    <tr>
                        <th>Service Name</th>
                        <td>{serviceDetails.serviceName}</td>
                    </tr>
                    <tr>
                        <th>Type</th>
                        <td>{serviceDetails.type.typeName}</td>
                    </tr>
                    <tr>
                        <th>Price</th>
                        <td>{serviceDetails.price.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        })}</td>
                    </tr>
                    <tr>
                        <th>Description</th>
                        <td colSpan="2">{serviceDetails.description}</td>
                    </tr>
                </tbody>
            </table>
        </>
    ) : (
        <p className="text-center">No Details Found</p>
    )}
</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" className="btn btn-primary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ServiceDetailModal;