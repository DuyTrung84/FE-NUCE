
import { Button, Dropdown, Modal, Space, Table } from 'antd'
import { Link, useParams } from 'react-router-dom'
import { useDeleteConfigMutation, useGetAllConfigsQuery } from '../../../api/site/ConfigBooking';
import { ColumnsType } from 'antd/es/table';
import { ExclamationCircleFilled, MoreOutlined } from '@ant-design/icons';
import { MenuItemType } from 'antd/es/menu/hooks/useItems';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { Notifn } from '../../../utils/Notification';

const { confirm } = Modal;
const BookingConfig = () => {
    const { idDoctor } = useParams();

    const { data, isLoading, isFetching } = useGetAllConfigsQuery(idDoctor || "");
    const [deleteConfig] = useDeleteConfigMutation();

    const showDeleteConfirm = (id: string | undefined) => {
        if (id !== undefined) {
            confirm({
                title: 'Xác nhận đổi xoá',
                icon: <ExclamationCircleFilled />,
                content: "Bạn có muốn xoá cấu hình này không ??",
                okText: 'Có',
                cancelText: 'Không',
                okType: 'danger',
                async onOk() {
                    try {
                        await deleteConfig({ id })
                            .unwrap()
                            .then(() => {
                                Notifn("success", "Thành công", "Xoá cấu hình thành công");
                                isFetching
                            })
                            .catch((error: any) => {
                                Notifn("error", "Lỗi", error.data.message || error.data);
                            })
                    } catch (error) {
                        Notifn("error", "Lỗi", "Lỗi xoá trạng thái");
                    }
                },
            });
        }
    };

    const columns: ColumnsType<any> = [
        {
            title: 'STT',
            key: 'index',
            width: 100,
            render: (_text, _record, index) => index + 1,
        },
        {
            title: 'Tên cấu hình',
            dataIndex: 'name',
            key: 'name',

        },
        {
            title: 'Action',
            key: 'action',
            fixed: 'right',
            width: 120,
            render: (_text, record) => {
                const items: MenuItemType[] = [
                    {
                        key: 'edit',
                        label: (
                            <Link to={`/doctor/sua-cau-hinh-lich/${idDoctor}/${record.id}`}>
                                <p className=""><AiOutlineEdit className="inline-block mr-2 text-xl " />Sửa</p>
                            </Link>
                        ),
                    },
                    {
                        key: 'delete',
                        label: (
                            <button onClick={() => { showDeleteConfirm(record.id) }}>
                                <p className="">
                                    <AiOutlineDelete className="inline-block mr-2 text-xl" />
                                    Xoá
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
        <div>
            <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-semibold">
                    Quản lý cấu hình lịch khám
                    {/* <Tooltip title="Khi bạn cấu hình lịch của bác sĩ/dịch vụ nào thì lịch đó sẽ tự được tạo hàng tuần!" color='blue'>
                        <QuestionCircleTwoTone twoToneColor='gold' style={{ fontSize: '18px', marginLeft: '8px' }} />
                    </Tooltip> */}
                </h2>
                <Button type="primary" className="bg-blue-500">
                    <Link to={`/doctor/them-cau-hinh-lich/${idDoctor}`}>Tạo cấu hình lịch khám</Link>
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={data?.data}
                loading={isLoading}
                scroll={{ y: 400 }}
            />
        </div>
    )
}

export default BookingConfig