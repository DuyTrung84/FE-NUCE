import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const IsCheckLogin = () => {
    const navigate = useNavigate();
    const [isLogin] = useState(() => {
        const token = localStorage.getItem("token");
        return token ? token : null;
    });

    useEffect(() => {
        const checkLoginAndRedirect = async () => {
            if (isLogin) {
                navigate('/');
            }
        };
        checkLoginAndRedirect();
    }, [isLogin, navigate]);
    return (
        <Outlet />
    );
};
export default IsCheckLogin;
