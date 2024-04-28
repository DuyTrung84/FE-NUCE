import { Button, Result } from 'antd'

const NotFound = ({ subTitle }: any) => {
    return (
        <Result
            status="404"
            title="404"
            subTitle={subTitle || "Rất tiếc, trang bạn đã truy cập không tồn tại!"}
            extra={<Button type="primary" className='bg-blue-500' href='/'>Quay lại trang home</Button>}
        />
    )
}

export default NotFound