import { useNavigate, useParams } from "react-router-dom";
import { EnterOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select, Spin } from 'antd';

import { Notifn } from "../../../utils/Notification";
import { useGetWhoPayQuery } from "../../../api/admin/Booking";
import dayjs from 'dayjs';
import { useEffect } from "react";
import { useGetByIdConfigQuery, useUpdateConfigMutation } from "../../../api/site/ConfigBooking";
const { RangePicker } = DatePicker;

const BookingConfigUpdate = () => {
    const { idDoctor, id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [updateConfig, { isLoading }] = useUpdateConfigMutation();
    const { data: dataConfig, isLoading: loading } = useGetByIdConfigQuery({ idDoctor: idDoctor || "", id: id || "" });
    const { data: whoPay } = useGetWhoPayQuery();

    useEffect(() => {
        if (dataConfig) {
            const newDetails = dataConfig?.data?.details.map((detail: any) => ({
                ...detail,
                expiredTime: dayjs(detail.bookingExpiredTime, 'HH:mm:ss'),
                time: [dayjs(detail.startTime, 'HH:mm:ss'), dayjs(detail.endTime, 'HH:mm:ss')]

            }));
            console.log(newDetails)
            form.setFieldsValue({
                name: dataConfig?.data.name,
                details: newDetails
            });
        }

    }, [dataConfig, form])


    const calculateExpiryTime = (startTime: dayjs.Dayjs | null, field: any) => {
        if (startTime) {
            const expiry = startTime.clone().subtract(1, 'hour'); // Tính thời gian hết hạn là thời gian bắt đầu trừ đi 1 tiếng

            const currentValues = form.getFieldValue('details'); // Lấy giá trị hiện tại của mảng details
            const updatedDetails = currentValues.map((detail: any, index: number) => {
                if (index === field) { //So sánh index với field được lấy từ form (field.name) xem có bằng nhau không nếu bằng nhau mới gán giá trị 
                    return {
                        ...detail,
                        expiredTime: expiry
                    };
                }
                return detail;
            });
            form.setFieldsValue({
                details: updatedDetails,
            });
        }
    };

    const handleTimeChange = (values: any, field: any) => {
        const startTime = values?.[0];
        calculateExpiryTime(startTime, field);
    };

    const onFinish = async (values: any) => {
        const newDetails = values.details.map((detail: any) => ({
            ...detail,
            bookingExpiredTime: dayjs(detail.expiredTime).format('HH:mm:ss'),
            startTime: dayjs(detail.time[0]).format('HH:mm:ss'),
            endTime: dayjs(detail.time[1]).format('HH:mm:ss')
        }));

        newDetails.forEach((detail: any) => {
            delete detail.time;
            delete detail.expiredTime;
            delete detail.id
        });

        await updateConfig({
            name: values.name,
            doctorInfosId: idDoctor,
            id: id,
            details: newDetails
        })
            .unwrap()
            .then(() => {
                Notifn("success", "Thành công", "Cập nhật cấu hình thành công");
                navigate(-1)
            })
            .catch((error: any) => {
                Notifn("error", "Lỗi", error.data.message || error.data);
            });
    };

    return (
        <Spin spinning={loading}>
            <button onClick={() => navigate(-1)}>Quay lại <EnterOutlined /></button>
            <h2 className="my-6 mx-16 text-2xl font-semibold">Sửa cấu hình lịch khám</h2>
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
                            label="Tên cấu hình"
                            name="name"
                            rules={[
                                { required: true, message: 'Trường này không được bỏ trống !' },
                                { min: 4, message: 'Tên cấu hình phải trên 4 kí tự !' },
                            ]}
                        >
                            <Input placeholder="Tên cấu hình" className="w-full" />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Phần mảng details */}
                <Form.List name="details" initialValue={[{}]}>
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map((field) => (
                                <Row gutter={30} className="border border-gray-300 p-3 mb-3" key={field.key}>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Lượng khách tối đa"
                                            name={[field.name, 'maxNumber']}
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
                                            label="Người thanh toán"
                                            name={[field.name, 'whoPay']}
                                            rules={[{ required: true, message: 'Trường này không được bỏ trống !' }]}
                                        >
                                            <Select placeholder="---Select---" className="w-full" allowClear>
                                                {whoPay?.data?.map((role: any) => (
                                                    <Select.Option key={role.code} value={role.code}>{role.value}</Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Thời gian khám"
                                            name={[field.name, 'time']}
                                            rules={[{ required: true, message: 'Trường này không được bỏ trống !' }]}
                                        >
                                            <RangePicker
                                                picker="time"
                                                className="w-full"
                                                placeholder={["Thời gian bắt đầu", "Thời gian kết thúc"]}
                                                onChange={(values) => handleTimeChange(values, field.name)}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Thời gian lịch đặt hết hạn"
                                            name={[field.name, 'expiredTime']}
                                            rules={[
                                                { required: true, message: "Trường này không được bỏ trống" }
                                            ]}
                                        >
                                            <DatePicker picker="time" className="w-full" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Button type="primary" danger onClick={() => remove(field.name)} className="w-full" disabled={fields.length === 1}>Xóa</Button>
                                    </Col>
                                </Row>
                            ))}
                            <Form.Item>
                                <Button type="default" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Thêm mục
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
                <Form.Item labelAlign="left">
                    <Button type="primary" htmlType="submit" className="bg-blue-500" loading={isLoading}>
                        Cập nhật
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    );
};

export default BookingConfigUpdate;
