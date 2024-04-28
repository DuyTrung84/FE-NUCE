import { useTranslation } from "react-i18next";
import { AiFillHome, AiOutlineCaretDown, AiOutlineCaretUp } from "react-icons/ai";
import { useLocation } from "react-router-dom";
import { useGetByIdClinicsQuery } from "../../../api/site/Clinics";
import { Link } from "react-router-dom";
import { Spin } from "antd";
import { useSearchDoctorsMutation } from "../../../api/admin/Doctor";
import { useEffect, useRef, useState } from "react";
import ListBooking from "../../../components/ListBooking";
import NotFound from "../../../components/NotFound";

const ClinicsDetail = () => {
    const location = useLocation();
    const { t } = useTranslation();
    const [showMore, setShowMore] = useState(false);
    const [showMoreDetails, setShowMoreDetails] = useState(Array(10).fill(false));
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPage2, setCurrentPage2] = useState(1);
    const [selectedDates, setSelectedDates] = useState<number[]>(Array(10).fill(0));
    const [selectedDates2, setSelectedDates2] = useState<number[]>(Array(10).fill(0));

    const [lstDoctor, setLstDoctor] = useState<any>([]); //lưu data danh sách bác sĩ

    const [ltsService, setLstService] = useState<any>([]); //lưu data danh sách dịch vụ
    const doctorsListRef = useRef<HTMLDivElement>(null);

    const { data, isLoading } = useGetByIdClinicsQuery(location.state.id)
    const [searchDoctor, { isLoading: doctorLoading }] = useSearchDoctorsMutation();

    useEffect(() => {
        fieldLstDotors()
        fieldLstService()
    }, [searchDoctor, location.state.id, currentPage, currentPage2])

    const fieldLstDotors = async () => {
        const response = await searchDoctor({ type: 1, name: "", clinic: location.state.id, speciality: "", page: currentPage - 1, resultLimit: 5 })
        if ('data' in response) { // Kiểm tra xem response có thuộc tính 'data' không
            setLstDoctor(response.data); // Nếu có, gán dữ liệu vào state lstDoctor
        }
    }

    const fieldLstService = async () => {
        const response = await searchDoctor({ type: 2, name: "", clinic: location.state.id, speciality: "", page: currentPage2 - 1, resultLimit: 5 })
        if ('data' in response) {
            setLstService(response.data)
        }
    }

    const toggleShowMoreDetails = (index: number) => {
        const updatedShowMoreDetails = [...showMoreDetails];
        updatedShowMoreDetails[index] = !updatedShowMoreDetails[index];
        setShowMoreDetails(updatedShowMoreDetails);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageChange2 = (page: number) => {
        setCurrentPage2(page);
    };

    const handleDateChange = (value: number, index: number) => {
        const updatedSelectedDates = [...selectedDates];
        updatedSelectedDates[index] = value;
        setSelectedDates(updatedSelectedDates);
    };

    const handleDateChange2 = (value: number, index: number) => {
        const updatedSelectedDates2 = [...selectedDates2];
        updatedSelectedDates2[index] = value;
        setSelectedDates2(updatedSelectedDates2);
    };

    const handleBookAppointment = () => {
        if (doctorsListRef.current) {
            doctorsListRef.current.scrollIntoView({ behavior: "smooth" }); // Lăn xuống phần danh sách bác sĩ
        }
    };

    const toggleShowMore = () => {
        setShowMore(!showMore);
    };

    return (
        <Spin spinning={isLoading}>
            {data?.data ? (
                <div>
                    <div className='max-w-screen-xl mx-auto p-12'>
                        <div className="flex items-center gap-1 my-4 text-[#45C3D2] ">
                            <a href="/" className="flex gap-1"><AiFillHome className="text-xl" />/</a>
                            <p>{t(location.state.slug)}</p>
                        </div>
                        <div className='flex items-center'>
                            <div className='w-32 h-32 '>
                                <img src={data?.data?.imageUrl} className='object-cover p-4 w-full h-full' alt="" />
                            </div>
                            <div className="text-[#28213F] leading-10">
                                <p className="text-2xl font-semibold">{data?.data?.name}</p>
                                <p className="text-lg">{data?.data?.address}</p>
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold text-lg">{t('clinicsDetail.descClinics')}</p>
                            <div className={`${showMore ? "max-h-full" : "max-h-40 overflow-hidden"} transition-max-h duration-500 ease-in-out ml-3`}
                                dangerouslySetInnerHTML={{
                                    __html: data?.data?.descriptionHtml || ""
                                }}
                            ></div>
                            <button
                                className="mt-2 flex text-[#288AD6] font-light"
                                onClick={toggleShowMore}
                            >
                                {showMore
                                    ? <span>{t('clinicsDetail.hidden')}< AiOutlineCaretUp className="inline-block" /></span>
                                    : <span>{t('clinicsDetail.more')}< AiOutlineCaretDown className="inline-block" /></span>}
                            </button>
                        </div>
                    </div >

                    {/* Danh sách bác sĩ */}
                    <div className='bg-gray-100 mt-2 py-4'>
                        <h2 className='font-semibold text-gray-800 text-2xl max-w-screen-xl mx-auto mb-4' ref={doctorsListRef}>{t('clinicsDetail.doctor')}</h2>
                        <ListBooking
                            lstService={lstDoctor}
                            currentPage={currentPage}
                            handlePageChange={handlePageChange}
                            handleDateChange={handleDateChange}
                            selectedDates={selectedDates}
                            toggleShowMoreDetails={toggleShowMoreDetails}
                            showMoreDetails={showMoreDetails}
                            doctorLoading={doctorLoading}
                        />

                        <h2 className='font-semibold text-gray-800 text-2xl max-w-screen-xl mx-auto mb-4'>{t('clinicsDetail.service')}</h2>
                        <ListBooking
                            lstService={ltsService}
                            currentPage={currentPage2}
                            handlePageChange={handlePageChange2}
                            handleDateChange={handleDateChange2}
                            selectedDates={selectedDates2}
                            toggleShowMoreDetails={toggleShowMoreDetails}
                            showMoreDetails={showMoreDetails}
                            doctorLoading={doctorLoading}
                        />
                    </div>

                    <div className="fixed bottom-0 w-full bg-white py-3 px-14">
                        {data?.data?.hasChildren === 0 ? (
                            <button onClick={handleBookAppointment}
                                className="bg-yellow-400 text-white w-full justify-between py-2 rounded-md text-lg hover:brightness-105">
                                Đặt lịch khám
                            </button>
                        ) : (
                            <Link
                                to={`${data?.data?.id}`}
                                className="block text-center bg-blue-400 text-white w-full justify-between py-2 rounded-md text-lg hover:brightness-105"
                            >
                                Chọn chuyên khoa
                            </Link>
                        )}
                    </div>
                </div>
            ) : (
                <NotFound subTitle="Không tìm thấy phòng khám phù hợp!!" />
            )}
        </Spin >
    )
}

export default ClinicsDetail