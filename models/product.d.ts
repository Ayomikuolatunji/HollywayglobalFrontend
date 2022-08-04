export interface productTypings {
    id?:string
    adminId?:string
    name:string
    price:string
    description?:string
    productAvailable?:boolean
    type:string
    image?:string
    createdAt?:Date
    updatedAt?:Date
}

export type fetchProductTypings ={
    message:string
    products:productTypings[]
}

export interface productColumns {
    name:string
    price:string
    type:string
    onsales:string
}