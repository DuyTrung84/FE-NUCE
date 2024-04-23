import { Link } from "react-router-dom"
import { Button, Table, Space, Dropdown, Modal, Tag, Select, Input, Form } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { AiOutlineLock, AiOutlineUnlock } from "react-icons/ai";
import { EditOutlined, ExclamationCircleFilled, MoreOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Notifn } from "../../../utils/Notification";
import { MenuItemType } from "antd/es/menu/hooks/useItems";
import { IAccount } from "../../../interface/Account";
import { useDeleteAccountMutation, useGetAllAccountMutation, useGetRoleQuery } from "../../../api/admin/Account";
import { Option } from "antd/es/mentions";
import { useEffect, useState } from "react";
import { RiServiceLine } from "react-icons/ri";
import { useGetStatusQuery } from "../../../api/share/upload";
import { useGetAllSpecialtyQuery } from "../../../api/admin/Specialty";
import { useGetAllClinicsNChildrenQuery } from "../../../api/site/Clinics";

const { confirm } = Modal;
const AccountManage = () => {
    const [form] = Form.useForm();
    const [selectPage, setSelectPage] = useState(1);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    const [searchAccount, { data, isLoading }] = useGetAllAccountMutation();
    const [deleteAccount] = useDeleteAccountMutation();
    const { data: selectRole, isLoading: loadingRole } = useGetRoleQuery();
    const { data: statusData } = useGetStatusQuery();
    const { data: specialty } = useGetAllSpecialtyQuery({ name: "", status: "", page: 0, resultLimit: 500 });//Chuyên khoa
    const { data: clinics } = useGetAllClinicsNChildrenQuery({ search: "", province: "", status: "", page: 0, resultLimit: 500 });//Phòng khám

    useEffect(() => {
        searchAccount({ keyword: null, role: null, status: null, clinic: null, speciality: null, page: 0, resultLimit: 10 });
    }, [searchAccount]);

    const showDeleteConfirm = (id: string | undefined, status: string) => {
        if (id !== undefined) {
            const contentMessage = status === "1"
                ? 'Bạn có muốn chuyển trạng thái tài khoản này sang Active không??'
                : 'Bạn có muốn chuyển trạng thái tài khoản này sang Inactive không??';
            confirm({
                title: 'Xác nhận xoá',
                icon: <ExclamationCircleFilled />,
                content: contentMessage,
                okText: 'Có',
                cancelText: 'Không',
                okType: 'danger',
                async onOk() {
                    try {
                        await deleteAccount({ id, status });
                        Notifn("success", "Thành công", "Đã chuyển trạng thái tài khoản thành công!");
                        searchAccount({
                            keyword: form.getFieldValue('keyword'), role: form.getFieldValue('role'), status: form.getFieldValue('status'), clinic: form.getFieldValue('clinic'),
                            speciality: form.getFieldValue('specialityId'), page: selectPage - 1, resultLimit: 10
                        });

                    } catch (error) {
                        Notifn("error", "Lỗi", "Lỗi khoá");
                    }
                },
            });
        }
    };

    const handleSearch = (values: any) => {
        searchAccount({
            keyword: values.keyword,
            role: values.role,
            status: values.status,
            clinic: values.clinic,
            speciality: values.specialityId,
            page: 0,
            resultLimit: 10
        });
    };

    const handleReset = () => {
        form.resetFields();
        searchAccount({ keyword: null, role: null, status: null, clinic: null, speciality: null, page: 0, resultLimit: 10 });
    };

    const handlePaginationChange = (currentPage: number, pageSize?: number) => {
        setSelectPage(currentPage)
        searchAccount({
            keyword: form.getFieldValue('keyword'),
            role: form.getFieldValue('role'),
            status: form.getFieldValue('status'),
            clinic: form.getFieldValue('clinic'),
            speciality: form.getFieldValue('specialityId'),
            page: currentPage - 1, // Trừ 1 vì API thường sử dụng index bắt đầu từ 0
            resultLimit: pageSize || 10, // Số lượng mục trên mỗi trang
        });
    };

    const columns: ColumnsType<IAccount> = [
        {
            title: 'STT',
            key: 'index',
            width: 60,
            render: (_text, _record, index) => index + 1,
        },
        {
            title: 'Tên người dùng',
            dataIndex: 'name',
            key: 'name',

        },
        {
            title: 'Email tài khoản',
            dataIndex: 'email',
            key: 'email',

        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            render: (role: string) => {
                let tagColor: string;
                if (role === 'ADMIN') {
                    tagColor = 'gold';
                } else if (role === 'USER') {
                    tagColor = 'blue';
                } else if (role === 'DOCTOR') {
                    tagColor = 'cyan';
                } else {
                    tagColor = 'default_color';
                }
                return <Tag color={tagColor}>{role}</Tag>;
            },
            width: 100
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
            title: 'Ảnh',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (avatar: string) => (
                <img src={`${avatar}`} alt="Ảnh" style={{ maxWidth: '80px', maxHeight: '80px' }} />
            ),
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
                            <button onClick={() => { showDeleteConfirm(record.id, record.status === "1" ? "0" : "1") }}>
                                <p className="">
                                    {record.status === "1" ? <AiOutlineLock className="inline-block mr-2 text-xl" /> : <AiOutlineUnlock className="inline-block mr-2 text-xl" />}
                                    {record.status === "1" ? 'Inactive' : 'Active'}
                                </p>
                            </button>
                        ),
                    },
                ];
                if (record.role === "DOCTOR") {
                    items.push(
                        {
                            key: 'edit',
                            label: (
                                <a href={`cap-nhat-bac-si/${record.id}`}>
                                    <p className=""><EditOutlined className="inline-block mr-2 text-xl" />Sửa</p>
                                </a>
                            ),
                        },
                        {
                            key: 'manage',
                            label: (
                                <a href={`quan-ly-dich-vu/${record.id}`}>
                                    <p className=""><RiServiceLine className="inline-block mr-2 text-xl" />Quản lý dịch vụ</p>
                                </a>
                            ),
                            disabled: record.status === '1' ? false : true
                        },
                    );
                }
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
                <h2 className="text-2xl font-semibold">Quản lý tài khoản</h2>
                <Button type="primary" className="bg-blue-600">
                    <Link to="/admin/them-tai-khoan">Tạo tài khoản</Link>
                </Button>
            </div>
            <Form onFinish={handleSearch} form={form}>
                <div>
                    <div className="mb-8 grid grid-cols-4 gap-8 mx-6">
                        <div>
                            <p className="font-medium my-1.5 text-gray-700">Tên người dùng:</p>
                            <Form.Item name="keyword">
                                <Input placeholder="Nhập tên người dùng" />
                            </Form.Item>
                        </div>
                        <div>
                            <p className="font-medium my-1.5 text-gray-700">Vai trò:</p>
                            <Form.Item name="role">
                                <Select placeholder="---Select---" className="w-full" loading={loadingRole} allowClear onChange={setSelectedRole}>
                                    {selectRole?.data?.map((role: any) => (
                                        <Option key={role.value} value={role.value}>{role.name}</Option>
                                    ))}
                                </Select>
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
                        {selectedRole === 'DOCTOR' && (
                            <>
                                <div>
                                    <p className="font-medium my-1.5 text-gray-700">Phòng khám:</p>
                                    <Form.Item name="clinic">
                                        <Select placeholder="---Phòng khám---" allowClear>

                                            {clinics?.data?.data?.map((clinic: any) => (
                                                <Select.Option key={clinic.id} value={clinic.id}>{clinic.name}</Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </div>

                                <div>
                                    <p className="font-medium my-1.5 text-gray-700">Chuyên khoa:</p>
                                    <Form.Item name="specialityId">
                                        <Select placeholder="---Chuyên khoa---" allowClear>

                                            {specialty?.data?.data?.map((speciality: any) => (
                                                <Select.Option key={speciality.id} value={speciality.id}>{speciality.name}</Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </div>
                            </>
                        )}
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
                scroll={{ y: "50vh" }}
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

export default AccountManage