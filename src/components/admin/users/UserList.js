import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [formData, setFormData] = useState({
        userId: null,
        username: '',
        password: '',
        employeeId: '',
        roleIds: []
    });

    useEffect(() => {
        fetchUsers();
        fetchRoles();
        fetchEmployees();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error) {
            toast.error('Failed to fetch users');
        }
    };

    const fetchRoles = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/roles', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setRoles(response.data);
        } catch (error) {
            toast.error('Failed to fetch roles');
        }
    };

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/employees', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setEmployees(response.data);
        } catch (error) {
            toast.error('Failed to fetch employees');
        }
    };

    const toggleLock = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8080/api/users/${userId}/lock`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            toast.success('User status updated');
            fetchUsers();
        } catch (error) {
            toast.error('Failed to update user status');
        }
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setIsEdit(true);
            setFormData({
                userId: user.userId,
                username: user.username,
                password: '', // Blank for security, only update if typed
                employeeId: user.employee ? user.employee.employeeId : '',
                roleIds: user.roles.map(r => r.roleId)
            });
        } else {
            setIsEdit(false);
            setFormData({
                userId: null,
                username: '',
                password: '',
                employeeId: '',
                roleIds: []
            });
        }
        setShowModal(true);
    };

    const handleRoleChange = (roleId) => {
        setFormData(prev => {
            const newRoles = prev.roleIds.includes(roleId)
                ? prev.roleIds.filter(id => id !== roleId)
                : [...prev.roleIds, roleId];
            return { ...prev, roleIds: newRoles };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const payload = {
                ...formData,
                employeeId: formData.employeeId ? parseInt(formData.employeeId) : null
            };
            
            if (isEdit) {
                await axios.put(`http://localhost:8080/api/users/${payload.userId}`, payload, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                toast.success('User updated successfully');
            } else {
                await axios.post('http://localhost:8080/api/users', payload, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                toast.success('User created successfully');
            }
            setShowModal(false);
            fetchUsers();
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(`Error: ${error.response.data}`);
            } else {
                toast.error('Failed to save user');
            }
        }
    };

    return (
        <div className="main-content">
            <section className="section">
                <div className="section-header">
                    <h1>Quản lý tài khoản (Admin)</h1>
                </div>

                <div className="section-body">
                    <div className="card">
                        <div className="card-header">
                            <h4>Danh sách tài khoản</h4>
                            <button className="btn btn-primary ml-auto" onClick={() => handleOpenModal()}>
                                <i className="fas fa-plus"></i> Thêm Tài Khoản
                            </button>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Username</th>
                                            <th>Employee</th>
                                            <th>Roles</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user, index) => (
                                            <tr key={user.userId}>
                                                <td>{index + 1}</td>
                                                <td>{user.username}</td>
                                                <td>{user.employee ? user.employee.fullName : 'N/A'}</td>
                                                <td>{user.roles.map(r => r.roleName).join(', ')}</td>
                                                <td>
                                                    {user.verified ? (
                                                        <div className="badge badge-success">Active</div>
                                                    ) : (
                                                        <div className="badge badge-danger">Locked</div>
                                                    )}
                                                </td>
                                                <td>
                                                    <button 
                                                        className="btn btn-primary btn-sm mr-2"
                                                        onClick={() => handleOpenModal(user)}
                                                    >
                                                        Phân quyền
                                                    </button>
                                                    <button 
                                                        className={`btn btn-${user.verified ? 'warning' : 'success'} btn-sm`}
                                                        onClick={() => toggleLock(user.userId)}
                                                    >
                                                        {user.verified ? 'Khóa' : 'Mở khóa'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal for Create/Edit */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{isEdit ? 'Sửa/Phân quyền tài khoản' : 'Thêm tài khoản'}</h5>
                                <button type="button" className="close" onClick={() => setShowModal(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label>Username</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            value={formData.username} 
                                            onChange={e => setFormData({...formData, username: e.target.value})} 
                                            disabled={isEdit} 
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Password {isEdit && '(Leave blank to keep unchanged)'}</label>
                                        <input 
                                            type="password" 
                                            className="form-control" 
                                            value={formData.password} 
                                            onChange={e => setFormData({...formData, password: e.target.value})} 
                                            required={!isEdit} 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Employee</label>
                                        <select 
                                            className="form-control" 
                                            value={formData.employeeId} 
                                            onChange={e => setFormData({...formData, employeeId: e.target.value})}
                                        >
                                            <option value="">-- None --</option>
                                            {employees.map(emp => (
                                                <option key={emp.employeeId} value={emp.employeeId}>{emp.fullName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Roles</label>
                                        <div>
                                            {roles.map(role => (
                                                <div className="form-check form-check-inline" key={role.roleId}>
                                                    <input 
                                                        className="form-check-input" 
                                                        type="checkbox" 
                                                        checked={formData.roleIds.includes(role.roleId)}
                                                        onChange={() => handleRoleChange(role.roleId)} 
                                                    />
                                                    <label className="form-check-label">{role.roleName}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary mr-2">Save</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserList;
