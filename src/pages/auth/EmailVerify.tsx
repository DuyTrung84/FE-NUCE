import { useParams } from 'react-router-dom';
import { useEmailVerificaitonQuery } from '../../api/share/Auth';
import { Button, Result } from 'antd';

const EmailVerify = () => {
    const { token } = useParams();
    const { data } = useEmailVerificaitonQuery(token || "");
    console.log(data);
    return (
        <Result
            status="success"
            title="Xác nhận tài khoản thành công"
            subTitle="Tài khoản của bạn đã được xác nhận thành công!!"
            extra={[
                <Button type="primary" key="console" href='/login'>
                    Đăng nhập
                </Button>,
            ]}
        />
    )
}

export default EmailVerify