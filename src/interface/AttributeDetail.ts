export default interface AttributeDetailType {
    id: string,
    createAt: string,
    updateAt: string,
    createBy: string,
    isDelete: boolean,
    name: string,
    description: string,
    sizeCode?: string,
    colorCode?: string,
    materialCode?: string,
    brandCode?: string,
    categoryCode?: string
}