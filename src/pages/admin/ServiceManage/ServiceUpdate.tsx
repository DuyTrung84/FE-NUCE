import { useNavigate, useParams } from "react-router-dom";
import { EnterOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row, Spin, Upload } from 'antd';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useEffect, useState } from "react";
import { useUploadMutation } from "../../../api/share/upload";
import { Notifn } from "../../../utils/Notification";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useGetByIdServiceQuery, useUpdateServiceMutation } from "../../../api/admin/Service";

const ServiceUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState<string | null>(null);//Lưu link ảnh
    const [fileImg, setFile] = useState<File | null>(null);//Lưu file ảnh
    const [isImageUploading, setIsImageUploading] = useState(false);

    const { data, isLoading: loadingData } = useGetByIdServiceQuery(id || "");
    const [updateService] = useUpdateServiceMutation();
    const [uploadImage, { isLoading }] = useUploadMutation();

    useEffect(() => {
        form.setFieldsValue({
            name: data?.data?.doctorName,
            note: data?.data?.note,
            descriptionHtml: data?.data?.descriptionHtml,
        });
        if (data?.data?.imageUrl) {
            setImageUrl(data?.data?.imageUrl);
        }
    }, [data, form])

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
        delete values.imageObjectId;
        values.serviceId = id;
        await updateService(values)
            .unwrap()
            .then((response) => {
                const imageId = response?.data;
                const formData = new FormData();
                if (fileImg) {
                    formData.append('image', fileImg);
                } else {
                    Notifn("success", "Thành công", "Cập nhật dịch vụ thành công");
                    navigate(-1)
                    return
                }
                if (imageId) {
                    formData.append('id', imageId);
                }
                uploadImage(formData)
                    .unwrap()
                    .then(() => {
                        Notifn("success", "Thành công", "Cập nhật dịch vụ thành công");
                        navigate(-1)
                    })
            })
            .catch((error) => {
                Notifn("error", "Lỗi", error.data.message || error.data);
            });
    };

    return (
        <div className="">
            <button onClick={() => navigate(-1)}>Quay lại <EnterOutlined /></button>
            <h2 className="my-6 mx-16 text-2xl font-semibold">Cập nhật dịch vụ</h2>
            <Spin spinning={loadingData}>
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
                                label="Tên dịch vụ"
                                name="name"
                                rules={[
                                    { required: true, message: 'Trường này không được bỏ trống !' },
                                    { min: 6, message: 'Tên dịch vụ phải lớn hơn 6 kí tự!' },
                                ]}
                            >
                                <Input placeholder="Tên dịch vụ" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="Ghi chú giá"
                                name="note"
                                rules={[
                                    { required: true, message: 'Trường này không được bỏ trống !' },
                                ]}
                            >
                                <CKEditor
                                    data={data?.data?.note}
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
                                    data={data?.data?.descriptionHtml}
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
                    <Form.Item labelAlign="left">
                        <Button type="primary" htmlType="submit" className="bg-blue-500">
                            {isLoading ? (
                                <AiOutlineLoading3Quarters className="animate-spin" />
                            ) : (
                                "Cập nhật"
                            )}
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </div>
    );
};

export default ServiceUpdate;
