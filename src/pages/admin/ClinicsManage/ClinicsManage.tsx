import { Link } from "react-router-dom"
import { Button, Table, Space, Dropdown, Modal, Tag, Form, Input, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { AiOutlineEdit, AiOutlineLock, AiOutlineUnlock } from "react-icons/ai";
import { DownOutlined, ExclamationCircleFilled, MoreOutlined, ReloadOutlined, SearchOutlined, UpOutlined } from "@ant-design/icons";
import { Notifn } from "../../../utils/Notification";
import { MenuItemType } from "antd/es/menu/hooks/useItems";
import { useDeleteClinicsMutation, useSearchClinicsMutation } from "../../../api/site/Clinics";
import { IClinics } from "../../../interface/Clinics";
import { useGetStatusQuery } from "../../../api/share/upload";
import { useEffect, useState } from "react";
import { useGetProvincesQuery } from "../../../api/share/area";

const { confirm } = Modal;
const ClinicsManage = () => {
    const [form] = Form.useForm();
    const [selectPage, setSelectPage] = useState(1);

    const [searchClinics, { data, isLoading }] = useSearchClinicsMutation();
    const [deleteClinics] = useDeleteClinicsMutation();
    const { data: statusData } = useGetStatusQuery();
    const { data: provinces } = useGetProvincesQuery();

    useEffect(() => {
        // Gọi API để tìm kiếm với giá trị ban đầu
        searchClinics({ search: "", province: "", status: "", page: 0, resultLimit: 10 });
    }, [searchClinics]);

    const showDeleteConfirm = (id: string | undefined, status: string) => {
        if (id !== undefined) {
            const contentMessage = status === "1"
                ? 'Bạn có muốn chuyển trạng thái phòng khám này sang Active không??'
                : 'Bạn có muốn chuyển trạng thái phòng khám này sang Inactive không??';
            confirm({
                title: 'Xác nhận đổi trạng thái',
                icon: <ExclamationCircleFilled />,
                content: contentMessage,
                okText: 'Có',
                cancelText: 'Không',
                okType: 'danger',
                async onOk() {
                    try {
                        await deleteClinics({ id, status });
                        Notifn("success", "Thành công", "Đã đổi trạng thái phòng khám thành công");
                        searchClinics({ search: form.getFieldValue('search'), province: form.getFieldValue('province'), status: form.getFieldValue('status'), page: selectPage - 1, resultLimit: 10 });
                    } catch (error) {
                        Notifn("error", "Lỗi", "Lỗi đổi trạng thái");
                    }
                },
            });
        }
    };

    const handleSearch = (values: any) => {
        searchClinics({
            search: values.search,
            province: values.province,
            status: values.status,
            page: 0,
            resultLimit: 10
        });
    };

    const handleReset = () => {
        form.resetFields();
        searchClinics({ search: "", province: "", status: "", page: 0, resultLimit: 10 });
    };

    const handlePaginationChange = (currentPage: number, pageSize?: number) => {
        setSelectPage(currentPage)
        searchClinics({
            search: form.getFieldValue('search'),
            province: form.getFieldValue('province'),
            status: form.getFieldValue('status'),
            page: currentPage - 1, // Trừ 1 vì API thường sử dụng index bắt đầu từ 0
            resultLimit: pageSize || 10, // Số lượng mục trên mỗi trang
        });
    };

    const columns: ColumnsType<IClinics> = [
        {
            title: 'STT',
            key: 'index',
            width: 100,
            render: (_text, record, index) => {
                const stt = record.stt || undefined;
                const key = stt ? `${stt + 1}` : `${index + 1}`;
                return key;
            },
        },
        {
            title: 'Tên phòng khám',
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
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address'
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
                            <a href={`sua-phong-kham/${record.id}`}>
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

    const expandIcon = ({ expanded, onExpand, record }: { expanded: any, onExpand: any, record: any }) => {
        if (!record.children || record.children.length === 0) {
            return null;
        }
        return expanded ? <UpOutlined onClick={(e) => onExpand(record, e)} className="mr-3" /> : <DownOutlined onClick={(e) => onExpand(record, e)} className="mr-3" />;
    };

    const renderIndex = (index: number, subIndex: number) => {
        return index + subIndex * 0.1;
    };


    const newData = data?.data?.data.map((item: any, index: any) => {
        let subIndex = 1;
        const newChildren = item.children?.map((child: any) => ({
            ...child,
            stt: renderIndex(index, subIndex++),
        }));
        return {
            ...item,
            key: index.toString(),
            children: newChildren,
        };
    });

    return (
        <div className="">
            <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-semibold">Quản lý phòng khám</h2>
                <Button type="primary" className="bg-blue-500">
                    <Link to="/admin/them-phong-kham">Tạo phòng khám</Link>
                </Button>
            </div>
            <Form onFinish={handleSearch} form={form}>
                <div>
                    <div className="mb-8 grid grid-cols-4 gap-8 mx-6">
                        <div>
                            <p className="font-medium my-1.5 text-gray-700">Tên phòng khám:</p>
                            <Form.Item name="search">
                                <Input placeholder="Nhập tên phòng khám" />
                            </Form.Item>
                        </div>
                        <div>
                            <p className="font-medium my-1.5 text-gray-700">Trạng thái:</p>
                            <Form.Item name="status">
                                <Select placeholder="---Select---" className="w-full" allowClear>
                                    {statusData?.data?.map((status: any) => (
                                        <Select.Option key={status.value} value={status.value}>{status.name}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>
                        <div>
                            <p className="font-medium my-1.5 text-gray-700">Quận/Huyện:</p>
                            <Form.Item name="province">
                                <Select placeholder="---Select---" allowClear>
                                    {provinces?.data?.map((province: any) => (
                                        <Select.Option key={province.code} value={province.code}>{province.name}</Select.Option>
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
                dataSource={newData}
                loading={isLoading}
                scroll={{ y: 400 }}
                expandable={{
                    expandIcon,
                }}

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

export default ClinicsManage