import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Empty, Pagination, Select, Spin } from "antd";
import { TbHandFinger } from "react-icons/tb";
import { MdDateRange, MdLocationOn } from "react-icons/md";
import { IBooking, IBookingChildren } from "../interface/Booking";
import { useTranslation } from "react-i18next";
import { convertToSlug } from "../utils/convertToSlug";


interface ServiceListProps {
    lstService: any;
    currentPage: number;
    handlePageChange: (page: number) => void;
    handleDateChange: (value: number, index: number) => void; // Thêm tham số index để xác định bác sĩ
    selectedDates: number[]; // Sử dụng mảng để lưu trữ lịch được chọn cho từng bác sĩ
    toggleShowMoreDetails: (index: number) => void;
    showMoreDetails: boolean[];
    doctorLoading: boolean;
}

const ListBooking: React.FC<ServiceListProps> = ({
    lstService,
    currentPage,
    handlePageChange,
    handleDateChange,
    selectedDates,
    toggleShowMoreDetails,
    showMoreDetails,
    doctorLoading
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleClick2 = (id: string | undefined, title: string | undefined) => {
        navigate(`/bac-si/${convertToSlug(t(title || ''))}`, { state: { id } });
    };

    return (
        <Spin spinning={doctorLoading}>
            {(!lstService?.data?.data || lstService?.data?.data.length === 0) ? (
                <Empty
                    className="flex flex-col justify-between items-center mb-4"
                    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                    imageStyle={{ height: 120 }}
                    description={
                        <span>
                            Chưa có lịch khám cho mục này !!
                        </span>
                    }
                >
                    <Button type="primary" className="bg-blue-500" onClick={() => navigate(-1)}>Quay lại</Button>
                </Empty>
            ) : (
                <div className='max-w-screen-xl mx-auto grid grid-cols-1 gap-4'>
                    {lstService?.data?.data.map((item: any, index: number) => (
                        <div key={item.id} className='py-3 rounded-xl shadow-md grid grid-cols-2 bg-white items-start'>
                            <div className='border-r border-gray-200 flex items-center gap-4 px-4'>
                                <div className='flex flex-col justify-center items-center mt-4 w-1/5'>
                                    <img src={item.imageUrl} alt="" className='w-20 h-20 rounded-full' />
                                </div>
                                <div className='w-4/5 hover:brightness-125 cursor-pointer' onClick={() => handleClick2(item.id, item.doctorName)}>
                                    <h3 className='font-medium text-xl text-blue-400'>{item.doctorName}</h3>
                                    <p className='flex gap-1 items-center text-gray-500 my-1.5'>
                                        <MdLocationOn />
                                        <span>{item.provinceName}</span>
                                    </p>
                                    <p className="text-gray-800">{item.pointsValue}</p>
                                </div>
                            </div>
                            <div className='px-4'>
                                <Select style={{ width: 150 }} value={selectedDates[index]} onChange={(value) => handleDateChange(value, index)} >
                                    {item?.schedules?.map((schedule: IBooking, index: number) => (
                                        <Select.Option key={schedule.id} value={index}>{schedule.date}</Select.Option>
                                    ))}
                                </Select>
                                {selectedDates[index] !== null && (
                                    <>
                                        <h3 className='flex gap-1 items-center uppercase my-2'>
                                            <MdDateRange />
                                            {t('listBooking.bookingTitle')}
                                        </h3>
                                        <div className='grid grid-cols-4 gap-3'>
                                            {item?.schedules[selectedDates[index]]?.schedules.map((schedule: IBookingChildren, scheduleIndex: number) => (
                                                <Link
                                                    to={`/dat-lich/${schedule.id}`}
                                                    key={scheduleIndex}
                                                    className={`bg-gray-100 py-3 text-center text-gray-800 text-sm font-medium ${schedule.status !== 1 ? 'pointer-events-none opacity-50' : ''}`}
                                                >
                                                    {`${schedule.startTime}-${schedule.endTime}`}
                                                </Link>
                                            ))}
                                        </div>
                                    </>
                                )}
                                <p className='text-gray-700 text-sm pt-1.5 my-1 border-b border-gray-200 pb-2.5 flex items-center'>
                                    {t('listBooking.selectAndSet')} <TbHandFinger className='mx-0.5 text-black' />
                                </p>
                                <div className='leading-6 border-b border-gray-200 pb-2'>
                                    <p className='uppercase text-gray-500 font-medium'>{t('listBooking.addressExamination')}</p>
                                    <p className='font-semibold'>{item.clinicName}</p>
                                    <p>{item.wardName} - {item.districtName} - {item.provinceName}</p>
                                </div>
                                <p className='border-b border-gray-200 py-2'>
                                    <span className='uppercase text-gray-500 font-medium mr-1'>{t('listBooking.priceExamitination')}</span>
                                    <span dangerouslySetInnerHTML={{ __html: item.note || '' }}></span>
                                    <div className="p-2 bg-gray-100 border border-gray-300 text-sm my-1">
                                        <p className="text-gray-600">{item.paymentMethod}</p>
                                    </div>
                                </p>
                                <div>
                                    <p className='mr-1'>
                                        <span className='uppercase text-gray-500 font-medium'>{t('listBooking.insurance')}</span>
                                        <span className='text-blue-400 ml-1 cursor-pointer' onClick={() => toggleShowMoreDetails(index)}>
                                            {showMoreDetails[index] ? '' : <span>{t('listBooking.moreDetail')}</span>}
                                        </span>
                                    </p>
                                    {showMoreDetails[index] && (
                                        <div>
                                            <div className="bg-gray-100 border border-gray-300 text-sm my-2">
                                                {item.warrantyPolicy.map((warranty: { name: string, value: string }) => (
                                                    <div className="border border-gray-300 p-2">
                                                        <h1 className="text-base">{warranty.name}</h1>
                                                        <p className="text-gray-600">{warranty.value}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <p onClick={() => toggleShowMoreDetails(index)} className='text-blue-400 ml-1 cursor-pointer'>{showMoreDetails[index] ? <span>{t('listBooking.hidden')}</span> : ''}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-center">
                        <Pagination
                            current={currentPage}
                            total={lstService?.data?.totalItems || 0}
                            pageSize={5}
                            onChange={handlePageChange}
                        />
                    </div>
                </div>
            )}

        </Spin>
    );
};

export default ListBooking;
