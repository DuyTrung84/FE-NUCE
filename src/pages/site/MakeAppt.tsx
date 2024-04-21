import { LockOutlined, UserOutlined } from "@ant-design/icons"
import { Avatar, Button, Card, Empty, Form, Input, Modal, Radio, Spin } from "antd"
import { useNavigate, useParams } from "react-router-dom"
import { useGetBookingByIdQuery } from "../../api/admin/Booking";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthSignin, useSigninMutation } from "../../api/share/Auth";
import { Notifn } from "../../utils/Notification";
import Meta from "antd/es/card/Meta";
import { useGetAllProfileQuery } from "../../api/site/Profile";
import { TbBrandReason } from "react-icons/tb";
import { useCreateFreeOrderMutation, useCreatePaymentMutation } from "../../api/site/Payment";
import { useTranslation } from "react-i18next";

const MakeAppt = () => {
    const { id } = useParams();
    const { t } = useTranslation()
    const navigate = useNavigate();
    const role = localStorage.getItem("role");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: bookingData, isLoading: bookingById } = useGetBookingByIdQuery(id || "")
    const [signin, { isLoading }] = useSigninMutation();
    const { data: profiles, isLoading: loadingProfile } = useGetAllProfileQuery();
    const [paymentFree, { isLoading: paymentFreeLoading }] = useCreateFreeOrderMutation();
    const [payment, { isLoading: paymentLoading }] = useCreatePaymentMutation();

    const onFinish = async (values: AuthSignin) => {
        try {
            const { email, password } = values;
            const rememberMe = true;
            const response = await signin({ email, password, rememberMe }).unwrap();

            // Lấy token từ kết quả trả về
            const accessToken = response?.data?.token;
            const refreshToken = response?.data?.refreshToken;
            const role = response?.data?.role;

            // Lưu token vào localStorage
            if (accessToken && refreshToken) {
                localStorage.setItem('token', accessToken);
                localStorage.setItem('rfToken', refreshToken);
                localStorage.setItem('role', role || "");
                Notifn("success", "Thành công", "Đăng nhập thành công");
                setIsModalOpen(false);
                window.location.reload();
                if (role === "ADMIN") {
                    navigate("/admin");
                } if (role === "DOCTOR") {
                    navigate("/doctor");
                }
            } else {
                throw new Error('Không có dữ liệu token hoặc refreshToken');
            }
        } catch (error) {

            Notifn("error", "Lỗi", (error as any).data || 'Có lỗi xảy ra');
        }
    };

    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */ }
    const onSubmit = (values: any) => {
        if (bookingData?.data?.whoPay === "1") {
            paymentFree({ ...values, idSchedule: id })
                .unwrap()
                .then(() => {
                    Notifn("success", "Thành công", "Đặt lịch thành công!");
                    navigate("/vnpay_return", { state: { isFree: "Yes" } });
                })
                .catch((error) => {
                    console.error(error);
                    Notifn("warning", "Cảnh báo", error.data.message || error.data);
                });
        } else {
            payment({ ...values, idSchedule: id })
                .unwrap()
                .then((response) => {
                    window.location.href = response.data.url;
                })
                .catch((error) => {
                    console.error(error);
                    Notifn("warning", "Cảnh báo", error.data.message || error.data);
                });
        }
    }

    const showModal = () => {
        setIsModalOpen(true);
    };

    const hiddenModal = () => {
        setIsModalOpen(false);
    };


    return (
        <Spin spinning={bookingById}>
            <div className="bg-gray-100 py-8">
                <div className="flex gap-4 items-start max-w-screen-md mx-auto px-12">
                    <img src={bookingData?.data?.doctorImg} alt="" className="w-28 h-28 rounded-full" />
                    <div className="text-gray-700 brightness-125">
                        <p className="uppercase">{t('makeAppt.booking')}</p>
                        <p className="text-blue-600 font-medium text-lg">{bookingData?.data?.doctorName}</p>
                        <p>{bookingData?.data?.startTime} - {bookingData?.data?.endTime} - {bookingData?.data?.date}</p>
                        <p dangerouslySetInnerHTML={{ __html: bookingData?.data?.price || '' }} />
                    </div>
                </div>
            </div>
            {role === "USER" ? (
                <div className="max-w-screen-md mx-auto my-8">
                    <Form
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        onFinish={onSubmit}
                    >
                        <Form.Item
                            label={t('makeAppt.lableReason')}
                            name="reasonBooking"
                            rules={[
                                { required: true, message: t('makeAppt.placeholderReason') },
                            ]}
                        >
                            <div style={{ position: 'relative' }}>
                                <Input.TextArea
                                    placeholder={t('makeAppt.placeholderReason')}
                                    style={{ paddingLeft: '40px' }}
                                    className="py-1"
                                />
                                <TbBrandReason style={{ position: 'absolute', top: '10px', left: '19px' }} />
                            </div>
                        </Form.Item>

                        <Form.Item
                            label={t('makeAppt.lableProfile')}
                            name="idProfile"
                            initialValue={null}
                            rules={[{ required: true, message: t('makeAppt.errorProfile') }]}
                        >
                            <Radio.Group>
                                {profiles?.data && profiles.data.length > 0 ? (

                                    profiles.data.map((item: any) => (
                                        <Radio key={item.id} value={item.id} style={{ margin: '0 8px 8px 0' }}>
                                            <Card style={{ width: 320 }} loading={loadingProfile}>
                                                <Meta
                                                    avatar={<Avatar src={item.imgUrl} size={46} />}
                                                    title={item.fullName}
                                                    description={item.genderValue || ''}
                                                />
                                            </Card>
                                        </Radio>
                                    ))
                                ) : (
                                    <div className="flex justify-center items-center mx-auto w-[300%]">
                                        <Empty
                                            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                                            imageStyle={{ height: 60 }}
                                            description={t('makeAppt.noProfile')}
                                            className="flex flex-col items-center"
                                        >
                                            <Link to={'/ho-so-kham-benh/them'} className="bg-blue-500 text-white p-2 rounded-md hover:text-white hover:bg-blue-400">{t('makeAppt.createProfile')}</Link>
                                        </Empty>
                                    </div>
                                )}

                            </Radio.Group>
                        </Form.Item>

                        <div className="bg-gray-50 p-4">
                            <div className="flex justify-between items-center mb-2">
                                <p>{t('makeAppt.priceExam')}</p>
                                <p>{t('makeAppt.descPrice')}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p>{t('makeAppt.priceBooking')}</p>
                                <p>
                                    {bookingData?.data?.whoPay === "1" ? (
                                        <span>{t('makeAppt.free')}</span>
                                    ) : (
                                        <span className="text-red-500">
                                            {Number(bookingData?.data?.bookingFee).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                        <p className="my-4 text-gray-500 text-center">{t('makeAppt.notePrice')}</p>
                        <div className="bg-[#D4EFFC] py-4 px-8 leading-8 mb-8">
                            <p className="font-medium text-lg uppercase">{t('makeAppt.note')}</p>
                            <p>{t('makeAppt.noteTitle')}</p>
                            <ul className="list-disc pl-4 ml-4">
                                <li><span>{t('makeAppt.noteDesc1')}</span></li>
                                <li><span>{t('makeAppt.noteDess2')}</span></li>
                            </ul>
                        </div>

                        <Form.Item labelAlign="left">
                            <Button type="primary" htmlType="submit" className="bg-blue-500 w-full" size="large" loading={paymentFreeLoading || paymentLoading}>
                                {t('makeAppt.btnBooking')}
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            ) : role === "DOCTOR" || role === "ADMIN" ? (
                <div className="max-w-screen-md mx-auto my-8">
                    <Button type="primary" danger className=" text-center w-full items-center flex justify-center cursor-not-allowed">{t('makeAppt.noPowers')}</Button>
                </div>
            ) : (
                <div className="max-w-screen-md mx-auto my-8">
                    <Button onClick={showModal} type="primary" className="bg-blue-500 w-full text-white items-center flex justify-center" size="large">
                        <UserOutlined /> {t('makeAppt.isBookingLogin')}
                    </Button>
                </div>
            )}

            <Modal width={500} open={isModalOpen} footer={null} onCancel={hiddenModal}>
                <section className="bg-white">
                    <h1 className="font-bold text-blue-500 text-3xl p-4">{t('makeAppt.login')}</h1>
                    <main className="flex items-center justify-center mt-2">
                        <Form
                            name="normal_login"
                            className="login-form"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                label={t('makeAppt.labelEmail')}
                                name="email"
                                rules={[{ required: true, message: t('makeAppt.errorEmail') }]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon p-3" />} placeholder={t('makeAppt.placeholderEmail')} />
                            </Form.Item>
                            <Form.Item

                                label={t('makeAppt.labelPassword')}
                                name="password"
                                rules={[{ required: true, message: t('makeAppt.errorPassword') }]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="site-form-item-icon p-3" />}
                                    placeholder={t('makeAppt.placeholderEmail')}
                                />
                            </Form.Item>

                            <Form.Item className='text-center'>
                                <Button type="primary" htmlType="submit" className="bg-blue-500 w-full" style={{ height: '45px' }} loading={isLoading}>
                                    {t('makeAppt.btnLogin')}
                                </Button>
                                <p className='my-2'>{t('makeAppt.or')}</p>
                                <p>{t('makeAppt.noAccount')}<Link to="/register" className='text-blue-500 hover:text-blue-800 hover:underline'>{t('makeAppt.signup')}</Link></p>

                            </Form.Item>
                        </Form>

                    </main>
                </section>
            </Modal>
        </Spin >
    )
}

export default MakeAppt