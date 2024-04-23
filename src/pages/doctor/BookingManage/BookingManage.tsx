import { Link, useNavigate, useParams } from "react-router-dom"
import { Button, Table, Space, Modal, Form, DatePicker, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { AiOutlineEdit } from "react-icons/ai";
import { ExclamationCircleFilled, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Notifn } from "../../../utils/Notification";
import { Key, useEffect, useState } from "react";
import { useDeleteBookingMutation, useSearchBookingMutation } from "../../../api/admin/Booking";
import dayjs from 'dayjs';
import { MdAddCard, MdDeleteOutline } from "react-icons/md";

const { confirm } = Modal;
const { RangePicker } = DatePicker;

const BookingManage = () => {
    const { idDoctor } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [idTime, setIdTime] = useState<Key[]>([]);

    const [searchBooking, { data, isLoading }] = useSearchBookingMutation();
    const [deleteBooking] = useDeleteBookingMutation();

    useEffect(() => {
        form.resetFields();
        searchBooking({ idDoctor: idDoctor || "", fromDate: "", toDate: "" });
    }, [searchBooking, idDoctor, form]);

    const showDeleteConfirm = (id: string[] | Key[]) => {
        if (id !== undefined) {
            confirm({
                title: 'Xác nhận xoá',
                icon: <ExclamationCircleFilled />,
                content: "Bạn có muốn xoá lịch khám này không ??",
                okText: 'Có',
                cancelText: 'Không',
                okType: 'danger',
                async onOk() {
                    try {
                        await deleteBooking({ idDoctor: idDoctor, idsToDelete: id })
                        Notifn("success", "Thành công", "Xoá lịch khám thành công thành công!");
                        await searchBooking({ idDoctor: idDoctor || "", fromDate: "", toDate: "" });
                        form.submit()
                    } catch (error) {
                        Notifn("error", "Lỗi", "Lỗi xoá");
                    }
                },
            });
        }
    };


    const handleSearch = (values: any) => {
        const fromDate = dayjs(values.name[0]).format('YYYY-MM-DD');
        const toDate = dayjs(values.name[1]).format('YYYY-MM-DD');
        searchBooking({
            idDoctor: idDoctor || "",
            fromDate: fromDate,
            toDate: toDate,
        });
    };

    const handleReset = () => {
        form.resetFields();
        searchBooking({ idDoctor: idDoctor || "", fromDate: "", toDate: "" });
    };


    const columns: ColumnsType<any> = [
        {
            title: 'STT',
            key: 'index',
            width: 100,
            render: (_text, _record, index) => index + 1,
        },
        {
            title: 'Ngày',
            dataIndex: 'date',
            key: 'date',

        },
        {
            title: 'Số lịch khám',
            dataIndex: 'schedulesCount',
            key: 'schedulesCount',
            render: (_text, record) => {
                if (record.schedules && Array.isArray(record.schedules)) {
                    return record.schedules.length;
                } else {
                    return 0;
                }
            },

        },
        {
            title: 'Action',
            key: 'action',

            render: (_text: any, _record: any) => (
                <Space size="middle">
                    <MdAddCard
                        title="Tạo lịch khám"
                        className={`text-2xl ${_record.isCreate === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:text-blue-400 cursor-pointer'}`}
                        onClick={() => {
                            if (_record.isCreate === 1) {
                                navigate(`/doctor/them-lich-kham/${idDoctor}`, { state: _record.date });
                            }
                        }}
                    />
                </Space>
            ),
        },

    ];


    const expandedRowRender = (record: any) => {
        const columns = [
            { title: 'Thời gian bắt đầu', dataIndex: 'startTime', key: 'startTime' },
            { title: 'Thời gian kết thúc', dataIndex: 'endTime', key: 'endTime' },
            {
                title: 'Trạng thái',
                dataIndex: 'statusValue',
                key: 'statusValue',
                render: (statusValue: string) => {
                    let color = '';

                    if (statusValue === 'EXPIRED') {
                        color = 'red';
                    } else if (statusValue === 'FULL_SLOT') {
                        color = 'orange';
                    } else if (statusValue === 'ACTIVE') {
                        color = 'green';
                    }

                    return (
                        <Tag color={color}>{statusValue}</Tag>
                    );
                },
            },
            { title: 'Lượng người tối đa', dataIndex: 'maxNumber', key: 'maxNumber' },
            { title: 'Thời gian hết hạn đặt', dataIndex: 'bookingExpiredTime', key: 'bookingExpiredTime' },
            { title: 'Quyền sửa xoá', dataIndex: 'isEditable', key: 'isEditable', render: (value: number) => (value === 1 ? 'Có' : 'Không') },
            {
                title: 'Action',
                key: 'action',

                render: (_text: any, _record: any) => (
                    <Space size="middle" className="text-xl">
                        {_record.isEditable === 1 ? (
                            <Link to={`/doctor/sua-lich-kham/${_record.id}/${idDoctor}`}>
                                <AiOutlineEdit className="text-yellow-400 hover:text-yellow-300" />
                            </Link>
                        ) : (
                            <AiOutlineEdit className="text-yellow-400 cursor-not-allowed opacity-50" />
                        )}
                        {_record.isEditable === 1 ? (
                            <MdDeleteOutline
                                className="cursor-pointer text-red-500 hover:text-red-400"
                                onClick={() => showDeleteConfirm([_record.id])}
                            />
                        ) : (
                            <MdDeleteOutline
                                className="text-red-500 cursor-not-allowed opacity-50"
                            />
                        )}
                    </Space>
                ),
            },
        ];

        const schedulesData = record.schedules.map((item: any) => ({
            ...item,
            key: item.id,
        }));
        return <Table
            columns={columns}
            dataSource={schedulesData}
            pagination={false}
            rowSelection={{
                type: 'checkbox',
                onChange: (selectedRowKeys) => {
                    setIdTime(selectedRowKeys)
                },

                getCheckboxProps: (record: any) => ({
                    disabled: record.isEditable === 0, // Column configuration not to be checked
                    name: record.isEditable,
                }),
            }}
        />;
    };


    const newData = data?.data.map((item: any, index: any) => ({
        ...item,
        key: index.toString(),
    }));

    return (
        <div className="">
            <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-semibold">Quản lý lịch khám</h2>
                <Button type="primary" className="bg-blue-600">
                    <Link to={`/doctor/them-lich-kham/${idDoctor}`}>Tạo lịch khám</Link>
                </Button>
            </div>
            <Form onFinish={handleSearch} form={form}>
                <div>
                    <div className="mb-4 grid grid-cols-4 gap-8 mx-6">
                        <div>
                            <p className="font-medium text-[17px] my-1.5 text-gray-700">Khoảng thời gian:</p>
                            <Form.Item name="name">
                                <RangePicker className="w-full h-10" />
                            </Form.Item>
                        </div>
                    </div>
                    <div className="mb-4 float-right mr-8 flex items-center gap-3">
                        <Button icon={<ReloadOutlined />} onClick={handleReset}>Đặt lại</Button>
                        <Button type="primary" icon={<SearchOutlined />} className="bg-blue-600" htmlType="submit">
                            Tìm kiếm
                        </Button>
                    </div>
                </div>
            </Form>
            <Button className='my-6' type='primary' danger onClick={() => showDeleteConfirm(idTime)} disabled={idTime.length === 0}>Xoá</Button>
            <Table
                columns={columns}
                dataSource={newData}
                loading={isLoading}
                scroll={{ y: 400 }}
                expandable={{ expandedRowRender }}
            />
        </div>
    )
}

export default BookingManage