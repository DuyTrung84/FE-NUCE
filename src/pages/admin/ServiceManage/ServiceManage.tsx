import { Button, Table, Space, Dropdown, Modal, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { AiOutlineLock, AiOutlineUnlock } from "react-icons/ai";
import { EditOutlined, ExclamationCircleFilled, MoreOutlined } from "@ant-design/icons";
import { Notifn } from "../../../utils/Notification";
import { MenuItemType } from "antd/es/menu/hooks/useItems";
import { useEffect, useState } from "react";
import { Key } from 'antd/es/table/interface';
import { useDeleterServiceDoctorMutation, useGetAllServiceMutation } from '../../../api/admin/Service';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const { confirm } = Modal;
const ServiceManage = () => {
    const { idDoctor } = useParams();
    const [idService, setIdService] = useState<Key[]>([]);

    const [doSearch, { data, isLoading }] = useGetAllServiceMutation()
    const [deleteService] = useDeleterServiceDoctorMutation()

    useEffect(() => {
        doSearch(idDoctor || "")
    }, [doSearch, idDoctor])

    const showDeleteConfirm = (id: string[] | Key[], status: number | undefined) => {
        if (id !== undefined) {
            const contentMessage = status === 1
                ? 'Bạn có muốn chuyển trạng thái dịch vụ này sang Active không??'
                : 'Bạn có muốn chuyển trạng thái dịch vụ này sang Inactive không??';
            confirm({
                title: 'Xác nhận xoá',
                icon: <ExclamationCircleFilled />,
                content: contentMessage,
                okText: 'Có',
                cancelText: 'Không',
                okType: 'danger',
                async onOk() {
                    try {
                        await deleteService({ idServicesToDelete: id, status })
                        Notifn("success", "Thành công", "Đã chuyển trạng thái dịch vụ thành công!");
                        await doSearch(idDoctor || "")
                    } catch (error) {
                        Notifn("error", "Lỗi", "Lỗi khoá");
                    }
                },
            });
        }
    };


    const columns: ColumnsType<any> = [
        {
            title: 'STT',
            key: 'index',
            width: 60,
            render: (_text, _record, index) => index + 1,
        },
        {
            title: 'Tên dịch vụ',
            dataIndex: 'doctorName',
            key: 'doctorName',

        },
        {
            title: 'Chuyên khoa',
            dataIndex: 'specialityName',
            key: 'specialityName',

        },
        {
            title: 'Phòng khám',
            dataIndex: 'clinicName',
            key: 'clinicName',
            width: 400

        },
        {
            title: 'Giá',
            dataIndex: 'note',
            key: 'note',
            render: (note: string) => (
                <p dangerouslySetInnerHTML={{ __html: note || '' }}></p>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: number) => {
                if (status === 1) {
                    return (
                        <div className="flex gap-2">
                            <Tag color='green'>ACTIVE</Tag>
                        </div>
                    );
                } else if (status === 4) {
                    return (
                        <div className="flex gap-2">
                            <Tag color='#bfbfbf'>BLOCKED</Tag>
                        </div>
                    );
                } else {
                    return (
                        <div className="flex gap-2">
                            <Tag color='red'>INACTIVE</Tag>
                        </div>
                    );
                }
            },
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
                        key: record.status === "1" ? 'active' : 'inactive',
                        label: (
                            <button

                                onClick={() => { showDeleteConfirm([record.id], record.status === 1 ? 0 : 1) }}>
                                <p className="">
                                    {record.status === 1 ? <AiOutlineLock className="inline-block mr-2 text-xl" /> : <AiOutlineUnlock className="inline-block mr-2 text-xl" />}
                                    {record.status === 1 ? 'Inactive' : 'Active'}
                                </p>
                            </button>
                        ),
                    },
                    {
                        key: 'edit',
                        label: (
                            <Link to={`/admin/cap-nhat-dich-vu/${record.id}`}>
                                <p className=""><EditOutlined className="inline-block mr-2 text-xl" />Sửa</p>
                            </Link>
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


    const dataSourceWithKeys = Array.isArray(data?.data) ? data?.data.map((item: any) => ({ ...item, key: item.id })) : [];
    return (
        <div className="">
            <div className="flex justify-between">
                <h2 className="text-2xl font-semibold">Quản lý lịch hẹn đã đặt (Bác sĩ: {data?.message})</h2>
                <Button type="primary" className="bg-blue-600">
                    <Link to={`/admin/them-nhat-dich-vu/${idDoctor}`}>Tạo dịch vụ</Link>
                </Button>
            </div>
            <Button className='my-6' type='primary' danger onClick={() => showDeleteConfirm(idService, 0)} disabled={idService.length === 0}>InActive</Button>
            <Table
                columns={columns}
                dataSource={dataSourceWithKeys}
                loading={isLoading}
                scroll={{ y: 540 }}
                rowSelection={{
                    type: 'checkbox',
                    onChange: (selectedRowKeys) => {
                        setIdService(selectedRowKeys)
                    },
                    getCheckboxProps: (record: any) => ({
                        disabled: record.status === 0, // Column configuration not to be checked
                        name: record.status,
                    }),
                }}
            />
        </div>
    )
}

export default ServiceManage