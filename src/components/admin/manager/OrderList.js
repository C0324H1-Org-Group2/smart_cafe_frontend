import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllOrders, getOrderDetails } from "../service/OrderService";
import OrderDetailModal from "./OrderDetailModal";
import './ManagerOrder.css';

const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
};

function OrderList() {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [codeSearch, setCodeSearch] = useState('');
    const [dateSearch, setDateSearch] = useState('');
    const [searchParams, setSearchParams] = useState({ codeSearch: '', dateSearch: '' });
    const [showModal, setShowModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [orderDetails, setOrderDetails] = useState([]);
    const [isAscending, setIsAscending] = useState(true);
    const [userRole, setUserRole] = useState('ROLE_EMPLOYEE');
    const location = useLocation();
    const navigate = useNavigate();

    // Cập nhật searchParams khi codeSearch hoặc dateSearch thay đổi
    useEffect(() => {
        const fetchUserRole = () => {
            const authorities = JSON.parse(localStorage.getItem('roles'));
            if (authorities) {
                const role = authorities[0].authority;
                setUserRole(role);
            }
        };
        setSearchParams({ codeSearch, dateSearch });
        fetchUserRole()
    }, [codeSearch, dateSearch]);

    // Fetch dữ liệu khi searchParams hoặc page thay đổi
    useEffect(() => {
        const fetchOrders = async () => {
            const response = await getAllOrders(searchParams.codeSearch, searchParams.dateSearch, page, 10); // Fetch 10 orders per page
            if (response && response.content) {
                setOrders(response.content.map(order => ({
                    ...order,
                    dateCreated: formatDate(order.dateCreated.split(' ')[0])
                })));
                setTotalPages(response.totalPages);
            } else {
                setOrders([]);
            }
        };
        fetchOrders();
    }, [searchParams, page]);

    const handleSort = () => {
        const sorted = [...orders].sort((a, b) => {
            return isAscending ? a.totalAmount - b.totalAmount : b.totalAmount - a.totalAmount;
        });
        setOrders(sorted);
        setIsAscending(!isAscending); // Đảo trạng thái sắp xếp
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleSearch = () => {
        setSearchParams({ codeSearch, dateSearch });
        setPage(0);
    };

    const handleReset = () => {
        setCodeSearch('');
        setDateSearch('');
        setSearchParams({ codeSearch: '', dateSearch: '' });
        setPage(0);
    };

    const handleShowModal = async (orderId) => {
        setSelectedOrderId(orderId);
        try {
            const details = await getOrderDetails(orderId);
            setOrderDetails(details);
            setShowModal(true);
        } catch (error) {
            console.error("Không tìm thấy chi tiết đơn hàng:", error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrderId(null);
        setOrderDetails([]);
    };

    // Auto open modal if navigated from notification
    useEffect(() => {
        if (location.state && location.state.openOrderCode) {
            handleShowModal(location.state.openOrderCode);
            // Clear the state so it doesn't keep opening if user refreshes
            navigate(location.pathname, { replace: true });
        }
    }, [location.state, navigate]);

    return (
        <>
            <div className="main-content">
                <div className="section-body">
                    <h2 className="section-title">Order List</h2>
                    <div className="card-header">
                        <h4>Search Orders</h4>
                    </div>

                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by code"
                                    value={codeSearch}
                                    onChange={(e) => setCodeSearch(e.target.value)}
                                />
                            </div>
                            <div className="col-md-4">
                                <input
                                    type="date"
                                    className="form-control"
                                    placeholder="dd/mm/yyyy"
                                    value={dateSearch}
                                    onChange={(e) => setDateSearch(e.target.value)}
                                />
                            </div>
                            <div className="col-md-4 d-flex align-items-end">
                                <button className="btn btn-primary mr-2" onClick={handleReset}>Show List Bill</button>
                            </div>
                        </div>
                    </div>

                    <div className="card-header">
                        <h4>Orders</h4>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-striped table-md">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Bill Code</th>
                                    <th>Date Created</th>
                                    <th>Name Created</th>
                                    <th>Table Code</th>
                                    <th onClick={handleSort} style={{cursor: 'pointer'}}>
                                        Total Amount {isAscending ? '↑' : '↓'}
                                    </th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {orders && orders.length > 0 ? (
                                    orders.map((order, index) => (
                                        <tr key={order.billCode}>
                                            <td>{index + 1 + page * 10}</td>
                                            {/* Adjust for 10 records per page */}
                                            <td>{order.billCode}</td>
                                            <td>{order.dateCreated}</td>
                                            <td>{order.nameCreated}</td>
                                            <td>{order.tableCode}</td>
                                            <td>
                                                {order.totalAmount.toLocaleString('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                })}
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-secondary"
                                                    onClick={() => handleShowModal(order.billCode)}
                                                    style={{backgroundColor: 'transparent', border: 'none'}}
                                                >
                                                    <i className="fas fa-eye eye-icon"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center">No Orders Found</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="card-footer text-right">
                        <nav className="d-inline-block">
                            <ul className="pagination mb-0">
                                <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(page - 1)}
                                            disabled={page === 0}>
                                        <i className="fas fa-chevron-left"></i>
                                    </button>
                                </li>

                                {/* Hiển thị chỉ trang hiện tại */}
                                <li className="page-item active">
                                    <button className="page-link">
                                        {page + 1} {/* Hiển thị số của trang hiện tại */}
                                    </button>
                                </li>

                                <li className={`page-item ${page === totalPages - 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(page + 1)}
                                            disabled={page === totalPages - 1}>
                                        <i className="fas fa-chevron-right"></i>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>

                </div>
            </div>

            <OrderDetailModal
                show={showModal}
                handleClose={handleCloseModal}
                orderDetails={orderDetails}
            />
        </>
    );
}

export default OrderList;
