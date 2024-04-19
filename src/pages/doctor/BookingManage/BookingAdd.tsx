import { useLocation, useNavigate, useParams } from "react-router-dom";
import { EnterOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, InputNumber, Row, Select } from 'antd';

import { Notifn } from "../../../utils/Notification";
import { useAddBookingMutation, useGetWhoPayQuery } from "../../../api/admin/Booking";
import dayjs from 'dayjs';
import { useEffect, useState } from "react";

const { RangePicker } = DatePicker;

const BookingAdd = () => {
    const { idDoctor } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const location = useLocation();
    const [expiryTime, setExpiryTime] = useState<dayjs.Dayjs | null>(null); // Thêm state mới để lưu giá trị thời gian hết hạn

    const [addService, { isLoading }] = useAddBookingMutation();
    const { data: whoPay } = useGetWhoPayQuery()


    useEffect(() => {
        form.setFieldsValue({
            date: location?.state ? dayjs(location?.state) : undefined
        });
    }, [location, form])


    const calculateExpiryTime = (startTime: dayjs.Dayjs | null) => {
        if (startTime) {
            const expiry = startTime.clone().subtract(1, 'hour'); // Tính thời gian hết hạn là thời gian bắt đầu trừ đi 1 tiếng
            setExpiryTime(expiry);
            form.setFieldsValue({ expiredTime: expiry }); // Cập nhật giá trị mới cho trường thời gian hết hạn trong form
        }
    };

    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */ }
    const handleTimeChange = (values: any) => {
        const startTime = values?.[0];
        calculateExpiryTime(startTime);
    };

    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */ }
    const validateDate = (_rule: any, value: any, callback: any) => {
        if (value && dayjs(value).isBefore(dayjs(), 'day')) {
            callback('Ngày không được nhỏ hơn ngày hiện tại!');
        } else {
            callback();
        }
    };

    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */ }
    const onFinish = async (values: any) => {
        const date = dayjs(values.date).format('YYYY-MM-DD');
        const bookingExpiredTime = dayjs(values.expiredTime).format('HH:mm:ss');
        const startTime = dayjs(values.time[0]).format('HH:mm:ss');
        const endTime = dayjs(values.time[1]).format('HH:mm:ss');

        const mergedBookingExpiredTime = date.concat(' ', bookingExpiredTime);
        const mergedStartTime = date.concat(' ', startTime);
        const mergedEndTime = date.concat(' ', endTime);

        delete values.time
        delete values.date
        delete values.expiredTime

        await addService({
            ...values,
            bookingExpiredTime: mergedBookingExpiredTime,
            startTime: mergedStartTime,
            endTime: mergedEndTime,
            status: 1,
            idDoctor: idDoctor
        })
            .unwrap()
            .then(() => {
                Notifn("success", "Thành công", "Tạo lịch khám thành công");
                navigate(-1)
            })
            .catch((error) => {
                Notifn("error", "Lỗi", error.data.message || error.data);
            });
    };



    return (
        <div className="">
            <button onClick={() => navigate(-1)}>Quay lại <EnterOutlined /></button>
            <h2 className="my-6 mx-16 text-2xl font-semibold">Tạo lịch khám</h2>
            <Form className="mx-40"
                form={form}
                name="basic"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                onFinish={onFinish}
                labelWrap={true}
                autoComplete="off"
            >

                <Row gutter={30}>
                    <Col span={12}>
                        <Form.Item
                            label="Lượng khách tối đa"
                            name="maxNumber"
                            rules={[
                                { required: true, message: 'Trường này không được bỏ trống !' },
                                { type: 'number', min: 1, message: 'Lượng khách tối thiểu là 1!' },
                                { type: 'number', max: 15, message: 'Lượng khách tối đa là 15!' },
                            ]}
                        >
                            <InputNumber placeholder="Lượng khách tối đa" className="w-full" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="whoPay"
                            label="Người thanh toán"
                            rules={[
                                { required: true, message: 'Trường này không được bỏ trống !' },
                            ]}
                        >
                            <Select placeholder="---Select---" className="w-full" allowClear                               >
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {whoPay?.data?.map((role: any) => (
                                    <Select.Option key={role.code} value={role.code}>{role.value}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="date"
                            label="Ngày khám"
                            rules={[
                                { required: true, message: 'Trường này không được bỏ trống !' },
                                { validator: validateDate }
                            ]}
                        >
                            <DatePicker className="w-full" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={30}>
                    <Col span={12}>
                        <Form.Item
                            name="time"
                            label="Thời gian khám"
                            rules={[
                                { required: true, message: 'Trường này không được bỏ trống !' },
                            ]}
                        >
                            <RangePicker
                                picker="time"
                                className="w-full"
                                placeholder={["Thời gian bắt đầu", "Thời gian kết thúc"]}
                                onChange={handleTimeChange}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="expiredTime"
                            label="Thời gian lịch đặt hết hạn"
                            rules={[
                                { required: true, message: 'Trường này không được bỏ trống !' },
                            ]}
                        >
                            <DatePicker picker="time" className="w-full" value={expiryTime} />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item labelAlign="left">
                    <Button type="primary" htmlType="submit" className="bg-blue-500" loading={isLoading}>
                        Thêm
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default BookingAdd;
