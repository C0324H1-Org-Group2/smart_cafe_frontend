import axios from "axios";

const API_BASE_URL = 'http://localhost:8080/api/client';

export const getMenuItems = async ()=> {
    try {
        const response = await axios.get('http://localhost:8080/api/services/list-service-types');
        return response.data;
    } catch (e) {
        return [];
    }
}

export const getTop5NewestServices = async ()=> {
    try {
        const response = await axios.get('http://localhost:8080/api/services/top5-newest');
        return response.data;
    } catch (e) {
        console.log("Lỗi tìm 5 món mới nhất: " + e);
        return [];
    }
}

export const getTop5MostOrderedServices = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/services/top5-most-ordered');
        return response.data;
    } catch (e) {
        console.log("Lỗi tìm 5 món được order nhiều nhất: " + e);
        return [];
    }
}

export const getServicesByType = async (typeId) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/services/services-by-type/${typeId}`);
        return response.data;
    } catch (e) {
        console.error('Lỗi lấy dịch vụ theo loại:', e);
        return [];
    }
};

// Lấy bảng ngẫu nhiên có trạng thái isOn = true
export const getRandomAvailableTable = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/table/random`);
        return response.data;
    } catch (error) {
        console.error('Error fetching random available table:', error);
        throw error;
    }
};

// Gọi API để cập nhật trạng thái bảng và tạo hóa đơn
export const updateTableStatusAndCreateBill = async (tableId) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/tables/${tableId}/status_createBill`);
        return response.data;
    } catch (error) {
        console.error('Error updating table status and creating bill:', error);
        throw error;
    }
};

// Cập nhật trạng thái bảng mà không tạo hóa đơn
export const updateTableStatus = async (tableId) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/tables/${tableId}/status`);
        return response.data;
    } catch (error) {
        console.error('Error updating table status:', error);
        throw error;
    }
};

export const updateTableStatusBill = async (tableId) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/tables/${tableId}/statusBill`);
        return response.data;
    } catch (error) {
        console.error('Error updating table status:', error);
        throw error;
    }
};


// Gửi yêu cầu gọi món
export const orderItems = async (items) => {
    try {
        await axios.post(`${API_BASE_URL}/bill-details/order`, items);
    } catch (error) {
        console.error('Error ordering items:', error);
        throw error;
    }
};

export const getAllTables = async() => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tables`);
        return response.data;
    } catch (error) {
        console.error('Error fetching all tables:', error);
        throw error;
    }
}

export const sendFeedback = async (feedback) => {
    try {
        // Tạo đối tượng FormData
        const formData = new FormData();
        formData.append('email', feedback.email);
        formData.append('message', feedback.message);
        formData.append('imageFile', feedback.imageFile); // Đảm bảo imageFile là một đối tượng File

        // Gửi yêu cầu POST với axios
        const response = await axios.post(`${API_BASE_URL}/feedback_client`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (e) {
        throw new Error('Error sending feedback: ' + e.message);
    }
};


export const checkIsBillTable = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tables/${id}/check-is-bill`);
        return response.data; // Phản hồi nên là boolean
    } catch (error) {
        console.error('Error checking table bill status:', error);
        throw error;
    }
};

export const checkIsCallTable = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tables/${id}/check-is-call`);
        return response.data; // Phản hồi nên là boolean
    } catch (error) {
        console.error('Error checking table call status:', error);
        throw error;
    }
};

export const callEmployee = async (id) => {
    try {
        await axios.post(`${API_BASE_URL}/tables/${id}/callEmployee`);
    } catch (error) {
    }
}

export const createVNPayPaymentUrl = async (paymentData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/payment/create`, paymentData);
        return response.data; // { paymentUrl, txnRef }
    } catch (error) {
        console.error('Error creating VNPay payment URL:', error);
        throw error;
    }
};





