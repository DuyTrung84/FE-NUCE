import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiFillCustomerService, AiOutlineCaretDown } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { convertToSlug } from '../../utils/convertToSlug';
import { Link } from 'react-router-dom';
import { Avatar, Dropdown, MenuProps } from 'antd';
import { useRefreshTokenMutation } from '../../api/share/area';
import { useGetAccountQuery } from '../../api/share/upload';
import { HistoryOutlined, LoginOutlined, RollbackOutlined } from '@ant-design/icons';
import { ImProfile } from 'react-icons/im';
import { Notifn } from '../../utils/Notification';
import logo from '../../../public/logoDA.png';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [, setSelectedLanguage] = useState('');
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
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

    const changeLanguage = (language: string) => {
        i18n.changeLanguage(language);
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const selectLanguage = (language: string) => {
        setSelectedLanguage(language);
        setIsOpen(false);
        changeLanguage(language);
    };


    const handleClick = (slug: string) => {
        navigate(`danh-sach/${convertToSlug(t(slug))}`, { state: { slug } });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('rfToken');
        localStorage.removeItem('role');
        Notifn("success", "Đăng xuất", "");

        navigate("/login");
    };

    const items: MenuProps['items'] = [
        { label: <a href={`/ho-so-kham-benh`} className='mx-2 flex items-center gap-2'><ImProfile />{t('header.medExamRec')}</a>, key: '1', },
        { label: <a href={`/lich-hen`} className='mx-2 flex items-center gap-2'><HistoryOutlined />{t('header.history')}</a>, key: '3', },
        { label: <button className='mx-2' onClick={handleLogout}><LoginOutlined className='mr-2' />{t('header.logout')}</button>, key: '2', },
    ];

    return (
        <header className="bg-[#EDFFFA]">
            <div className="mx-auto max-w-screen-xl px-8 py-2">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-12">
                        <Link className="block text-blue-600" to="/">
                            <img src={logo} className=" w-14" alt="" />
                        </Link>
                    </div>
                    <div className="flex items-center justify-center gap-6">
                        {/* <div className="relative">
                            <input type="text" className="h-10 pl-10 border border-gray-100 pr-10 rounded-full text-sm focus:outline-none" placeholder={t('search')} />
                            <button type="submit" className="absolute right-0 top-0 mt-3 mr-4">
                                <span className='hidden'>a</span>
                                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 56.966 56.966" width="512px" height="512px">
                                    <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92c0.779,0,1.518-0.297,2.079-0.837  C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17s-17-7.626-17-17S14.61,6,23.984,6z" />
                                </svg>
                            </button>
                        </div> */}
                        <a href='' className='text-start leading-5' onClick={() => handleClick('specialty')}>
                            <p className='text-[13px] font-bold'>{t('header.specialty')}</p>
                            <p className='text-[10px]'>{t('header.searchDoctor')}</p>
                        </a>
                        <a href='' className='text-start leading-5' onClick={() => handleClick('clinics')}>
                            <p className='text-[13px] font-bold'>{t('header.medFacilities')}</p>
                            <p className='text-[10px]'>{t('header.hospital')}</p>
                        </a>
                        <a href='' className='text-start leading-5' onClick={() => handleClick('doctor')}>
                            <p className='text-[13px] font-bold'>{t('header.doctor')}</p>
                            <p className='text-[10px]'>{t('header.choosingDoctor')}</p>
                        </a>
                        <a href="" className='text-start leading-5' onClick={() => handleClick('service')}>
                            <p className='text-[13px] font-bold'>{t('header.package')}</p>
                            <p className='text-[10px]'>{t('header.generalEx')}</p>
                        </a>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex gap-4 items-center">
                            <a href="https://www.facebook.com/profile.php?id=100008553451184">
                                <AiFillCustomerService className="text-[#45C3D2] text-4xl" />
                            </a>
                            {localStorage.getItem('role') === 'USER' ? (
                                <Dropdown menu={{ items }} trigger={['click']} className='cursor-pointer'>
                                    <a onClick={(e) => e.preventDefault()}>
                                        <Avatar size={34} src={`${data?.data?.avatar}`} />
                                    </a>
                                </Dropdown>
                            ) : localStorage.getItem('role') === 'ADMIN' ? (
                                <Link className='text-[#45C3D2] hover:text-blue-500 hover:underline font-medium' to="/admin">Quay lại admin <RollbackOutlined /></Link>
                            ) : localStorage.getItem('role') === 'DOCTOR' ? (
                                <Link className='text-[#45C3D2] hover:text-blue-500 hover:underline font-medium' to="/doctor">Quay lại doctor <RollbackOutlined /></Link>
                            ) : (
                                <Link to={`/login`} className='text-[#45C3D2] hover:text-blue-500 hover:underline font-medium'>
                                    {t('header.signin')}
                                </Link>

                            )}
                            <div className="relative">
                                <button className="flex gap-1 items-center p-2 " onClick={toggleDropdown}>
                                    <img
                                        src={i18n.language === 'en' ? 'https://kenh14cdn.com/2017/5-1503128133747.png' : 'https://th.bing.com/th?id=OSK.e1790c55fb0493ee09dba2fc418bff07&w=188&h=132&c=7&o=6&dpr=1.3&pid=SANGAM'}
                                        alt=""
                                        className="w-6 h-4 object-cover"
                                    />
                                    <AiOutlineCaretDown className="text-[#45C3D2]" />
                                </button>
                                {isOpen && (
                                    <div className="absolute top-full left-0 mt-2 bg-white rounded shadow border border-gray-200 z-50">
                                        <button className="flex gap-1 items-center p-2 hover:bg-gray-100" onClick={() => selectLanguage('vi')}>
                                            <img src="https://th.bing.com/th?id=OSK.e1790c55fb0493ee09dba2fc418bff07&w=188&h=132&c=7&o=6&dpr=1.3&pid=SANGAM" alt="" className="w-6 h-4 object-cover" />
                                        </button>
                                        <button className="flex gap-1 items-center p-2 hover:bg-gray-100" onClick={() => selectLanguage('en')}>
                                            <img src="https://kenh14cdn.com/2017/5-1503128133747.png" alt="" className="w-6 h-4 object-cover" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header >

    );
};

export default Header;
