import { UserOutlined, FundProjectionScreenOutlined, DownOutlined, LoginOutlined, RollbackOutlined } from '@ant-design/icons';
import { Layout, Menu, Space, Avatar, Dropdown, MenuProps, theme } from 'antd';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { MdManageAccounts, MdOutlineCategory } from 'react-icons/md';
import { FaRegHospital } from 'react-icons/fa6';
import { useGetAccountQuery } from '../../api/share/upload';
import { useEffect } from 'react';
import { useRefreshTokenMutation } from '../../api/share/area';
import { Notifn } from '../../utils/Notification';
import { CiBookmarkCheck } from 'react-icons/ci';
import logo from '../../../public/logoDA.png';


const { Header, Sider, Content } = Layout;

const LayoutAdmin = () => {
    const navigate = useNavigate()
    const [refreshToken] = useRefreshTokenMutation();
    const { data, error } = useGetAccountQuery();

    useEffect(() => {
        if (error) {
            if ('status' in error && error.status === 401) {
                refreshToken().unwrap().then((response) => {
                    // Lưu token vào Local Storage
                    localStorage.setItem('token', response.data!.token);
                    localStorage.setItem('rfToken', response.data!.refreshToken);
                    window.location.reload();
                }).catch((error) => {
                    console.error('Error refreshing token:', error);
                });
            }
        }
        if (data?.data?.status === "0") {
            localStorage.removeItem('token');
            localStorage.removeItem('rfToken');
            localStorage.removeItem('role');
            Notifn("warning", "Cảnh báo", "Tài khoản của bạn đã bị khoá !!");
            navigate("/login");
        }
    }, [error, data]);

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const menuItems = [
        { key: '1', icon: <FundProjectionScreenOutlined />, label: 'Dashboard', path: '' },
        {
            key: 'company-management',
            icon: <MdOutlineCategory />,
            label: 'Quản lý danh mục',
            items: [
                { key: '2', icon: <MdManageAccounts />, label: 'Chuyên khoa', path: 'quan-ly-chuyen-khoa' },
                { key: '3', icon: <FaRegHospital />, label: 'Phòng khám', path: 'quan-ly-phong-kham' },
            ],
        },
        {
            key: 'account-management',
            icon: <UserOutlined />,
            label: 'Quản lý tài khoản',
            path: 'quan-ly-tai-khoan',
        },
        {
            key: 'booked-calendar',
            icon: <CiBookmarkCheck />,
            label: 'Quản lý lịch hẹn',
            path: 'lich-da-dat',
        },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('rfToken');
        localStorage.removeItem('role');
        Notifn("success", "Đăng xuất", "");
        navigate("/login");
    };

    const items: MenuProps['items'] = [
        { label: <button className='mx-2' onClick={handleLogout}><LoginOutlined className='mr-2' />Đăng xuất</button>, key: '2', }
    ];

    return (
        <Layout className='min-h-screen'>
            <Sider trigger={null} collapsible width={220} style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, zIndex: 20 }}>
                <div className="demo-logo-vertical flex justify-center mb-4 mt-8 mx-4 rounded-lg gap-2" >
                    <img src={logo} className='w-10' alt="" />
                    <p className='font-semibold text-2xl text-white'></p>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                >
                    {menuItems.map((menuItem) => (
                        menuItem.items ? (
                            <Menu.SubMenu key={menuItem.key} icon={menuItem.icon} title={menuItem.label}>
                                {menuItem.items.map((subItem) => (
                                    <Menu.Item key={subItem.key} icon={subItem.icon}>
                                        <Link to={subItem.path}>{subItem.label}</Link>
                                    </Menu.Item>
                                ))}
                            </Menu.SubMenu>
                        ) : (
                            <Menu.Item key={menuItem.key} icon={menuItem.icon}>
                                <Link to={menuItem.path}>{menuItem.label}</Link>
                            </Menu.Item>
                        )
                    ))}
                </Menu>
            </Sider>
            <Layout style={{ marginLeft: 220 }} >
                <Header style={{ padding: 0, background: colorBgContainer }} className='flex justify-end fixed top-0 right-0 z-10 w-full drop-shadow'>
                    <div className='mr-16 flex gap-2'>
                        <p>Xin chào! {data?.data?.name}</p>
                        <div className='border-l px-4'>
                            <Space wrap size={16} className='mr-2'>
                                <Avatar size={34} src={`${data?.data?.avatar}`} />
                            </Space>
                            <Dropdown menu={{ items }} trigger={['click']}>
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        <DownOutlined />
                                    </Space>
                                </a>
                            </Dropdown>
                        </div>
                        <Link className='border-l px-3' to="/">Quay lại web <RollbackOutlined /></Link>
                    </div>
                </Header>
                <Content style={{ margin: '88px 24px 0' }}
                >
                    <div
                        style={{
                            padding: 24,
                            minHeight: '100vh',
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout>

    );
}

export default LayoutAdmin;