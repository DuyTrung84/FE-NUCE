import { Link } from "react-router-dom"
import { Button, Table, Space, Dropdown, Modal, Form, Select, Input, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { AiOutlineEdit, AiOutlineLock, AiOutlineUnlock } from "react-icons/ai";
import { ExclamationCircleFilled, MoreOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { useDeleteSpecialtyMutation, useSearchAllSpecialtyMutation } from "../../../api/admin/Specialty";
import { Notifn } from "../../../utils/Notification";
import { ISpecialty } from "../../../interface/Specialty";
import { MenuItemType } from "antd/es/menu/hooks/useItems";
import { useGetStatusQuery } from "../../../api/share/upload";
import { useEffect, useState } from "react";


const { confirm } = Modal;
const SpecialtyManage = () => {
    const [form] = Form.useForm();
    const [selectPage, setSelectPage] = useState(1);

    const [searchSpecialty, { data, isLoading }] = useSearchAllSpecialtyMutation();
    const [deleteSpecialty] = useDeleteSpecialtyMutation();
    const { data: statusData } = useGetStatusQuery()

    useEffect(() => {
        searchSpecialty({ name: "", status: "", page: 0, resultLimit: 10 });
    }, [searchSpecialty]);

    const showDeleteConfirm = (id: string | undefined, status: string) => {
        if (id !== undefined) {
            const contentMessage = status === "1"
                ? 'Bạn có muốn chuyển trạng thái chuyên khoa này sang Active không??'
                : 'Bạn có muốn chuyển trạng thái chuyên khoa này sang Inactive không??';
            confirm({
                title: 'Xác nhận chuyển trạng thái',
                icon: <ExclamationCircleFilled />,
                content: contentMessage,
                okText: 'Có',
                cancelText: 'Không',
                okType: 'danger',
                async onOk() {
                    try {
                        await deleteSpecialty({ id, status });
                        Notifn("success", "Thành công", "Đổi trạng thái thành công!!");
                        searchSpecialty({ name: form.getFieldValue('name'), status: form.getFieldValue('status'), page: selectPage - 1, resultLimit: 10 });
                    } catch (error) {
                        Notifn("error", "Lỗi", "Lỗi đổi trạng thái");
                    }
                },
            });
        }
    };


    const handleSearch = (values: any) => {
        searchSpecialty({
            name: values.name,
            status: values.status,
            page: 0,
            resultLimit: 10
        });
    };

    const handleReset = () => {
        form.resetFields();
        searchSpecialty({ name: "", status: "", page: 0, resultLimit: 10 });
    };

    const handlePaginationChange = (currentPage: number, pageSize?: number) => {
        setSelectPage(currentPage)
        searchSpecialty({
            name: form.getFieldValue('name'),
            status: form.getFieldValue('status'),
            page: currentPage - 1, // Trừ 1 vì API thường sử dụng index bắt đầu từ 0
            resultLimit: pageSize || 10, // Số lượng mục trên mỗi trang
        });
    };

    const columns: ColumnsType<ISpecialty> = [
        {
            title: 'STT',
            key: 'index',
            width: 100,
            render: (_text, _record, index) => index + 1,
        },
        {
            title: 'Tên chuyên khoa',
            dataIndex: 'name',
            key: 'name',

        },
        {
            title: 'Ảnh',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (imageUrl: string) => (
                <img src={imageUrl} alt="Ảnh" style={{ maxWidth: '100px', maxHeight: '100px' }} />
            ),

        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === "0" ? 'red' : 'green'}>
                    {status === "0" ? 'INACTIVE' : 'ACTIVE'}
                </Tag>
            ),
            width: 100
        },
        {
            title: 'Action',
            key: 'action',
            fixed: 'right',
            width: 100,
            render: (_text, record) => {
                const items: MenuItemType[] = [
                    {
                        key: 'edit',
                        label: (
                            <a href={`sua-chuyen-khoa/${record.id}`}>
                                <p className=""><AiOutlineEdit className="inline-block mr-2 text-xl " />Sửa</p>
                            </a>
                        ),
                    },
                    {
                        key: record.status === "1" ? 'active' : 'inactive',
                        label: (
                            <button onClick={() => { showDeleteConfirm(record.id, record.status === "1" ? "0" : "1") }}>
                                <p className="">
                                    {record.status === "1" ? <AiOutlineLock className="inline-block mr-2 text-xl" /> : <AiOutlineUnlock className="inline-block mr-2 text-xl" />}
                                    {record.status === "1" ? 'Inactive' : 'Active'}
                                </p>
                            </button>
                        ),
                    }

                ];
                return (
                    <div className="flex gap-2">
                        <Space size="middle">
                            <Dropdown menu={{ items }} trigger={['hover']}>
                                <a>
                                    <MoreOutlined />
                                </a>
                            </Dropdown>
                        </Space>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="">
            <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-semibold">Quản lý chuyên khoa</h2>
                <Button type="primary" className="bg-blue-500">
                    <Link to="/admin/them-chuyen-khoa">Tạo chuyên khoa</Link>
                </Button>
            </div>
            <Form onFinish={handleSearch} form={form}>
                <div>
                    <div className="mb-8 grid grid-cols-4 gap-8 mx-6">
                        <div>
                            <p className="font-medium text-[17px] my-1.5 text-gray-700">Tên chuyên khoa:</p>
                            <Form.Item name="name">
                                <Input placeholder="Nhập tên chuyên khoa" />
                            </Form.Item>
                        </div>
                        <div>
                            <p className="font-medium text-[17px] my-1.5 text-gray-700">Trạng thái:</p>
                            <Form.Item name="status">
                                <Select placeholder="---Select---" className="w-full" allowClear>
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    {statusData?.data?.map((status: any) => (
                                        <Select.Option key={status.value} value={status.value}>{status.name}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>
                    </div>
                    <div className="mb-8 float-right mr-8 flex items-center gap-3">
                        <Button icon={<ReloadOutlined />} onClick={handleReset}>Đặt lại</Button>
                        <Button type="primary" icon={<SearchOutlined />} className="bg-blue-600" htmlType="submit">
                            Tìm kiếm
                        </Button>
                    </div>
                </div>
            </Form>
            <Table
                columns={columns}
                dataSource={Array.isArray(data?.data?.data) ? data?.data?.data : []}
                loading={isLoading}
                scroll={{ y: 400 }}
                pagination={{
                    current: data?.data?.currentPage ? data.data.currentPage + 1 : 1,
                    total: data?.data?.totalItems,
                    pageSize: 10,
                    onChange: handlePaginationChange,
                }}
            />
        </div>
    )
}

export default SpecialtyManage