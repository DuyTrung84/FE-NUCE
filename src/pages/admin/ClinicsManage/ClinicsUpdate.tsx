import { Link, useNavigate, useParams } from "react-router-dom";
import { EnterOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Radio, RadioChangeEvent, Row, Select, Spin, Upload } from 'antd';
import { useGetStatusQuery, useUploadMutation } from "../../../api/share/upload";
import { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Notifn } from "../../../utils/Notification";
import { IClinics } from "../../../interface/Clinics";
import { useGetAllClinicsQuery, useAdminGetByIdClinicsQuery, useUpdateClinicsMutation } from "../../../api/site/Clinics";
import { useGetDistrictsQuery, useGetProvincesQuery, useGetWardsQuery } from "../../../api/share/area";

const ClinicsUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState<string | null>(null);//Lưu link ảnh
    const [fileImg, setFile] = useState<File | null>(null);//Lưu file ảnh
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState<string>("");//Lưu mã trỉnh thành phố
    const [selectedDistricts, setSelectedDistricts] = useState<string>("");//Lưu mã quạn huyện
    const [isClinicCurved, setIsClinicCurved] = useState(false);

    const { data: clinicsData, isLoading: dataLoading } = useAdminGetByIdClinicsQuery(id || "")
    const { data: clinics, isLoading: loadingClinics } = useGetAllClinicsQuery({ search: "", province: "", status: "", page: 0, resultLimit: 100 });//Phòng khám
    const { data: provinces } = useGetProvincesQuery();//Tỉnh thành phố
    const { data: districts, isLoading: loadingDistricts } = useGetDistrictsQuery(selectedProvince);//Quận huyện
    const { data: wards, isLoading: loadingWards } = useGetWardsQuery(selectedDistricts);//Phường Xã
    const { data: status } = useGetStatusQuery() //status
    const [addClinic] = useUpdateClinicsMutation();
    const [uploadImage, { isLoading }] = useUploadMutation();

    useEffect(() => {
        form.setFieldsValue({
            descriptionHtml: clinicsData?.data?.descriptionHtml,
            name: clinicsData?.data?.name,
            status: clinicsData?.data?.status,
            hasChildren: clinicsData?.data?.hasChildren,
            province: clinicsData?.data?.province,
            district: clinicsData?.data?.district,
            ward: clinicsData?.data?.ward,
            address: clinicsData?.data?.addressName,
            parentClinicId: clinicsData?.data?.hasParent,
            imageObjectId: ""
        });
        if (clinicsData?.data?.imageUrl) {
            setImageUrl(clinicsData?.data?.imageUrl);
        }
        if (clinicsData?.data?.district && clinicsData?.data?.province) {
            setSelectedDistricts(clinicsData?.data?.district)
            setSelectedProvince(clinicsData?.data?.province)
        }
        if (clinicsData?.data?.hasParent !== "") {
            setIsClinicCurved(true)
        } else if (clinicsData?.data?.hasParent === "") {
            setIsClinicCurved(false)
        }
    }, [clinicsData, form, setSelectedDistricts, setSelectedProvince]);

    const handleProvinceChange = (value: string) => {
        setSelectedProvince(value); // Cập nhật mã tỉnh/thành phố được chọn
        form.setFieldValue("district", "");
        form.setFieldValue("ward", "");
    };

    const handleDistrictsChange = (value: string) => {
        setSelectedDistricts(value); // Cập nhật mã tỉnh/thành phố được chọn
        form.setFieldValue("ward", "");
    };

    const handleCurvedChange = (e: RadioChangeEvent) => {
        setIsClinicCurved(e.target.value);
        form.setFieldValue("parentClinicId", "" || null)
    };

    const handleUpload = async (file: File) => {
        setFile(file)
        setIsImageUploading(true);
        setTimeout(() => {
            const url = URL.createObjectURL(file);
            setImageUrl(url);
            setIsImageUploading(false); // Hoàn thành upload
        }, 2000); // Thời gian loading là 2 giây
    };

    const onFinish = async (values: IClinics) => {
        try {
            delete values.imageObjectId;
            delete values.isCurved;
            const request = {
                id: id,
                ...values
            };
            await addClinic(request)
                .unwrap()
                .then((response: any) => {
                    const responseData = response?.data;
                    const formData = new FormData();
                    if (responseData) {
                        formData.append('id', responseData);
                    }
                    if (fileImg) {
                        formData.append('image', fileImg);
                    } else if (!fileImg) {
                        Notifn("success", "Thành công", "Sửa thành công");
                        navigate("/admin/quan-ly-phong-kham");
                        return;
                    }

                    uploadImage(formData)
                        .unwrap()
                        .then(() => {
                            Notifn("success", "Thành công", "Sửa thành công");
                            navigate("/admin/quan-ly-phong-kham");
                        })
                        .catch((error) => {
                            Notifn("error", "Lỗi", error.data.message || error.message);
                        });
                })
                .catch((error) => {
                    Notifn("error", "Lỗi", error.data.message || error.message);
                })
        } catch (error) {
            console.error('Error adding specialty:', error);
            Notifn("error", "Lỗi", "Sửa không thành công");
        }
    };


    return (
        <div className="">
            <Link to="/admin/quan-ly-phong-kham">Quay lại <EnterOutlined /></Link>
            <h2 className="my-6 mx-16 text-2xl font-semibold">Sửa phòng khám</h2>
            <Spin spinning={dataLoading}>
                <Form className="mx-40"
                    form={form}
                    name="basic"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    onFinish={onFinish}
                    labelWrap={true}
                    autoComplete="off"
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Tên phòng khám"
                                name="name"
                                rules={[
                                    { required: true, message: 'Trường này không được bỏ trống !' },
                                    { min: 3, message: "Tối thiểu 3 ký tự!" }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Ảnh"
                                name="imageObjectId"
                            >
                                <Upload
                                    // beforeUpload={(file) => { handleUpload(file) }}
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
                                    listType="picture-card" // Thay đổi kiểu hiển thị thành avatar
                                    accept="image/*"
                                >
                                    {imageUrl ? (
                                        isImageUploading ? (
                                            <div>
                                                <LoadingOutlined />
                                                <div style={{ marginTop: 8 }}>Đang tải ảnh...</div>
                                            </div>
                                        ) : (
                                            <img src={imageUrl} alt="Ảnh đã upload" style={{ width: '100%' }} />
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
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="province"
                                label="Tỉnh/Thành phố"
                                rules={[
                                    { required: true, message: 'Trường này không được bỏ trống !' },
                                ]}
                            >
                                <Select className="w-full"
                                    onChange={handleProvinceChange}
                                >
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    {provinces?.data?.map((role: any) => (
                                        <Select.Option key={role.code} value={role.code}>{role.name}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="district"
                                label="Quận/Huyện"
                                rules={[
                                    { required: true, message: 'Trường này không được bỏ trống !' },
                                ]}
                            >
                                <Select
                                    className="w-full"
                                    loading={loadingDistricts}
                                    onChange={handleDistrictsChange}
                                >
                                    {districts?.data?.map((district: any) => (
                                        <Select.Option key={district.code} value={district.code}>{district.name}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="ward"
                                label="Phường/Xã"
                                rules={[
                                    { required: true, message: 'Trường này không được bỏ trống !' },
                                ]}
                            >
                                <Select
                                    className="w-full"
                                    loading={loadingWards}
                                >
                                    {wards?.data?.map((wards: any) => (
                                        <Select.Option key={wards.code} value={wards.code}>{wards.name}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Địa chỉ"
                                name="address"
                                rules={[
                                    { required: true, message: 'Trường này không được bỏ trống !' },
                                ]}
                            >
                                <Input placeholder="Địa chỉ" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="isCurved"
                                label="Đây có phải là phòng khám con không?"
                            >
                                <Radio.Group onChange={handleCurvedChange} defaultValue={clinicsData?.data?.hasParent !== "" ? true : false}>
                                    <Radio value={true}>Có</Radio>
                                    <Radio value={false}>Không</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                        {isClinicCurved && (
                            <Col span={12}>
                                <Form.Item
                                    name="parentClinicId"
                                    label="Phòng khám cha"
                                    rules={[
                                        { required: isClinicCurved, message: 'Trường này không được bỏ trống !' },
                                    ]}
                                >
                                    <Select className="w-full" loading={loadingClinics}>
                                        {clinics?.data?.data?.map((role: any) => (
                                            <Select.Option key={role.id} value={role.id}>{role.name}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        )}
                        <Col span={12}>
                            <Form.Item
                                label="Trạng thái"
                                name="status"
                                rules={[
                                    { required: true, message: 'Trường này không được bỏ trống !' },
                                ]}
                                initialValue={clinicsData?.data?.status}
                            >
                                <Select className="w-full">
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    {status?.data?.map((role: any) => (
                                        <Select.Option key={role.value} value={role.value}>{role.name}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="descriptionHtml"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                    >
                        <CKEditor
                            data={clinicsData?.data?.descriptionHtml}
                            editor={ClassicEditor}
                            onChange={(_event, editor) => {
                                const data = editor.getData();
                                form.setFieldsValue({
                                    descriptionHtml: data
                                });
                            }}
                        />
                    </Form.Item>

                    <Form.Item labelAlign="left">
                        <Button type="primary" htmlType="submit" className="bg-blue-500" loading={isLoading}>
                            Cập nhật
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </div>
    );
};

export default ClinicsUpdate;
