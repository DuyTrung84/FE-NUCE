import { Button, Table, Tag, Form, Select, DatePicker } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useExportManageMutation, useGetStatusBookingQuery, useSearchManageMutation } from "../../api/admin/Booking";
import { useGetAllSpecialtyQuery } from '../../api/admin/Specialty';
import { useGetAllClinicsNChildrenQuery } from '../../api/site/Clinics';
import { useGetAllDoctorsQuery } from '../../api/admin/Doctor';
import dayjs from 'dayjs';
import { Notifn } from '../../utils/Notification';


const { RangePicker } = DatePicker;

const Manage = () => {
  const [form] = Form.useForm();
  const [selectType, setSelectType] = useState<string>("");
  const [selectClinic, setSelectClinic] = useState<string>("");
  const [selectSpecialty, setSelectSpecialty] = useState<string>("");

  const [search, { data, isLoading }] = useSearchManageMutation();
  const [exportData, { isLoading: loadingExport }] = useExportManageMutation();
  const { data: bookingStatus } = useGetStatusBookingQuery();
  const { data: specialty } = useGetAllSpecialtyQuery({ name: "", status: "", page: 0, resultLimit: 500 });//Chuyên khoa
  const { data: clinics } = useGetAllClinicsNChildrenQuery({ search: "", province: "", status: "", page: 0, resultLimit: 500 });//Phòng khám
  const { data: doctor, isLoading: loadingDoctor } = useGetAllDoctorsQuery({ type: selectType, name: "", clinic: selectClinic, speciality: selectSpecialty, page: 0, resultLimit: 100 });

  useEffect(() => {
    search({
      fromDate: "",
      toDate: "",
      fromTime: "",
      toTime: "",
      doctorId: "",
      type: "",
      status: "",
      clinicId: "",
      specialityId: "",
      page: 0,
      resultLimit: 10
    });
  }, [form, search]);


  const handleSearch = (values: any) => {
    const fromDate = values?.date ? dayjs(values.date[0]).format('YYYY-MM-DD') : "";
    const toDate = values?.date ? dayjs(values.date[1]).format('YYYY-MM-DD') : "";
    const fromTime = values?.time ? dayjs(values.time[0]).format('YYYY-MM-DD HH:mm:ss') : "";
    const toTime = values?.time ? dayjs(values.time[1]).format('YYYY-MM-DD HH:mm:ss') : "";

    search({
      fromDate: fromDate,
      toDate: toDate,
      fromTime: fromTime,
      toTime: toTime,
      doctorId: values.doctorId,
      type: values.type,
      status: values.status,
      clinicId: values.clinicId,
      specialityId: values.specialityId,
      page: 0,
      resultLimit: 10
    });
  };

  const handleReset = () => {
    form.resetFields();
    search({
      fromDate: "",
      toDate: "",
      fromTime: "",
      toTime: "",
      doctorId: "",
      type: "",
      status: "",
      clinicId: "",
      specialityId: "",
      page: 0,
      resultLimit: 10
    });
  };

  const handlePaginationChange = (currentPage: number, pageSize?: number) => {
    const date = form.getFieldValue('date')
    const time = form.getFieldValue('time')
    const fromDate = date ? dayjs(date[0]).format('YYYY-MM-DD') : "";
    const toDate = date ? dayjs(date[1]).format('YYYY-MM-DD') : "";
    const fromTime = time ? dayjs(time[0]).format('YYYY-MM-DD HH:mm:ss') : "";
    const toTime = time ? dayjs(time[1]).format('YYYY-MM-DD HH:mm:ss') : "";

    search({
      fromDate: fromDate,
      toDate: toDate,
      fromTime: fromTime,
      toTime: toTime,
      doctorId: form.getFieldValue('doctorId'),
      type: form.getFieldValue('type'),
      status: form.getFieldValue('status'),
      clinicId: form.getFieldValue('clinicId'),
      specialityId: form.getFieldValue('specialityId'),
      page: currentPage - 1, // Trừ 1 vì API thường sử dụng index bắt đầu từ 0
      resultLimit: pageSize || 10, // Số lượng mục trên mỗi trang
    });
  };

  const columns: ColumnsType<any> = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_text, _record, index) => index + 1,
    },
    {
      title: 'Tên bác sĩ/Tên dịch vụ',
      dataIndex: 'doctorName',
      key: 'doctorName',
    },
    {
      title: 'Phòng khám',
      dataIndex: 'clinicName',
      key: 'clinicName'
    },
    {
      title: 'Chuyên khoa',
      dataIndex: 'specialityName',
      key: 'specialityName',
      width: 160
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'timeStart',
      key: 'timeStart',
      width: 200
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'timeEnd',
      key: 'timeEnd',
      width: 200
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = '';
        let text = '';
        if (status === "0") {
          color = 'red';
          text = 'Đã huỷ'
        } else if (status === "2") {
          color = 'blue';
          text = 'Khám xong'
        } else if (status === "1") {
          color = 'green';
          text = 'Đặt thành công'
        }
        return (
          <Tag color={color}>{text}</Tag>
        );
      },
      width: 120
    },
    {
      title: 'Lý do đặt lịch',
      dataIndex: 'reasonBooking',
      key: 'reasonBooking',
      render: (text) => (
        <p title={text} className="line-clamp-3">
          {text}
        </p>
      ),
      width: 300
    },
    {
      title: 'Lý do huỷ lịch',
      dataIndex: 'reasonCancel',
      key: 'reasonCancel',
      width: 300,
      render: (text) => (
        <p title={text} className="line-clamp-3">
          {text}
        </p>
      ),
    },
    {
      title: 'Người cập nhật cuối',
      dataIndex: 'lastUpdatedUser',
      key: 'lastUpdatedUser',
      width: 200
    },
    {
      title: 'Thời gian cập nhật',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 200
    },
    {
      title: 'Mã hoá đơn',
      dataIndex: 'vnpSoHoaDon',
      key: 'vnpSoHoaDon',
      width: 200
    },
    {
      title: 'Mã giao dịch',
      dataIndex: 'vnpSoGiaoDich',
      key: 'vnpSoGiaoDich',
      width: 200
    },
    {
      title: 'Người trả phí đặt',
      dataIndex: 'whoPay',
      key: 'whoPay',
      width: 200,
      render: (text: string) => {
        if (text === "0") {
          text = 'Người đặt trả phí'
        } else if (text === "1") {
          text = 'Bác sĩ trả phí'
        }
        return (
          <p>{text}</p>
        );
      }
    },
  ];

  const hanldeExport = () => {
    const date = form.getFieldValue('date')
    const time = form.getFieldValue('time')
    const fromDate = date ? dayjs(date[0]).format('YYYY-MM-DD') : "";
    const toDate = date ? dayjs(date[1]).format('YYYY-MM-DD') : "";
    const fromTime = time ? dayjs(time[0]).format('YYYY-MM-DD HH:mm:ss') : "";
    const toTime = time ? dayjs(time[1]).format('YYYY-MM-DD HH:mm:ss') : "";

    exportData({
      fromDate: fromDate,
      toDate: toDate,
      fromTime: fromTime,
      toTime: toTime,
      doctorId: form.getFieldValue('doctorId'),
      type: form.getFieldValue('type'),
      status: form.getFieldValue('status'),
      clinicId: form.getFieldValue('clinicId'),
      specialityId: form.getFieldValue('specialityId'),
    })
      .unwrap()
      .then((response) => {
        window.location.href = response.message
      })
      .catch(error => {
        Notifn("error", "Lỗi", error.data.message || error.mesage)
      })
  }

  const handleTypeChange = (value: string) => {
    setSelectType(value);
  };

  const handleClinicChange = (value: string) => {
    setSelectClinic(value);
  };

  const handleSpecialtyChange = (value: string) => {
    setSelectSpecialty(value);
  };

  return (
    <div className="">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold">Quản lý</h2>
      </div>
      <Form onFinish={handleSearch} form={form}>
        <div>
          <div className="mb-8 grid grid-cols-4 gap-x-8 gap-y-5 mx-6">
            <div>
              <p className="font-medium my-1.5 text-gray-700">Ngày đặt lịch</p>
              <Form.Item name="date">
                <RangePicker className="w-full" />
              </Form.Item>
            </div>
            <div>
              <p className="font-medium my-1.5 text-gray-700">Thời gian khám</p>
              <Form.Item name="time">
                <RangePicker showTime />
              </Form.Item>
            </div>
            <div>
              <p className="font-medium my-1.5 text-gray-700">Trạng thái lịch khám:</p>
              <Form.Item name="status">
                <Select placeholder="Trạng thái lịch khám" className="h-8" allowClear>
                  {bookingStatus?.data?.map((role: any) => (
                    <Select.Option key={role.value} value={role.value}>{role.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div>
              <p className="font-medium my-1.5 text-gray-700">Phòng khám:</p>
              <Form.Item name="clinicId">
                <Select placeholder="---Phòng khám---" allowClear onChange={handleClinicChange}>
                  {clinics?.data?.data?.map((role: any) => (
                    <Select.Option key={role.id} value={role.id}>{role.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div>
              <p className="font-medium my-1.5 text-gray-700" >Chuyên khoa:</p>
              <Form.Item name="specialityId">
                <Select placeholder="---Chuyên khoa---" allowClear onChange={handleSpecialtyChange}>
                  {specialty?.data?.data?.map((role: any) => (
                    <Select.Option key={role.id} value={role.id}>{role.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div>
              <p className="font-medium my-1.5 text-gray-700">Loại khám:</p>
              <Form.Item name="type">
                <Select placeholder="---Loại khám---" allowClear onChange={handleTypeChange}>
                  <Select.Option key={"1"} value="1">Bác sĩ</Select.Option>
                  <Select.Option key={"2"} value="2">Dịch vụ</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div>
              <p className="font-medium my-1.5 text-gray-700">Bác sĩ/Dịch vụ:</p>
              <Form.Item name="doctorId">
                <Select placeholder="---Select---" allowClear loading={loadingDoctor}>
                  {doctor?.data?.data?.map((role: any) => (
                    <Select.Option key={role.id} value={role.id}>{role.doctorName}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>
          <div className="mb-8 float-right mr-8 flex items-center gap-3">
            <Button icon={<ReloadOutlined />} onClick={handleReset}>Đặt lại</Button>
            <Button type="primary" icon={<SearchOutlined />} className="bg-blue-600" htmlType="submit">
              Tìm kiếm
            </Button>
          </div>
        </div>
      </Form>
      <Button loading={loadingExport} onClick={hanldeExport}>Export</Button>
      <Table
        columns={columns}
        dataSource={Array.isArray(data?.data?.data) ? data?.data?.data : []}
        loading={isLoading}
        scroll={{ y: 400, x: 3000 }}
        pagination={{
          current: data?.data?.currentPage ? data.data.currentPage + 1 : 1,
          total: data?.data?.totalItems,
          pageSize: 10,
          onChange: handlePaginationChange,
        }}
      />
    </div>
  )
}

export default Manage