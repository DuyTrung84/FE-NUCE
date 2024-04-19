import { Avatar, Button, Card, Checkbox, List, Modal, Spin } from 'antd';
import { useDeleteProfileMutation, useGetAllProfileQuery, useGetProfileById2Mutation } from '../../../api/site/Profile';
import { MdDeleteOutline, MdOutlineEdit, MdOutlineRemoveRedEye } from 'react-icons/md';
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Notifn } from '../../../utils/Notification';
import { ExclamationCircleFilled } from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';
const { confirm } = Modal;

const LstProfile = () => {
    const [displayCount, setDisplayCount] = useState(4);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [allDataDisplayed, setAllDataDisplayed] = useState(false); // State để kiểm tra đã hiển thị hết dữ liệu hay chưa
    const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

    const { data: profiles, isLoading } = useGetAllProfileQuery();
    const [deleteProfile] = useDeleteProfileMutation();
    const [call, { data: profileById, isLoading: loadingProfileById }] = useGetProfileById2Mutation()

    const data = useMemo(() => profiles?.data || [], [profiles]);

    useEffect(() => {
        if (data.length <= displayCount) {
            setAllDataDisplayed(true); // Nếu số lượng dữ liệu ít hơn hoặc bằng số lượng hiển thị, đánh dấu đã hiển thị hết dữ liệu
        } else {
            setAllDataDisplayed(false);
        }
    }, [data, displayCount]);

    const handleLoadMore = () => {
        setDisplayCount(prevCount => prevCount + 4);
    };

    const handleHideItems = () => {
        setDisplayCount(prevCount => prevCount - 4);
        setSelectedIds([]); // Xóa tất cả id đã chọn khi ẩn đi
    };

    const handleCheckboxChange = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(prevSelectedIds => prevSelectedIds.filter(selectedId => selectedId !== id));
        } else {
            setSelectedIds(prevSelectedIds => [...prevSelectedIds, id]);
        }
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedIds([]);
        } else {

            const allIds = data.map((item: any) => item.id);
            setSelectedIds(allIds);
        }
        setSelectAll(prevSelectAll => !prevSelectAll);
    };

    const showDeleteConfirm = (idsToDelete: string[]) => {
        if (idsToDelete.length > 0) {
            confirm({
                title: 'Xác nhận xoá!',
                icon: <ExclamationCircleFilled />,
                content: "Bạn có chắc muốn xoá hồ sơ này không?",
                okText: 'Có',
                cancelText: 'Không',
                okType: 'danger',
                async onOk() {
                    await deleteProfile({ idsToDelete: idsToDelete })
                        .unwrap()
                        .then(() => {
                            Notifn("success", "Thành công", "Xoá hồ sơ thành công!!")
                            setSelectedIds([])
                        })
                        .catch((error) => {
                            Notifn("error", "Lỗi", error.data.message || error.data);
                        })
                },
            });
        }
    };

    const handleViewProfile = (id: string) => {
        call(id);
        setShowProfileModal(true);
    };

    const handleModalClose = () => {
        setShowProfileModal(false);
    };

    return (
        <div className='mx-auto'>
            <h2 className='text-2xl font-medium mb-4'>Danh sách hồ sơ</h2>
            {selectedIds.length > 0 && (
                <div className='flex gap-2 items-center'>
                    <Button onClick={handleSelectAll}>{selectAll ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}</Button>
                    <Button type='primary' danger onClick={() => showDeleteConfirm(selectedIds)}>Xoá</Button>
                </div>
            )}
            <List
                className="demo-loadmore-list px-6 max-h-[400px] overflow-y-auto shadow-sm"
                loading={isLoading}
                itemLayout="horizontal"
                loadMore={null}
                dataSource={data.slice(0, displayCount)}

                renderItem={(item: any) => (
                    <div className='flex items-center gap-4'>
                        <Checkbox
                            onChange={() => handleCheckboxChange(item.id)}
                            checked={selectedIds.includes(item.id)}
                        />
                        <List.Item
                            actions={[
                                <button onClick={() => handleViewProfile(item.id)} key="list-loadmore-view"><MdOutlineRemoveRedEye className='text-blue-400 text-2xl hover:text-blue-300' /></button>,
                                <Link to={`sua/${item.id}`} key="list-loadmore-edit"><MdOutlineEdit className='text-yellow-400 text-2xl hover:text-yellow-300' /></Link>,
                                <button onClick={() => showDeleteConfirm([item.id])} key="list-loadmore-delete"><MdDeleteOutline className='text-red-400 text-2xl hover:text-red-300' /></button>,
                            ]}
                        >
                            <div className='min-w-48'>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.imgUrl} />}
                                    title={<a>{item.fullName}</a>}
                                    description={item.genderValue || ''}
                                />
                            </div >
                            <div className='w-[500px] flex justify-around items-center'>
                                <div>
                                    <p className='mb-1 font-medium'>Ngày sinh</p>
                                    <p>{item.birthdate}</p>
                                </div>
                                <div>
                                    <p className='mb-1 font-medium'>Email</p>
                                    <p>{item.email}</p>
                                </div>
                                <div>
                                    <p className='mb-1 font-medium'>Số điện thoại</p>
                                    <p>{item.phoneNumber}</p>
                                </div>
                            </div>
                        </List.Item>
                    </div>
                )}
            />
            {data.length > 4 && ( // Kiểm tra nếu có hơn 4 phần tử, thì hiển thị nút ẩn hoặc xem thêm
                <div className='mt-4 text-center'>
                    {allDataDisplayed ? (
                        <Button onClick={handleHideItems}>Ẩn</Button>
                    ) : (
                        <Button onClick={handleLoadMore}>Xem thêm</Button>
                    )}
                </div>
            )}

            <Modal
                title="Thông tin hồ sơ"
                visible={showProfileModal}
                onCancel={handleModalClose}
                footer={[
                    <Button key="close" onClick={handleModalClose}>
                        Đóng
                    </Button>
                ]}
            >
                <Spin spinning={loadingProfileById}>
                    <Card>
                        <Meta
                            avatar={<Avatar src={profileById?.data?.imgUrl} size={80} />}
                            title={profileById?.data?.fullName}
                            description={
                                <div className='leading-6 text-gray-700'>
                                    <p><span className='font-semibold'>Giới tính: </span> {profileById?.data?.genderValue}</p>
                                    <p><span className='font-semibold'>Ngày sinh: </span> {profileById?.data?.birthdate}</p>
                                    <p><span className='font-semibold'> Email: </span>{profileById?.data?.email}</p>
                                    <p><span className='font-semibold'>Số điện thoại: </span> {profileById?.data?.phoneNumber}</p>
                                    <p><span className='font-semibold'>Địa chỉ: </span> {profileById?.data?.address}</p>
                                    <p><span className='font-semibold'>Nghề nghiệp: </span> {profileById?.data?.job}</p>
                                    <p><span className='font-semibold'>Mã CCCD/CMND: </span> {profileById?.data?.cardId || 'Chưa cập nhật'}</p>
                                    <p><span className='font-semibold'>Mã thẻ bảo hiểm: </span> {profileById?.data?.warrantyId || 'Chưa cập nhật'}</p>
                                </div>
                            }
                        />
                    </Card>

                </Spin>
            </Modal>
        </div>
    );
};

export default LstProfile
