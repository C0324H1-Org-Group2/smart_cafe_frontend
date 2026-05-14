import React, { useState, useEffect } from 'react';
import { Col, Row, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import QuantityModal from './QuantityModal'; // Import modal
import { useCart } from '../../../context/CartContext';
import { toast } from 'react-toastify';

const ListServiceByType = ({ services, handleAddToCart, currentPage, setCurrentPage, isTransitioning, setIsTransitioning, itemsPerPage, rangeValue }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    // Lọc dịch vụ theo giá
    const filteredServices = services.filter(service => service.price <= rangeValue);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentServices = filteredServices.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentPage(currentPage - 1);
                setIsTransitioning(false);
            }, 300);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentPage(currentPage + 1);
                setIsTransitioning(false);
            }, 300);
        }
    };

    const handlePageClick = (pageNumber) => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentPage(pageNumber);
            setIsTransitioning(false);
        }, 300);
    };

    const handleShowModal = (service) => {
        setSelectedService(service);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setQuantity(1); // Reset số lượng khi đóng modal
    };

    const handleConfirmModal = (quantity) => {
        handleAddToCart(selectedService, quantity); // For dine-in ordering
        addToCart(selectedService, quantity);        // For online cart (VNPay)
        toast.success(`Đã thêm "${selectedService.serviceName}" vào giỏ hàng!`, { autoClose: 2000 });
        handleCloseModal();
    };

    const renderTooltip = (description) => (
        <Tooltip id="button-tooltip">
            {description}
        </Tooltip>
    );

    return (
        <Col md={10}>
            <Row className={`row ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
                {currentServices.length === 0 ? (
                    <p>Không có sản phẩm nào để hiển thị.</p>
                ) : (
                    currentServices.map((service) => (
                        <Col key={service.serviceId} md={3} className="mb-4">
                            <div className="menu-entry">
                                <OverlayTrigger
                                    placement="bottom-start"
                                    overlay={renderTooltip(service.description)}
                                >
                                    <a href="#" className="img" style={{ backgroundImage: `url(/images/${service.imageUrl})` }}></a>
                                </OverlayTrigger>
                                <div className="text text-center pt-4">
                                    <h3 title={service.serviceName}><a href="#">{service.serviceName}</a></h3>
                                    <p className="price"><span>{service.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span></p>
                                    <p><Button onClick={() => handleShowModal(service)} className="btn btn-primary btn-outline-primary"><i class="bi bi-cart-plus"></i> Add to Cart</Button></p>
                                </div>
                            </div>
                        </Col>
                    ))
                )}
            </Row>

            <Row className="justify-content-center mt-4">
                <Col md={6} className="text-center">
                    <div role="group" aria-label="Pagination controls">
                        <Button className="pagination-button btn btn-primary btn-outline-primary" onClick={handlePrevPage} disabled={currentPage === 1}>&lt;</Button>
                        {[...Array(totalPages).keys()].map(pageNumber => (
                            <Button key={pageNumber + 1} onClick={() => handlePageClick(pageNumber + 1)} className={currentPage === pageNumber + 1 ? 'pagination-button' : 'pagination-button btn btn-primary btn-outline-primary'}>
                                {pageNumber + 1}
                            </Button>
                        ))}
                        <Button className="pagination-button btn btn-primary btn-outline-primary" onClick={handleNextPage} disabled={currentPage === totalPages}>&gt;</Button>
                    </div>
                </Col>
            </Row>

            {/* Hiển thị modal nhập số lượng */}
            <QuantityModal
                show={showModal}
                handleClose={handleCloseModal}
                service={selectedService}
                handleConfirm={handleConfirmModal}
                quantity={quantity}
                setQuantity={setQuantity}
            />
        </Col>
    );
};

export default ListServiceByType;
