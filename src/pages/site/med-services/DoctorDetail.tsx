import { useLocation } from "react-router-dom";
import { useGetByIdDoctorQuery } from "../../../api/admin/Doctor";
import { Select, Spin } from "antd";
import { AiFillHome, AiOutlineCaretDown, AiOutlineCaretUp } from "react-icons/ai";
import { MdDateRange, MdLocationPin } from "react-icons/md";
import { TbHandFinger } from "react-icons/tb";
import { useState } from "react";
import { IBooking, IBookingChildren } from "../../../interface/Booking";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NotFound from "../../../components/NotFound";

const DoctorDetail = () => {
    const { t } = useTranslation();
    const [showMore, setShowMore] = useState(false);
    const [showMore2, setShowMore2] = useState(false);
    const [selectedDate, setSelectedDate] = useState(0);
    const location = useLocation();
    const isCheck = location.pathname.split('/')[1];

    const { data: doctorData, isLoading: doctorLoading } = useGetByIdDoctorQuery(location.state.id)

    const toggleShowMore = () => {
        setShowMore(!showMore);
    };

    const toggleShowMore2 = () => {
        setShowMore2(!showMore2);
    };

    const handleDateChange = (value: number) => {
        setSelectedDate(value);
    };

    return (
        <Spin spinning={doctorLoading}>
            {doctorData ? (
                <div className="max-w-screen-xl mx-auto px-12 py-4">
                    <div className="flex items-center gap-1 my-4 text-[#45C3D2] ">
                        <a href="/" className="flex gap-1"><AiFillHome className="text-xl" />/</a>
                        {isCheck === "bac-si" ? (
                            <p> {t('doctorDetail.doctor')} /{doctorData?.data?.specialityName}</p>
                        ) : isCheck === "dich-vu" ? (
                            <p>{t('doctorDetail.service')}/{doctorData?.data?.specialityName}</p>
                        ) : null}
                    </div>
                    <div className="flex gap-8 w-4/6 text-[#555555] leading-6">
                        <img src={doctorData?.data?.imageUrl} alt="" className="w-32 h-32 rounded-full" />
                        <div>
                            <h2 className="text-[27px] font-medium text-gray-800">{doctorData?.data?.doctorName}</h2>
                            <p className="mt-2 text-lg font-medium ml-2">{doctorData?.data?.pointsValue}</p>
                            <p className="flex gap-1 items-center text-lg mt-2">
                                <MdLocationPin /> {doctorData?.data?.provinceName}</p>
                            <p className="text-lg font-semibold text-gray-700 ml-2 mt-1">Giới thiệu về bác sĩ:</p>
                            <div className={`${showMore2 ? "max-h-full" : "max-h-32 overflow-hidden"} transition-max-h duration-500 ease-in-out ml-3`}>
                                <p className=" my-2" dangerouslySetInnerHTML={{ __html: doctorData?.data?.descriptionHtml || '' }}></p>
                            </div>
                            <button
                                className="mt-2 flex text-[#288AD6] font-light"
                                onClick={toggleShowMore2}
                            >
                                {showMore2
                                    ? <span>{t('clinicsDetail.hidden')}< AiOutlineCaretUp className="inline-block" /></span>
                                    : <span>{t('clinicsDetail.more')}< AiOutlineCaretDown className="inline-block" /></span>}
                            </button>
                        </div>
                    </div>
                    <div className='py-3 my-3 grid grid-cols-2 gap-16 bg-white items-start'>
                        <Spin spinning={doctorLoading}>
                            <div className='px-4'>
                                <Select style={{ width: 150 }} value={selectedDate} onChange={handleDateChange}>
                                    {doctorData?.data?.schedules.map((item: IBooking, index: number) => (
                                        <Select.Option key={index} value={index}>{item.date}</Select.Option>
                                    ))}
                                </Select>
                                {selectedDate !== null && (
                                    <>
                                        <h3 className='flex gap-1 items-center uppercase my-2'>
                                            <MdDateRange />
                                            {t('doctorDetail.bookingTitle')}
                                        </h3>
                                        <div className='grid grid-cols-4 gap-3'>
                                            {doctorData?.data?.schedules[selectedDate]?.schedules.map((schedule: IBookingChildren, index: number) => (
                                                <Link
                                                    to={`/dat-lich/${schedule.id}`}
                                                    key={index} className={`bg-gray-100 py-3 text-center text-gray-800 text-sm font-medium ${schedule.status !== 1 ? 'pointer-events-none opacity-50' : ''}`}>
                                                    {`${schedule.startTime}-${schedule.endTime}`}
                                                </Link>
                                            ))}
                                        </div>
                                    </>
                                )}
                                <p className='text-gray-700 text-sm pt-1.5 my-1 pb-2.5 flex items-center'>
                                    {t('doctorDetail.selectAndSet')} <TbHandFinger className='mx-0.5 text-black' />
                                </p>
                            </div>
                        </Spin>
                        <div className="border-l border-gray-200 pl-8 py-4">
                            <div className='leading-6 border-b border-gray-200 pb-2'>
                                <p className='uppercase text-gray-500 font-medium'>{t('doctorDetail.addressExamination')}</p>
                                <p className='font-semibold'>{doctorData?.data?.clinicName}</p>
                                <p> {doctorData?.data?.address} {doctorData?.data?.wardName} - {doctorData?.data?.districtName} - {doctorData?.data?.provinceName}</p>
                            </div>
                            <p className='border-b border-gray-200 py-2'>
                                <span className='uppercase text-gray-500 font-medium mr-1'>{t('doctorDetail.priceExamitination')}:</span>
                                <span dangerouslySetInnerHTML={{ __html: doctorData?.data?.note || '' }}></span>
                                <div className="p-2 bg-gray-100 border border-gray-300 text-sm my-1">
                                    <p className="text-gray-600">{doctorData?.data?.paymentMethod}</p>
                                </div>
                            </p>
                            <div>
                                <p className='mr-1'>
                                    <span className='uppercase text-gray-500 font-medium'>{t('doctorDetail.insurance')}</span>
                                    <span className='text-blue-400 ml-1 cursor-pointer' onClick={toggleShowMore}>
                                        {showMore ? '' : <span>{t('doctorDetail.moreDetail')}</span>}
                                    </span>
                                </p>
                                {showMore && (
                                    <div>
                                        <div className="bg-gray-100 border border-gray-300 text-sm my-2">
                                            {doctorData.data.warrantyPolicy.map((warranty: { name: string, value: string }) => (
                                                <div className="border border-gray-300 p-2">
                                                    <h1 className="text-base">{warranty.name}</h1>
                                                    <p className="text-gray-600">{warranty.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <p onClick={toggleShowMore} className='text-blue-400 ml-1 cursor-pointer'>{showMore ? <span>{t('doctorDetail.hidden')}</span> : ''}</p>
                                    </div>

                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <NotFound subTitle="Không tìm thấy bác sĩ phù hợp!!" />
            )}
        </Spin >
    )
}

export default DoctorDetail