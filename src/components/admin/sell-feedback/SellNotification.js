import React, {useEffect, useState} from 'react';
import SockJS from 'sockjs-client';
import {Client} from '@stomp/stompjs';
import {Link} from 'react-router-dom';

const SellNotification = ({onSellNotifications, isDropdownOpen, closeDropdown}) => {
    const [messagesOrder, setMessagesOrder] = useState([]);
    const [messagesEmployee, setMessagesEmployee] = useState([]);
    const [messagesPay, setMessagesPay] = useState([]);
    const [messagesFeedback, setMessagesFeedback] = useState([]);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onStompError: (error) => {
                console.error('STOMP error', error);
            },
            onWebSocketClose: () => {
                console.error('WebSocket connection closed');
            }
        });

        stompClient.onConnect = () => {
            console.log('Connected to WebSocket');

            stompClient.subscribe('/topic/admin/sell/order', (message) => {
                const newMessage = JSON.parse(message.body);

                setMessagesOrder((prevMessages) => {
                    // Kiểm tra nếu thông báo đã tồn tại trong danh sách
                    if (!prevMessages.some(msg => msg.tableId === newMessage.tableId)) {
                        const updatedMessages = [...prevMessages, newMessage];
                        if (typeof onSellNotifications === 'function') {
                            onSellNotifications(updatedMessages.length);
                        }
                        return updatedMessages;
                    }
                    return prevMessages;  // Nếu thông báo đã tồn tại, không làm gì
                });
            });

            stompClient.subscribe('/topic/admin/sell/callEmployee', (message) => {
                const newMessage = JSON.parse(message.body);

                setMessagesEmployee((prevMessages) => {
                    if (!prevMessages.some(msg => msg.tableId === newMessage.tableId)) {
                        const updatedMessages = [...prevMessages, newMessage];
                        if (typeof onSellNotifications === 'function') {
                            onSellNotifications(updatedMessages.length);
                        }
                        return updatedMessages;
                    }
                    return prevMessages;
                });
            });

            stompClient.subscribe('/topic/admin/sell/pay', (message) => {
                const newMessage = JSON.parse(message.body);

                setMessagesPay((prevMessages) => {
                    if (!prevMessages.some(msg => msg.tableId === newMessage.tableId)) {
                        const updatedMessages = [...prevMessages, newMessage];
                        if (typeof onSellNotifications === 'function') {
                            onSellNotifications(updatedMessages.length);
                        }
                        return updatedMessages;
                    }
                    return prevMessages;
                });
            });

            stompClient.subscribe('/topic/admin/feedback', (message) => {
                const newMessage = JSON.parse(message.body);

                setMessagesFeedback((prevMessages) => {
                    if (!prevMessages.some(msg => msg.tableId === newMessage.tableId)) {
                        const updatedMessages = [...prevMessages, newMessage];
                        if (typeof onSellNotifications === 'function') {
                            onSellNotifications(updatedMessages.length);
                        }
                        return updatedMessages;
                    }
                    return prevMessages;
                });
            });
        };

        stompClient.activate();

        return () => {
            stompClient.deactivate();
        };
    }, [onSellNotifications]);

    // Function to handle notification clicks (remove notification, decrement count, close dropdown)
    const handleNotificationClick = (id, type) => {
        if (type === 'order') {
            setMessagesOrder((prevMessages) => prevMessages.filter((msg) => msg.tableId !== id));
        } else if (type === 'employee') {
            setMessagesEmployee((prevMessages) => prevMessages.filter((msg) => msg.tableId !== id));
        } else if (type === 'pay') {
            setMessagesPay((prevMessages) => prevMessages.filter((msg) => msg.tableId !== id));
        } else if (type === 'feedback') {
            setMessagesFeedback((prevMessages) => prevMessages.filter((msg) => msg.tableId !== id));
        }

        // Decrement notification count
        if (typeof onSellNotifications === 'function') {
            onSellNotifications(-1);
        }

        // Close dropdown
        closeDropdown();
    };

    return (
        <div className={`dropdown-menu dropdown-menu-right ${isDropdownOpen ? 'show' : ''}`}
             style={{width: '300px'}}>
            {messagesOrder.length > 0 && messagesOrder.map((msg) => (
                <Link
                    className="dropdown-item"
                    key={msg.tableId}
                    to={msg.isOnline || msg.tableId === -1 ? `/admin/order` : `/admin/sell`}
                    state={{ openOrderCode: msg.code }}
                    onClick={() => handleNotificationClick(msg.tableId, 'order')}
                    style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}
                >
                    <strong>
                        {msg.isOnline || msg.tableId === -1 
                            ? `Có đơn hàng Online mới: ${msg.code}` 
                            : `Table ${msg.code} calling the dish`}
                    </strong>
                </Link>
            ))}
            {messagesEmployee.length > 0 && messagesEmployee.map((msg) => (
                <Link
                    className="dropdown-item"
                    key={msg.tableId}
                    to={`/admin/sell`}
                    onClick={() => handleNotificationClick(msg.tableId, 'employee')}
                    style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}
                >
                    <strong>Table {msg.code} calling the employee</strong>
                </Link>
            ))}
            {messagesPay.length > 0 && messagesPay.map((msg) => (
                <Link
                    className="dropdown-item"
                    key={msg.tableId}
                    to={`/admin/sell`}
                    onClick={() => handleNotificationClick(msg.tableId, 'pay')}
                    style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}
                >
                    <strong>Table {msg.code} calling for payment</strong>
                </Link>
            ))}
            {messagesFeedback.length > 0 && messagesFeedback.map((msg) => (
                <Link
                    className="dropdown-item"
                    key={msg.tableId}
                    to={`/admin/feedback`}
                    onClick={() => handleNotificationClick(msg.tableId, 'feedback')}
                    style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}
                >
                    <strong>There is 1 new comment {msg.code}  </strong>
                </Link>
            ))}
            {messagesOrder.length === 0 && messagesEmployee.length === 0 && messagesPay.length === 0 && messagesFeedback.length === 0 && (
                <div className="dropdown-item">There are no new notifications</div>
            )}
        </div>
    );
};

export default SellNotification;
