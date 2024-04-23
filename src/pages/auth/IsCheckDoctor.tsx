import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Notifn } from '../../utils/Notification';

const IsCheckDoctor = () => {
    const navigate = useNavigate();
    const [isLogin] = useState(() => {
        const token = localStorage.getItem("token");
        return token ? token : null;
    });

    useEffect(() => {
        const checkAdminAndRedirect = async () => {
            if (!isLogin) {
                Notifn("warning", "Cảnh báo", "Bạn cần phải đăng nhập!!");
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } else {
                const role = localStorage.getItem("role");
                if (role !== "DOCTOR") {
                    Notifn("warning", "Cảnh báo", "Bạn không có quyền truy cập!!");
                    setTimeout(() => {
                        navigate(-1); // Quay trở lại trang trước đó
                    }, 1000);
                }
            }
        };
        checkAdminAndRedirect();
    }, [isLogin, navigate]);
    return (
        <Outlet />
    );
};
export default IsCheckDoctor;
