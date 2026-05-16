import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './ManagerOrder.css';

const OrderDetailModal = ({ show, handleClose, orderDetails, orderInfo }) => {
    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Order Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {orderInfo && (orderInfo.customerName || orderInfo.phone || orderInfo.address) && (
                    <div className="mb-4 p-3 bg-light rounded" style={{ borderLeft: '4px solid #6777ef' }}>
                        <h6 className="font-weight-bold mb-2">Thông tin giao hàng (Online)</h6>
                        {orderInfo.customerName && <div><strong>Khách hàng:</strong> {orderInfo.customerName}</div>}
                        {orderInfo.phone && <div><strong>Điện thoại:</strong> {orderInfo.phone}</div>}
                        {orderInfo.address && <div><strong>Địa chỉ:</strong> {orderInfo.address}</div>}
                    </div>
                )}
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>Service Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total Price</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orderDetails.length > 0 ? (
                        orderDetails.map((detail, index) => (
                            <tr key={index}>
                                <td>{detail.serviceName}</td>
                                <td>{detail.price.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})}</td>
                                <td>{detail.quantity}</td>
                                <td>{detail.totalPrice.toLocaleString('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                })}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">No Details Found</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" className="btn btn-primary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OrderDetailModal;
