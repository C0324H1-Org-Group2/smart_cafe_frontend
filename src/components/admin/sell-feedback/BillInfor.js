import React from "react";
import "./css/billInfor.css";

function BillInfor({ bills, nameEmployee }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    const calculateTotal = () => {
        return bills.reduce((total, bill) => total + bill.price * bill.quantity, 0);
    };

    return (
        <div className="receipt" style={{ width: "auto", margin: "0 auto" }}>
            <h3 className="text-center">Hương Coffee</h3>
            <h4 className="text-center">PAYMENT INVOICE</h4>

            <div className="receipt-info">
                <p>Date: {  formatDate(new Date().toLocaleDateString())}</p>
                <p>Hour: {new Date().toLocaleTimeString()}</p>
                <p>Table: {bills[0]?.tableCode || ""}</p>
                <p>Code: {bills[0]?.code || ""}</p>
                <p>Cashier: {nameEmployee}</p>
            </div>

            <table className="table">
                <thead>
                <tr>
                    <th>Serial</th>
                    <th>Dish name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                </tr>
                </thead>
                <tbody>
                {bills.map((bill, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{bill.name}</td>
                        <td>{bill.quantity}</td>
                        <td>{formatCurrency(bill.price)}</td>
                        <td>{formatCurrency(bill.price * bill.quantity)}</td>
                    </tr>
                ))}
                <tr>
                    <td colSpan="4" className="text-end">
                        Thành tiền:
                    </td>
                    <td>{formatCurrency(calculateTotal())}</td>
                </tr>
                {/* Additional rows for discounts or other totals can be added here */}
                </tbody>
            </table>

            <div className="text-end total-amount">
                <strong>TOTAL (VND): {formatCurrency(calculateTotal())}</strong>
            </div>
        </div>
    );
}

export default BillInfor;