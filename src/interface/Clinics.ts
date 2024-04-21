export interface IClinics {
    id?: string;
    name?: string;
    imgUrl?: string;
    imageUrl?: string;
    imageObjectId?: string;
    descriptionHtml?: string;
    status?: string;
    address?: string;
    hasChildren?: number;
    data?: IClinics
    currentPage?: number;
    totalItems?: number;
    province?: string;
    district?: string;
    ward?: string;
    addressName?: string;
    stt?: number;
    isCurved?: number | string;
    hasParent?: string;
    parentClinicId?: string;
}