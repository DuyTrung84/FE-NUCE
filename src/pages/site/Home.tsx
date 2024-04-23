import { useTranslation } from 'react-i18next';
import SlickCarousel from "../../components/SlickCarousel"
import { useNavigate } from 'react-router-dom';
import { LstCategories } from '../../interface/ListCategories';
import { convertToSlug } from '../../utils/convertToSlug';
import { useGetAllSpecialtyQuery } from '../../api/admin/Specialty';
import { useGetAllClinicsQuery } from '../../api/site/Clinics';
import { useSearchDoctorsMutation } from '../../api/admin/Doctor';
import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import banner from './../../../public/banner_home.jpg'

const Home = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [lstDoctor, setLstDoctor] = useState<any>([]); //lưu data danh sách bác sĩ

    const [ltsService, setLstService] = useState<any>([]); //lưu data danh sách dịch vụ
    const [dataLoaded, setDataLoaded] = useState(false);

    const handleClick2 = (slug: string, data: LstCategories) => {
        navigate(`danh-sach/${convertToSlug(t(slug))}`, { state: { data, slug } });
    };
    const { data: specialty, isLoading: loadingSpecialty } = useGetAllSpecialtyQuery({ name: '', status: "1", page: 0, resultLimit: 10 });
    const { data: clinics, isLoading: loadingClinics } = useGetAllClinicsQuery({ search: '', province: '', status: '1', page: 0, resultLimit: 10 });
    const [search, { isLoading: loadingDoctor }] = useSearchDoctorsMutation();

    useEffect(() => {
        if (!dataLoaded) {
            fieldLstDotors();
            fieldLstService();
            setDataLoaded(true);
        }
    }, [dataLoaded])


    const fieldLstDotors = async () => {
        const response = await search({ type: 1, name: "", clinic: "", speciality: "", page: 0, resultLimit: 10 })
        if ('data' in response) { // Kiểm tra xem response có thuộc tính 'data' không
            setLstDoctor(response.data); // Nếu có, gán dữ liệu vào state lstDoctor
        }
    }

    const fieldLstService = async () => {
        const response = await search({ type: 2, name: "", clinic: "", speciality: "", page: 0, resultLimit: 10 })

        if ('data' in response) {
            setLstService(response.data)
        }
    }

    const newSpecialty = specialty?.data?.data?.map((item: LstCategories) => ({ ...item, cateCode: "specialty" })) || [];

    const newClinics = clinics ? clinics?.data?.data?.map((item: LstCategories) => ({ ...item, cateCode: "clinics", })) : [];


    const newDoctor = lstDoctor?.data?.data ? lstDoctor.data.data.map((item: LstCategories) => ({ ...item, cateCode: "doctor", name: item.doctorName, descriptionHtml: item.specialityName })) : [];

    const newService = ltsService?.data?.data ? ltsService.data.data.map((item: LstCategories) => ({ ...item, cateCode: "service", name: item.doctorName, descriptionHtml: item.specialityName })) : [];

    return (
        <div>
            <div className='bg-[#EDFFFA] h-80 pt-3'>
                {/* <img src="https://cdn.bookingcare.vn/fo/2023/11/02/134537-group-12314.png" className="max-w-screen-xl mx-auto w-[1200px] h-[400px] object-cover rounded-[30px]" alt="" /> */}
                <img src={banner} className="max-w-screen-xl mx-auto w-[1200px] h-[400px] object-cover rounded-[30px]" alt="" />
            </div>

            <div className="max-w-screen-xl mx-auto mt-36">
                <div className="flex justify-between items-center font-semibold text-2xl my-8">
                    <h2>{t('specialty')}</h2>

                    <div className="bg-[#DAF3F6] text-[#34929E] p-2 rounded-xl">
                        <button onClick={() => handleClick2('specialty', newSpecialty)}>{t('more')}</button>
                    </div>
                </div>
                <Spin spinning={loadingSpecialty}>
                    <SlickCarousel slides={newSpecialty} />
                </Spin>
            </div>

            <div className="max-w-screen-xl mx-auto mt-20">
                <div className="flex justify-between items-center font-semibold text-2xl my-8">
                    <h2>{t('clinics')}</h2>
                    <div className="bg-[#DAF3F6] text-[#34929E] p-2 rounded-xl">
                        <button onClick={() => handleClick2('clinics', newClinics)} >{t('more')} </button>
                    </div>
                </div>
                <Spin spinning={loadingClinics}>
                    <SlickCarousel slides={newClinics} />
                </Spin>
            </div>

            <div className="max-w-screen-xl mx-auto mt-20">
                <div className="flex justify-between items-center font-semibold text-2xl my-8">
                    <h2>{t('doctor')}</h2>
                    <div className="bg-[#DAF3F6] text-[#34929E] p-2 rounded-xl">
                        <button onClick={() => handleClick2('doctor', lstDoctor)} >{t('more')} </button>
                    </div>
                </div>
                <Spin spinning={loadingDoctor}>
                    <SlickCarousel slides={newDoctor} />
                </Spin>
            </div>

            <div className="max-w-screen-xl mx-auto mt-20">
                <div className="flex justify-between items-center font-semibold text-2xl my-8">
                    <h2>{t('service')}</h2>
                    <div className="bg-[#DAF3F6] text-[#34929E] p-2 rounded-xl">
                        <button onClick={() => handleClick2('service', ltsService)} >{t('more')} </button>
                    </div>
                </div>
                <Spin spinning={loadingDoctor}>
                    <SlickCarousel slides={newService} />
                </Spin>
            </div>
        </div>

    )
}

export default Home