import { useTranslation } from "react-i18next";
import { AiFillCalendar, AiFillClockCircle, AiFillHome } from "react-icons/ai";
import { useGetHistoryBookingMutation } from "../../api/site/Clinics";
import { useEffect, useState } from "react";
import { Button, DatePicker, Empty, Form, Input, Modal, Pagination, Select, Spin } from "antd";
import { FrownTwoTone, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
import { useGetStatusBookingQuery } from "../../api/admin/Booking";
import { useCancelAppointmentMutation } from "../../api/site/Payment";
import { Notifn } from "../../utils/Notification";

const { RangePicker } = DatePicker;

const AppointmentHist = () => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>(""); // State để lưu trữ id của lịch khám được chọn

    const [search, { data, isLoading }] = useGetHistoryBookingMutation();
    const { data: bookingStatus } = useGetStatusBookingQuery();
    const [cancel, { isLoading: cancelLoading }] = useCancelAppointmentMutation()

    useEffect(() => {
        fetchData(currentPage);
    }, [])


    const handleSearch = (values: any) => {
        const fromDate = values.name && values.name[0] ? dayjs(values.name[0]).format('YYYY-MM-DD') : '';
        const toDate = values.name && values.name[1] ? dayjs(values.name[1]).format('YYYY-MM-DD') : '';
        search({
            fromDate: fromDate,
            toDate: toDate,
            status: values.status,
            page: 0,
            resultLimit: 10
        });
    };

    const handleReset = () => {
        form.resetFields();
        search({ fromDate: "", toDate: "", status: "", page: 0, resultLimit: 10 });
    };


    const toggleItemContent = (itemId: any) => {
        setExpandedItems(prevState => ({
            ...prevState,
            [itemId]: !prevState[itemId]
        }));
    };

    const showModal = (idBooking: string) => {
        setSelectedAppointmentId(idBooking)
        setIsModalOpen(true);
    };

    const hiddenModal = () => {
        setIsModalOpen(false);
    };


    const onFinish = async (values: any) => {
        await cancel({ ...values, idBooking: selectedAppointmentId })
            .unwrap()
            .then(() => {
                Notifn("success", "Thành công", "Huỷ đặt lịch thành công");
                search({ fromDate: "", toDate: "", status: "", page: currentPage - 1, resultLimit: 10 })
                setIsModalOpen(false);
                form.submit();
            })
            .catch((error) => {
                Notifn("error", "Lỗi", error.data.message || error.data);
            })
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page); // Cập nhật currentPage với giá trị mới của trang
        fetchData(page); // Gọi hàm fetchData với giá trị mới của trang
    };

    const fetchData = (page: number) => {
        const date = form.getFieldValue('name')
        const fromDate = date && date[0] ? dayjs(date[0]).format('YYYY-MM-DD') : '';
        const toDate = date && date[1] ? dayjs(date[1]).format('YYYY-MM-DD') : '';
        search({
            fromDate: fromDate, toDate: toDate,
            status: form.getFieldValue('status'),
            page: page - 1, resultLimit: 10
        });
    };

    const countLines = (text: string): number => {
        return text.split('\n').length;
    };

    return (
        <div className="max-w-screen-xl mx-auto">
            <div className="flex items-center gap-1 my-4 text-[#45C3D2]">
                <a href="/" className="flex gap-1"><AiFillHome className="text-xl" />/</a>
                <p> {t('history')}</p>
            </div>
            <h2 className="font-bold text-xl mt-2 mb-5">{t('history')}</h2>
            <Form onFinish={handleSearch} form={form} className="my-4">
                <div className="flex gap-4">
                    <Form.Item name="name">
                        <RangePicker placeholder={['Từ ngày', 'Đến ngày']} />
                    </Form.Item>
                    <Form.Item name="status" className="w-44">
                        <Select placeholder="Trạng thái đặt lịch" className="w-96" allowClear>
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {bookingStatus?.data?.map((role: any) => (
                                <Select.Option key={role.value} value={role.value}>{role.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Button icon={<ReloadOutlined />} onClick={handleReset}>Đặt lại</Button>
                    <Button type="primary" icon={<SearchOutlined />} className="bg-blue-600" htmlType="submit">
                        Tìm kiếm
                    </Button>

                </div>
            </Form>
            <Spin spinning={isLoading}>
                <div className="grid grid-cols-1 gap-8 mx-24">
                    {data?.data?.data && data?.data?.data.length > 0 ? (
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        data?.data?.data.map((item: any) => (
                            <div className="grid grid-cols-4 items-center py-6 px-20 gap-4 border-2 rounded-xl shadow-lg">
                                <div className="col-span-1 flex flex-col gap-2 justify-center items-center ">
                                    <div className="border-2 border-gray-200 p-2 rounded-full w-24 h-24 flex justify-center items-center">
                                        <img src={item.patientProfile.imgUrl} alt="" className="w-20 h-20 object-cover rounded-full" />
                                    </div>
                                    <p className="font-semibold text-[#49BCE2] uppercase text-lg">Khám</p>
                                    <p className="flex gap-2 items-center text-[#FFC10E]">
                                        <AiFillClockCircle className="text-3xl" />
                                        <span className="text-lg font-medium">{item.timeStart}-{item.timeEnd}</span>
                                    </p>
                                    <p className="flex gap-2 items-center text-[#FFC10E]">
                                        <AiFillCalendar className="text-3xl" />
                                        <span className="text-lg font-medium">{item.date}</span>
                                    </p>
                                </div>
                                <div className="col-span-3 text-start grid grid-cols-1 gap-2 text-lg">
                                    <p className="font-semibold">Bệnh nhân: {item.patientProfile.fullName}</p>
                                    <p>Bác sĩ : <span className="text-[#45C3D2]">{item.doctorName}</span></p>
                                    <p>Nơi khám: {item.clinicName}</p>
                                    <p>Trạng thái:
                                        {item.status === 1 ? (
                                            <span className="text-green-500"> Đặt thành công</span>
                                        ) : item.status === 0 ? (
                                            <span className="text-red-500"> Lịch đã huỷ</span>
                                        ) : (
                                            <span className="text-blue-500"> Đã khám xong</span>
                                        )}
                                    </p>
                                    <p className={expandedItems[item.id] ? "" : "line-clamp-3"}>
                                        Lý do khám: {item.reasonBooking}
                                    </p>

                                    {countLines(item.reasonBooking) > 3 && (
                                        <span>
                                            {!expandedItems[item.id] && (
                                                <Button type="link" onClick={() => toggleItemContent(item.id)}>
                                                    Xem thêm
                                                </Button>
                                            )}
                                            {expandedItems[item.id] && (
                                                <Button type="link" onClick={() => toggleItemContent(item.id)}>
                                                    Ẩn đi
                                                </Button>
                                            )}
                                        </span>
                                    )}
                                    {item.status === 0 && (
                                        <p>Lý do huỷ: {item.reasonCancel}</p>
                                    )}
                                    <button
                                        className={`text-center text-white px-6 py-3 mt-2 w-2/5 rounded-lg font-semibold
                                         ${item.isCancel === 1 ? "bg-[#FFC20E] hover:bg-yellow-400 cursor-pointer" : "bg-gray-400 cursor-not-allowed"}`}
                                        disabled={item.isCancel !== 1}
                                        onClick={() => showModal(item.id)}
                                    >
                                        {item.status === 1 ? (
                                            <span>Huỷ lịch khám</span>
                                        ) : item.status === 0 ? (
                                            "Lịch đã huỷ"
                                        ) : (
                                            "Đã khám xong"
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <Empty
                            image={<FrownTwoTone />}
                            imageStyle={{ fontSize: 60 }}
                            description={<span>Không tìm thấy lịch khám phù hợp</span>}
                        />
                    )}
                </div>
            </Spin>
            <Pagination
                current={currentPage}
                total={data?.data?.totalPages * 10}
                pageSize={10}
                onChange={handlePageChange}
                className="text-center mt-8"
            />

            <Modal width={500} open={isModalOpen} footer={null} onCancel={hiddenModal}>
                <Form
                    name="normal_login"
                    className="login-form"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Lý do huỷ"
                        name="reasonCancel"
                        rules={[{ required: true, message: "Vui lòng nhập lý do huỷ!!" }]}
                    >
                        <Input placeholder="Nhập lý do huỷ" />
                    </Form.Item>

                    <Form.Item className='text-center'>
                        <Button type="primary" htmlType="submit" className="bg-blue-500 w-full" style={{ height: '45px' }} loading={cancelLoading}>
                            Huỷ đặt lịch
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default AppointmentHist