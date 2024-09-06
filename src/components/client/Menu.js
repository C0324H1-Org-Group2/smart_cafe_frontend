import React, { useEffect, useState } from 'react';
import * as serviceService from "../services/ServiceService";
import { Container, Row, Col, Button } from 'react-bootstrap';
import './Menu.css';

const Menu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [selectedType, setSelectedType] = useState(null);
    const [services, setServices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const itemsPerPage = 8;

    useEffect(() => {
        allMenuItems();
    }, []);

    const allMenuItems = async () => {
        const data = await serviceService.getMenuItems();
        setMenuItems(data);

        if (data.length > 0) {
            const firstTypeId = data[0].typeId;
            handleButtonClick(firstTypeId);
        }
    };

    const handleButtonClick = async (typeId) => {
        try {
            const response = await serviceService.getServicesByType(typeId);
            setServices(response);
            setSelectedType(typeId);
            setCurrentPage(1);
        } catch (error) {
            console.error("Lỗi lấy dịch vụ theo loại: ", error);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentServices = services.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(services.length / itemsPerPage);

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

    return (
        <section className="ftco-section">
            <Container>
                <Row className="mt-4">
                    <Col md={2}>
                        <div className="list-group">
                            {menuItems.map((item) => (
                                <Button
                                    key={item.typeId}
                                    variant={item.typeId === selectedType ? 'primary' : 'light'}
                                    className="list-group-item w-100 text-start"
                                    onClick={() => handleButtonClick(item.typeId)}
                                >
                                    {item.typeName}
                                </Button>
                            ))}
                        </div>
                    </Col>

                    <Col md={10}>
                        <Row className={`row ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
                            {currentServices.length === 0 ? (
                                <p>Không có sản phẩm nào để hiển thị.</p>
                            ) : (
                                currentServices.map((service) => (
                                    <Col key={service.serviceId} md={3} className="mb-4">
                                        <div className="menu-entry">
                                            <a href="#" className="img" style={{ backgroundImage: `url(/images/${service.imageUrl})` }}></a>
                                            <div className="text text-center pt-4">
                                                <h3><a href="#">{service.serviceName}</a></h3>
                                                <p className="price"><span>{service.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span></p>
                                                <p><a href="#" className="btn btn-primary btn-outline-primary">Add to Cart</a></p>
                                            </div>
                                        </div>
                                    </Col>
                                ))
                            )}
                        </Row>

                        <Row className="justify-content-center mt-4">
                            <Col md={6} className="text-center">
                                <div className="" role="group" aria-label="Pagination controls">
                                    <Button className="pagination-button btn btn-primary btn-outline-primary" onClick={handlePrevPage} disabled={currentPage === 1}>&lt;</Button>
                                    {[...Array(totalPages).keys()].map(pageNumber => (
                                        <Button
                                            key={pageNumber + 1}
                                            onClick={() => handlePageClick(pageNumber + 1)}
                                            className={currentPage === pageNumber + 1 ? 'pagination-button' : 'pagination-button btn btn-primary btn-outline-primary'}
                                        >
                                            {pageNumber + 1}
                                        </Button>
                                    ))}
                                    <Button className="pagination-button btn btn-primary btn-outline-primary" onClick={handleNextPage} disabled={currentPage === totalPages}>&gt;</Button>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Menu;
