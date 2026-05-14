import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaChartLine, FaUtensils, FaShoppingCart, FaListAlt, FaTable, FaCommentDots, FaNewspaper, FaUser, FaCog } from 'react-icons/fa';
import './Sidebar.css';
import {hasRole} from "../manager/HasRole";
const Sidebar = () => {
    const employeeId = localStorage.getItem('employeeId');
    return (
        <div className="main-sidebar sidebar-style-2">
            <aside id="sidebar-wrapper">
                <div className="sidebar-brand">
                    <NavLink to="/admin/home">Hương Coffee</NavLink>
                </div>
                <div className="sidebar-brand sidebar-brand-sm">
                    <NavLink to="/admin/home">Sc</NavLink>
                </div>
                <ul className="sidebar-menu mt-4">
                    {hasRole('ROLE_ADMIN') && (
                        <li className="mb-3">
                            <NavLink className="nav-link d-flex align-items-center" to="/admin/home">
                                <FaChartLine className="me-2" /> <span>Thống kê doanh thu</span>
                            </NavLink>
                        </li>
                    )}
                    <li className="mb-3">
                        <NavLink className="nav-link d-flex align-items-center" to="/admin/service">
                            <FaUtensils className="me-2" /> <span>Quản lý món</span>
                        </NavLink>
                    </li>
                    <li className="mb-3">
                        <NavLink className="nav-link d-flex align-items-center" to="/admin/sell">
                            <FaShoppingCart className="me-2" /> <span>Quản lý bán hàng</span>
                        </NavLink>
                    </li>
                    {hasRole('ROLE_ADMIN') && (
                        <li className="mb-3">
                            <NavLink className="nav-link d-flex align-items-center" to="/admin/order">
                                <FaChartLine className="me-2" /> <span>Quản Lý Đơn Hàng</span>
                            </NavLink>
                        </li>
                    )}
                    <li className="mb-3">
                        <NavLink className="nav-link d-flex align-items-center" to="/admin/tables/list">
                            <FaTable className="me-2" /> <span>Quản lý bàn</span>
                        </NavLink>
                    </li>
                    <li className="mb-3">
                        <NavLink className="nav-link d-flex align-items-center" to="/admin/feedback">
                            <FaCommentDots className="me-2" /> <span>Quản lý phản hồi</span>
                        </NavLink>
                    </li>
                    <li className="mb-3">
                        <NavLink className="nav-link d-flex align-items-center" to="/admin/news">
                            <FaNewspaper className="me-2" /> <span>Quản lý tin tức</span>
                        </NavLink>
                    </li>
                    <li className="mb-3">
                        <NavLink className="nav-link d-flex align-items-center" to={`/admin/employee/${employeeId}`}>
                            <FaUser className="me-2" /> <span>Tài khoản</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className="nav-link d-flex align-items-center" to="/admin/settings">
                            <FaCog className="me-2" /> <span>Cài đặt</span>
                        </NavLink>
                    </li>
                </ul>
            </aside>
        </div>
    );
}

export default Sidebar;
