import { CloseOutlined } from '@ant-design/icons';
import { Input, Spin } from 'antd';
import { MdLocationPin } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetChildrenClinicsQuery } from '../../../api/site/Clinics';
import { convertToSlug } from '../../../utils/convertToSlug';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const ClinicsChildren = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { data, isLoading } = useGetChildrenClinicsQuery(id || '');
    const [searchTerm, setSearchTerm] = useState('');

    const handleNavigate = (id: string, title: string) => {
        const slug = "clinics"
        navigate(`/co-so-y-te/${convertToSlug(t(title || ""))}`, { state: { slug, id } });
    }

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }

    const handleBack = () => {
        navigate(-1)
    }
    return (
        <div className='max-w-screen-xl mx-auto px-12'>
            <div className='flex justify-between items-center border-b-2 border-gray-300 py-6'>
                <p className='text-[27px] font-semibold text-gray-800'>{t('chilldrenClinics.title')}</p>
                <div className='flex gap-4'>
                    <Input placeholder={t('chilldrenClinics.search')} variant="filled" style={{ width: '300px', paddingBottom: '8px', paddingTop: '8px', paddingLeft: '16px', paddingRight: '8px', borderRadius: '30px' }} onChange={handleSearch} />
                    <button onClick={handleBack}>
                        <CloseOutlined />
                    </button>
                </div>
            </div>
            <Spin spinning={isLoading}>
                <div className='grid grid-cols-1 gap-8 my-8'>
                    {data && Array.isArray(data.data) && data.data

                        .filter(clinic => clinic.name.toLowerCase().includes(searchTerm.toLowerCase())).map((clinic: any) => (
                            <div key={clinic.id} className='flex gap-8 items-center cursor-pointer hover:scale-95' onClick={() => handleNavigate(clinic.id, clinic.name)}>
                                <img src={clinic.imageUrl} alt={clinic.name} className='rounded-lg w-40 h-36 object-cover object-center' />
                                <div className=''>
                                    <p className='text-blue-300 font-semibold text-2xl'>{clinic.name}</p>
                                    <p className='flex gap-2 items-center text-xl'>
                                        <MdLocationPin />
                                        <span className='text-gray-700'>{clinic.address}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                </div>
            </Spin>
        </div>
    )
}

export default ClinicsChildren;
