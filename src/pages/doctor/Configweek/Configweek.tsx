import { Button, Col, Row, Select, Tooltip, Form, Spin } from 'antd';
import { useGetAllConfigsQuery, useGetConfigsInAWeekQuery, useSaveConfigsInAWeekMutation } from '../../../api/site/ConfigBooking';
import { useParams } from 'react-router-dom';
import { QuestionCircleTwoTone } from '@ant-design/icons';
import { useEffect } from 'react';
import { Notifn } from '../../../utils/Notification';

const Configweek = () => {
    const { idDoctor } = useParams();
    const [form] = Form.useForm();

    const { data: dataConfig, isLoading: loading } = useGetAllConfigsQuery(idDoctor || "");
    const { data, isLoading: loadingData } = useGetConfigsInAWeekQuery(idDoctor || "");
    const [save, { isLoading }] = useSaveConfigsInAWeekMutation();
    console.log(data)
    useEffect(() => {
        form.setFieldsValue({
            monday: data?.data[0]?.config?.id,
            tuesday: data?.data[1]?.config?.id,
            wednesday: data?.data[2]?.config?.id,
            thursday: data?.data[3]?.config?.id,
            friday: data?.data[4]?.config?.id,
            saturday: data?.data[5]?.config?.id,
            sunday: data?.data[6]?.config?.id
        })
    })

    const onFinish = async (values: any) => {
        await save({ ...values, doctorInfosId: idDoctor })
            .unwrap()
            .then(() => {
                Notifn("success", "Thành công", "Cập nhật thành công")
            })
            .catch(error => {
                Notifn("error", "Lỗi", error.data.message || error.data);
            })
    }

    return (
        <Spin spinning={loadingData || isLoading}>
            <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-semibold">
                    Cấu hình lịch khám hàng tuần
                    <Tooltip title="Khi bạn cấu hình lịch của bác sĩ/dịch vụ nào thì lịch đó sẽ tự được tạo hàng tuần!" color='blue'>
                        <QuestionCircleTwoTone twoToneColor='gold' style={{ fontSize: '18px', marginLeft: '8px' }} />
                    </Tooltip>
                </h2>
            </div>
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
                            label="Thứ 2"
                            name="monday"
                        >
                            <Select
                                loading={loading}
                                className="w-full"
                                allowClear
                            >
                                {dataConfig?.data?.map((item: any) => (
                                    <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Thứ 3"
                            name="tuesday"
                        >
                            <Select
                                loading={loading}
                                className="w-full"
                                allowClear
                            >
                                {dataConfig?.data?.map((item: any) => (
                                    <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Thứ 4"
                            name="wednesday"
                        >
                            <Select
                                loading={loading}
                                className="w-full"
                                allowClear
                            >
                                {dataConfig?.data?.map((item: any) => (
                                    <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Thứ 5"
                            name="thursday"
                        >
                            <Select
                                loading={loading}
                                className="w-full"
                                allowClear
                            >
                                {dataConfig?.data?.map((item: any) => (
                                    <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Thứ 6"
                            name="friday"
                        >
                            <Select
                                loading={loading}
                                className="w-full"
                                allowClear
                            >
                                {dataConfig?.data?.map((item: any) => (
                                    <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Thứ 7"
                            name="saturday"
                        >
                            <Select
                                loading={loading}
                                className="w-full"
                                allowClear
                            >
                                {dataConfig?.data?.map((item: any) => (
                                    <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Chủ nhật"
                            name="sunday"
                        >
                            <Select
                                loading={loading}
                                className="w-full"
                                allowClear
                            >
                                {dataConfig?.data?.map((item: any) => (
                                    <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item labelAlign="left">
                    <Button type="primary" htmlType="submit" className="bg-blue-500" loading={isLoading}>
                        Thêm
                    </Button>
                </Form.Item>
            </Form>
        </Spin >
    )
}

export default Configweek;
