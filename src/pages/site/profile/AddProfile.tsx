import { Button, DatePicker, Form, Input, Select, Upload } from 'antd'
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useAddProfileMutation, useGetAllProfileQuery } from '../../../api/site/Profile';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useGetAccountQuery, useUploadMutation } from '../../../api/share/upload';
import { Notifn } from '../../../utils/Notification';
import { useNavigate } from 'react-router-dom';

const AddProfile = () => {
    dayjs.extend(customParseFormat);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState<string | null>(null);//Lưu link ảnh
    const [fileImg, setFile] = useState<File | null>(null);//Lưu file ảnh
    const [isImageUploading, setIsImageUploading] = useState(false);

    const [addProfile, { isLoading: addLoading }] = useAddProfileMutation();
    const [uploadImage, { isLoading }] = useUploadMutation();
    const { data } = useGetAccountQuery();
    const { data: profiles } = useGetAllProfileQuery();

    useEffect(() => {
        if (profiles?.data?.length && profiles.data.length >= 10) {
            Notifn("warning", "Cảnh báo", "Hồ sơ của bạn đã đạt tối đa là 10 hồ sơ")
            navigate("/ho-so-kham-benh");
        }
        form.setFieldsValue({
            email: data?.data?.email,
        });
    }, [form, data, profiles, navigate]);

    const handleUpload = async (file: File) => {
        setFile(file)
        setIsImageUploading(true);
        setTimeout(() => {
            const url = URL.createObjectURL(file);
            setImageUrl(url);
            setIsImageUploading(false); // Hoàn thành upload
        }, 2000); // Thời gian loading là 2 giây
    };

    const onFinish = async (values: any) => {
        delete values.imageObjectId;
        values.birthdate = dayjs(values.birthdate).format('YYYY-MM-DD');
        addProfile(values)
            .unwrap()
            .then((response) => {
                const imageId = response?.data;
                const formData = new FormData();
                if (fileImg) {
                    formData.append('image', fileImg);
                }
                if (imageId) {
                    formData.append('id', imageId);
                }
                uploadImage(formData)
                    .unwrap()
                    .then(() => {
                        Notifn("success", "Thành công", "Tạo hồ sơ khám bệnh thành công");
                        navigate("/ho-so-kham-benh")
                    })
            })
            .catch((error) => {
                Notifn("warning", "Cảnh báo", error.data.message || error.data);
            });
    };
    return (
        <div><h1 className='font-medium text-gray-800 text-xl mb-8'>Tạo hồ sơ bệnh nhân</h1>
            <Form
                form={form}
                name="basic"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                style={{ maxWidth: 700 }}
                initialValues={{ remember: true }}
                labelWrap={true}
                autoComplete="off"
                className='ml-20'
                onFinish={onFinish}
            >
                <div className='max-h-[450px] overflow-y-auto pr-8 mb-8 ' style={{ scrollbarWidth: 'thin' }}>
                    <Form.Item
                        label="Ảnh"
                        name="imageObjectId"
                        rules={[
                            { required: true, message: 'Trường này không được bỏ trống !' },
                        ]}
                    >
                        <Upload
                            beforeUpload={(file) => {
                                const MAX_FILE_SIZE = import.meta.env.VITE_MAX_FILE_SIZE;
                                const isLtMaxFileSize = file.size / 1024 / 1024 < MAX_FILE_SIZE;
                                if (isLtMaxFileSize) {
                                    handleUpload(file)
                                } else {
                                    Notifn("warning", "Cảnh báo", "Ảnh không được quá " + MAX_FILE_SIZE.toString() + "MB");
                                }
                            }}
                            showUploadList={false}
                            listType="picture-circle" // Thay đổi kiểu hiển thị thành avatar
                            accept="image/*"
                        >
                            {imageUrl ? (
                                isImageUploading ? (
                                    <div>
                                        <LoadingOutlined />
                                        <div style={{ marginTop: 8 }}>Đang tải ảnh...</div>
                                    </div>
                                ) : (
                                    <img src={imageUrl} alt="Ảnh đã upload" className='max-h-[100px] max-w-[100px] rounded-full aspect-square object-cover' />
                                )
                            ) : (
                                <div>
                                    {isImageUploading ? (
                                        <div>
                                            <LoadingOutlined />
                                            <div style={{ marginTop: 8 }}>Đang tải ảnh...</div>
                                        </div>
                                    ) : (
                                        <div>
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        label='Họ và tên'
                        name="fullName"
                        rules={[
                            { required: true, message: 'Trường này không được bỏ trống !' },
                            { min: 6, message: "Họ tên phải trên 6 kí tự" }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label='Email'
                        name="email"
                        rules={[
                            { required: true, message: 'Trường này không được bỏ trống !' },
                            { type: 'email', message: "Email không đúng định dạng" }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Số điện thoại"
                        name="phoneNumber"
                        rules={[
                            { required: true, message: 'Trường này không được bỏ trống !' },
                            { pattern: /^(0[0-9]{9,10})$/, message: "Số điện thoại không đúng định dạng" }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Giới tính"
                        name="gender"
                        rules={[
                            { required: true, message: 'Trường này không được bỏ trống !' },
                        ]}
                    >
                        <Select>
                            <Select.Option value={2}>Khác</Select.Option>
                            <Select.Option value={1}>Nam</Select.Option>
                            <Select.Option value={0}>Nữ</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Ngày sinh"
                        name="birthdate"
                        rules={[
                            { required: true, message: 'Trường này không được bỏ trống !' },
                        ]}
                    >
                        <DatePicker
                            showTime={false}
                            className='w-full'
                        />
                    </Form.Item>
                    <Form.Item
                        label="Địa chỉ"
                        name="address"
                        rules={[
                            { required: true, message: 'Trường này không được bỏ trống !' },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Công việc"
                        name="job"
                    >
                        <Input />
                    </Form.Item>


                    <Form.Item
                        label="Mã CCCD/CMND"
                        name="cardId"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Mã thẻ bảo hiểm"
                        name="warrantyId"
                    >
                        <Input />
                    </Form.Item>
                </div>
                <Form.Item labelAlign="left">
                    <Button type="primary" htmlType="submit" className="bg-blue-500">
                        {isLoading || addLoading ? (
                            <AiOutlineLoading3Quarters className="animate-spin" />
                        ) : (
                            "Thêm hồ sơ"
                        )}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default AddProfile