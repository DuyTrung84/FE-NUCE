import { Link, useNavigate } from "react-router-dom";
import { EnterOutlined, LoadingOutlined, MailOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row, Select, Upload } from 'antd';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Option } from "antd/es/mentions";
import { useAddAccountMutation, useGetRoleQuery } from "../../../api/admin/Account";
import { useState } from "react";
import { useUploadMutation } from "../../../api/share/upload";
import { Notifn } from "../../../utils/Notification";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useGetDistrictsQuery, useGetProvincesQuery, useGetWardsQuery } from "../../../api/share/area";
import { useGetAllSpecialtyQuery } from "../../../api/admin/Specialty";
import { useGetAllClinicsQuery } from "../../../api/site/Clinics";

const AddAccount = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [selectedRole, setSelectedRole] = useState<string>("USER");
    const [imageUrl, setImageUrl] = useState<string | null>(null);//Lưu link ảnh
    const [fileImg, setFile] = useState<File | null>(null);//Lưu file ảnh
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState<string>("");//Lưu mã trỉnh thành phố
    const [selectedDistricts, setSelectedDistricts] = useState<string>("");//Lưu mã quạn huyện

    const { data: selectRole, isLoading: loadingRole } = useGetRoleQuery();
    const { data: provinces } = useGetProvincesQuery();//Tỉnh thành phố
    const { data: districts, isLoading: loadingDistricts } = useGetDistrictsQuery(selectedProvince);//Quận huyện
    const { data: wards, isLoading: loadingWards } = useGetWardsQuery(selectedDistricts);//Phường Xã
    const { data: specialty, isLoading: loadingSpecialty } = useGetAllSpecialtyQuery({ name: "", status: "1", page: 0, resultLimit: 500 });//Chuyên khoa
    const { data: clinics, isLoading: loadingClinics } = useGetAllClinicsQuery({ search: "", province: "", status: "1", page: 0, resultLimit: 500 });//Phòng khám
    const [addAccount] = useAddAccountMutation(); //hàm thêm tài khoản
    const [uploadImage, { isLoading }] = useUploadMutation();

    const handleProvinceChange = (value: string) => {
        setSelectedProvince(value); // Cập nhật mã tỉnh/thành phố được chọn
    };

    const handleDistrictsChange = (value: string) => {
        setSelectedDistricts(value); // Cập nhật mã tỉnh/thành phố được chọn
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
    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */ }
    const onFinish = async (values: any) => {
        try {
            delete values.imageObjectId;
            const requestData = {
                roles: values.roles,
                name: values.name,
                lastName: values.lastName,
                email: values.email,
                doctorInfoDTO: selectedRole === "DOCTOR" ? {
                    province: values.province,
                    district: values.district,
                    clinicsId: values.clinicsId,
                    descriptionHtml: values.descriptionHtml,
                    note: values.note,
                    specialitiesId: values.specialitiesId,
                    ward: values.ward,
                    address: values.address,
                } : null // Nếu không phải vai trò "DOCTOR", gán giá trị undefined cho doctorInfoDTO
            };
            addAccount(requestData)
                .unwrap()
                .then(response => {
                    const responseData = response?.data?.data;
                    const formData = new FormData();
                    if (fileImg) {
                        formData.append('image', fileImg);
                    }
                    if (responseData) {
                        formData.append('id', responseData);
                    }
                    uploadImage(formData);
                    Notifn("success", "Thành công", "Thêm thành công");
                    navigate("/admin/quan-ly-tai-khoan");
                })
                .catch(error => {
                    // Xử lý lỗi khi gọi API addAccount
                    console.error('Error adding account:', error);
                    Notifn("error", "Lỗi", "Thêm không thành công");
                });
        } catch (error) {
            console.error('Error adding specialty:', error);
            Notifn("error", "Lỗi", "Thêm không thành công");
        }
    };

    return (
        <div className="">
            <Link to="/admin/quan-ly-tai-khoan">Quay lại <EnterOutlined /></Link>
            <h2 className="my-6 mx-16 text-2xl font-semibold">Tạo tài khoản</h2>
            <Form className="mx-40"
                form={form}
                name="basic"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                onFinish={onFinish}
                labelWrap={true}
                autoComplete="off"
            >
                <Row gutter={26}>
                    <Col span={12}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Trường này không được bỏ trống !' },
                                { min: 3, message: "Tối thiểu 3 ký tự!" }
                            ]}
                        >
                            <Input
                                placeholder="Nhập email"
                                prefix={<MailOutlined className=" site-form-item-icon p-3 text-blue-500" />}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Họ"
                            name="name"
                            rules={[
                                { required: true, message: 'Trường này không được bỏ trống !' },
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon p-2.5 text-blue-500" />} placeholder="Họ cá nhân" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Tên"
                            name="lastName"
                            rules={[
                                { required: true, message: 'Trường này không được bỏ trống !' },
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon p-2.5 text-blue-500" />} placeholder="Tên cá nhân" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="roles"
                            label="Vai trò"
                            rules={[
                                { required: true, message: 'Trường này không được bỏ trống !' },
                            ]}
                        >
                            <Select className="w-full h-11" loading={loadingRole}
                                onChange={(value) => setSelectedRole(value)}
                                placeholder="---Select---"
                            >
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {selectRole?.data?.map((role: any) => (
                                    <Option key={role.value} value={role.value}>{role.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                {selectedRole === "DOCTOR" && (
                    <div>
                        <h2 className="font-medium text-gray-700 text-lg my-2">Thông tin bác sĩ</h2>
                        <Row gutter={26}>
                            <Col span={12}>
                                <Form.Item
                                    label="Ảnh"
                                    name="imageObjectId"
                                    rules={[
                                        { required: selectedRole === "DOCTOR", message: 'Trường này không được bỏ trống !' },
                                    ]}
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
                                        { required: selectedRole === "DOCTOR", message: 'Trường này không được bỏ trống !' },
                                    ]}
                                >
                                    <Select defaultValue="---Select---" className="w-full h-11" loading={loadingRole}
                                        onChange={handleProvinceChange}
                                    >

                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        {provinces?.data?.map((role: any) => (
                                            <Option key={role.code} value={role.code}>{role.name}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="district"
                                    label="Quận/Huyện"
                                    rules={[
                                        { required: selectedRole === "DOCTOR", message: 'Trường này không được bỏ trống !' },
                                    ]}
                                >
                                    <Select
                                        defaultValue="---Select---"
                                        className="w-full h-11"
                                        loading={loadingDistricts}
                                        onChange={handleDistrictsChange}
                                    >
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        {districts?.data?.map((district: any) => (
                                            <Option key={district.code} value={district.code}>{district.name}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="ward"
                                    label="Phường/Xã"
                                    rules={[
                                        { required: selectedRole === "DOCTOR", message: 'Trường này không được bỏ trống !' },
                                    ]}
                                >
                                    <Select
                                        defaultValue="---Select---"
                                        className="w-full h-11"
                                        loading={loadingWards}
                                    >

                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        {wards?.data?.map((wards: any) => (
                                            <Option key={wards.code} value={wards.code}>{wards.name}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label="Địa chỉ"
                                    name="address"
                                    rules={[
                                        { required: selectedRole === "DOCTOR", message: 'Trường này không được bỏ trống !' },
                                    ]}
                                >
                                    <Input placeholder="Địa chỉ" className="p-3" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="clinicsId"
                                    label="Phòng khám"
                                    rules={[
                                        { required: selectedRole === "DOCTOR", message: 'Trường này không được bỏ trống !' },
                                    ]}
                                >
                                    <Select defaultValue="---Select---" className="w-full h-11" loading={loadingClinics}                                    >
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        {clinics?.data?.data?.map((role: any) => (
                                            <Option key={role.id} value={role.id}>{role.name}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="specialitiesId"
                                    label="Chuyên khoa"
                                    rules={[
                                        { required: selectedRole === "DOCTOR", message: 'Trường này không được bỏ trống !' },
                                    ]}
                                >
                                    <Select defaultValue="---Select---" className="w-full h-11" loading={loadingSpecialty}                                    >
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        {specialty?.data?.data?.map((role: any) => (
                                            <Option key={role.id} value={role.id}>{role.name}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label="Ghi chú giá khám"
                                    name="note"
                                    rules={[
                                        { required: selectedRole === "DOCTOR", message: 'Trường này không được bỏ trống !' },
                                    ]}
                                >
                                    <CKEditor
                                        editor={ClassicEditor}
                                        onChange={(_event, editor) => {
                                            const data = editor.getData();
                                            form.setFieldsValue({
                                                note: data
                                            });
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="descriptionHtml"
                                    label="Mô tả"
                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                >
                                    <CKEditor
                                        editor={ClassicEditor}
                                        onChange={(_event, editor) => {
                                            const data = editor.getData();
                                            form.setFieldsValue({
                                                descriptionHtml: data
                                            });
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                )}
                <Form.Item labelAlign="left">
                    <Button type="primary" htmlType="submit" className="bg-blue-500">
                        {isLoading ? (
                            <AiOutlineLoading3Quarters className="animate-spin" />
                        ) : (
                            "Thêm"
                        )}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddAccount;
