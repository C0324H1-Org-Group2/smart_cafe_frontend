import React, {useEffect, useState} from "react";
import { Col, Row, Table, Button } from 'react-bootstrap';
import BillDetail from "./BillDetail";
import TableSelectionModal from './TableSelectionModal'; // Import modal component
import * as serviceService from "../services/ServiceService";
import { toast } from "react-toastify";
import FeedbackModal from "./FeedbackModal";
import {NavLink} from "react-router-dom";

const ListBillDetails = ({ cartItems, handleStatusChange, handleDeleteCartItems, handleSentBillDetail, tableInfo, allTables, onUpdateTableInfo  }) => {
    const [items, setItems] = useState(cartItems);
    const [showTableModal, setShowTableModal] = useState(false); // State để điều khiển modal
    const [selectedTable, setSelectedTable] = useState(tableInfo);
    const [currentBill, setCurrentBill] = useState(null);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [isTableLocked, setIsTableLocked] = useState(false);
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        setItems(cartItems);
    }, [cartItems]);

    // Khôi phục bàn đã chọn từ sessionStorage
    useEffect(() => {
        const savedTable = sessionStorage.getItem('selectedTable');
        const saveItem = sessionStorage.getItem('item');
        const saveCurrentBill = sessionStorage.getItem('currentBill');
        const saveIsTableLocked = sessionStorage.getItem('isTableLocked');
        const saveSelectAll = sessionStorage.getItem('selectAll');

        if (savedTable) {
            setSelectedTable(JSON.parse(savedTable));
        }

        if (saveSelectAll) {
            setSelectAll(JSON.parse(saveSelectAll));
        }

        if (saveCurrentBill) {
            setCurrentBill(JSON.parse(saveCurrentBill));
        }

        if (saveItem) {
            setItems(JSON.parse(saveItem));
        }

        if (saveIsTableLocked) {
            setIsTableLocked(JSON.parse(saveIsTableLocked));
        }
    }, []);


    // Lưu bàn đã chọn vào sessionStorage khi selectedTable thay đổi
    useEffect(() => {
        if (selectAll) {
            sessionStorage.setItem('selectAll', JSON.stringify(selectAll));
        }

        if (items) {
            sessionStorage.setItem('item', JSON.stringify(items));
        }

        if (currentBill) {
            sessionStorage.setItem('currentBill', JSON.stringify(currentBill));
        }

        if (selectedTable) {
            sessionStorage.setItem('selectedTable', JSON.stringify(selectedTable));
        }

        if (isTableLocked) {
            sessionStorage.setItem('isTableLocked', JSON.stringify(isTableLocked));
        }
    }, [selectedTable, items, currentBill, isTableLocked]);


    console.log(items);
    const handleDelete = () => {
        if (cartItems.length === 0) {
            toast.error("Please choose a service!")
            return;
        }

        const deletableItems = items.filter(item => item.status && !item.isOrder);

        if (deletableItems.length === 0) {
            toast.error("No items can be deleted");
            return;
        }

        let updatedItems = items.filter(item => !item.status || item.isOrder)
        updatedItems = updatedItems.filter(item => ({ ...item, status: false }));
        setItems(updatedItems);
        handleDeleteCartItems(updatedItems);
    };

    const handleOrder = async () => {
        const orderItems = items.filter(item => item.status && !item.isOrder);

        if (orderItems.length === 0) {
            toast.error("No items selected for ordering.");
            return;
        }

        // Kiểm tra nếu thông tin bàn thiếu
        if (!selectedTable) {
            toast.error("Hay chọn bàn !!!!");
            return;
        }

        try {
            let bill = currentBill;

            if (!selectedTable.bill) {
                // Nếu chưa có bill, tạo bill mới
                bill = await serviceService.updateTableStatusAndCreateBill(selectedTable.tableId);
                setSelectedTable(bill.table);
                setCurrentBill(bill);
            } else {
                // Nếu đã có bill, chỉ cần cập nhật lại trạng thái isBill
                await serviceService.updateTableStatusBill(selectedTable.tableId)
            }


            // Cập nhật các mặt hàng vào bill hiện tại
            const updatedOrderItems = orderItems.map(orderItem => ({
                ...orderItem,
                order: true,
                bill: bill,
                status: false
            }));

            await serviceService.orderItems(updatedOrderItems);

            const updatedItems = items.map(item => {
                if (orderItems.some(orderItem => orderItem.service.serviceId === item.service.serviceId)) {
                    return { ...item, isOrder: true, status: false, bill: bill };
                }
                return item;
            });

            setItems(updatedItems);
            handleSentBillDetail(updatedItems);

            // Gọi lại API để lấy danh sách các bàn mới cập nhật
            const updatedTables = await serviceService.getAllTables();
            onUpdateTableInfo(updatedTables.find(table => table.tableId === selectedTable.tableId));
            setIsTableLocked(true);
            toast.success("Order placed successfully.");
        } catch (error) {
            toast.error("Error placing order.");
        }
    };


    const handlePay = async () => {

        const isBill = await serviceService.checkIsBillTable(selectedTable.tableId)

        if (isBill) {
            toast.error("This table has already been ordered. You cannot make a payment.");
            return;
        }

        const orderItems = items.filter(item => item.isOrder);

        if (orderItems.length === 0) {
            toast.error("No items selected for payment.");
            return;
        }

        // Xóa tất cả các sản phẩm đã đặt khỏi danh sách hóa đơn
        const updatedItems = items.filter(item => !orderItems.some(orderItem => orderItem.service.serviceId === item.service.serviceId));
        setItems(updatedItems);
        handleSentBillDetail(updatedItems);

        try {
            await serviceService.updateTableStatus(selectedTable.tableId);

            const updatedTables = await serviceService.getAllTables();
            onUpdateTableInfo(updatedTables.find(table => table.tableId === selectedTable.tableId));

            setIsTableLocked(false);
            setSelectedTable(null);
            setSelectAll(false);
            sessionStorage.setItem('isTableLocked', JSON.stringify(false));
            sessionStorage.setItem('selectedTable', JSON.stringify(null));

            toast.success("Payment processed successfully.");
        } catch (error) {
            toast.error("Error processing payment.");
        }
    }

    const handleCall = async () => {

        if (!selectedTable) {
            toast.error("Vui lòng chọn bàn trước khi gọi phục vụ.");
            return;
        }

        try {
            // Gọi API để phục vụ nhân viên
            await serviceService.callEmployee(selectedTable.tableId);
            toast.success("Đã gọi phục vụ thành công.");
        } catch (error) {
            // Xử lý lỗi nếu có
            toast.error("Đã xảy ra lỗi khi gọi phục vụ.");
        }
    };



    const handleSelectTable = (table) => {
        setSelectedTable(table);
        setShowTableModal(false);
        onUpdateTableInfo(table);
        // Cập nhật tất cả các món ăn trong giỏ hàng với tableId mới
        const updatedItems = items.map(item => ({
            ...item,
            tableId: table.tableId
        }));
        setItems(updatedItems);
        handleSentBillDetail(updatedItems);
    };

    // Hàm xử lý dữ liệu phản hồi từ modal
    const handleFeedbackSubmit = (feedbackData) => {
        console.log("Dữ liệu phản hồi:", feedbackData);
        // Thực hiện các xử lý khác, ví dụ: gửi feedback lên server hoặc lưu lại
        toast.success("Phản hồi đã được gửi!");
    };

    const handleSelectAll = (event) => {
        const isChecked = event.target.checked;
        setSelectAll(isChecked);
        const updatedItems = items.map(item => ({
            ...item,
            status: isChecked
        }));
        setItems(updatedItems);
    };

    return (
        <>
            <Row className="mt-4">
                <Col md={2}></Col>
                <Col md={10} className="text-center mb-4">
                    <div className="d-flex flex-column align-items-start mb-3" style={{ width: '400px', margin: '0 auto' }}>
                        <div className="d-flex justify-content-start align-items-center mb-3" style={{width: '100%'}}>
                            <Button
                                onClick={() => setShowTableModal(true)}
                                variant="info"
                                className="btn-lg rounded-pill ms-3"
                                disabled={isTableLocked} // Khóa nút chọn bàn nếu đã gọi món
                            >Chọn bàn</Button>
                            <Button onClick={handleCall}
                                    variant="info" className="btn-lg rounded-pill ms-3">Gọi phục vụ</Button>
                            <span><strong>Bàn của bạn :</strong> {selectedTable ? selectedTable.code : 'N/A'}</span>
                        </div>
                    </div>
                    <Table bordered className="text-center table-custom">
                        <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th>STT</th>
                            <th>Tên món</th>
                            <th>Số lượng</th>
                            <th>Giá</th>
                            <th>Thành tiền</th>
                            <th>Thời gian chờ</th>
                            <th>Trạng thái</th>
                        </tr>
                        </thead>
                        {items.map((item, index) => (
                            <BillDetail
                                key={index || item.serviceId}
                                index={index}
                                item={item}
                                handleStatusChange={handleStatusChange} />
                        ))}
                    </Table>

                    <div className="d-flex justify-content-center mb-3">
                        <Button className="btn-lg rounded-pill" onClick={handleDelete} variant="danger">Xóa</Button>
                        <Button className="btn-lg rounded-pill" onClick={handleOrder} variant="primary">Gọi món</Button>
                        <Button className="btn-lg rounded-pill" onClick={handlePay} variant="success">Thanh toán</Button>
                        <NavLink
                            to="/menu#feedback"
                            onClick={() => console.log("Phản hồi")}
                            className="btn btn-info btn-lg rounded-pill ms-3"
                        >
                            Phản hồi
                        </NavLink>

                    </div>
                </Col>
            </Row>

            <TableSelectionModal
                show={showTableModal}
                onHide={() => setShowTableModal(false)}
                tables={allTables}
                onSelectTable={handleSelectTable}
            />

            {/* Hiển thị modal Phản hồi */}
            <FeedbackModal
                show={showFeedbackModal}
                onHide={() => setShowFeedbackModal(false)}
                onSubmit={handleFeedbackSubmit} // Truyền hàm xử lý dữ liệu phản hồi
            />
        </>
    );
};

export default ListBillDetails;
