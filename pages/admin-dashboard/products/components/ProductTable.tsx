import React, { useCallback, useEffect, useMemo, useState } from "react";
import moment from "moment";
import { Table, ActionDropDown } from "../../../../components";

import {
  fetchProductTypings,
  productTypings,
  selectedTypings,
  tableProduct,
} from "../../../../models/product";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useChangeProductStatusMutation,
  useBulkyDeleteMutation,
} from "../../../../redux/apis/productApi";
import { DeleteActiveIcon, EditActiveIcon } from "../../../../helpers/Icons";
import DeleteProductModal from "./DeleteProductModal";
import SelectColumnFilter from "../../../../components/search/SelectColumnFilter";
import EditProductModal from "./EditProductModal";

export default function ProductTable() {
  const { data, isFetching } = useGetProductsQuery();
  const [bulkyDelete]=useBulkyDeleteMutation()
  const [IdType, setIdType] = useState<string>("");
  const getData = data as fetchProductTypings;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isEditOpened, setIsEditOpened] = useState<boolean>(false);
  const [deleteProduct, { isLoading, isSuccess }] = useDeleteProductMutation();
  const [changeProductStatus, { error }] = useChangeProductStatusMutation();
  const [selectedRows, setSelectedRows] = useState([]);

  const actionHandler = (id: string, type: string) => {
    setIdType(id);
    if (type === "delete") {
      setIsOpen(true);
    } else {
      setIsEditOpened(true);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setIsOpen(false);
      setIdType("");
    }
  }, [isSuccess]);

  const deleteHandler = useCallback(async () => {
    try {
      if (IdType) {
        await deleteProduct({
          productId: IdType,
        }).unwrap();
      }
    } catch (error) {
      console.log(error);
    }
  }, [IdType]);

  const bulkyDelectFunc= async(selectedRows: selectedTypings)=>{
       try {
          if(selectedRows){
             const ids=selectedRows.map((row:tableProduct)=>row.original.id)
             const res=await bulkyDelete({
                ids
             })
             .unwrap()
             console.log(res)
          }
       } catch (error) {
           console.log(error);
       }
  }

  const changeProductStatusFunc = async (selectedRows: selectedTypings) => {
    try {
      if (selectedRows) {
        const ids = selectedRows.map((row: tableProduct) => row.original.id);
        const statuses = selectedRows.map((row: tableProduct) =>
          row.original.status === "Active" ? false : true
        );
        // update status of selected products status
        await changeProductStatus({
          ids: ids,
          status: statuses,
        }).unwrap();
      }
    } catch (error) {
      console.log(error);
    }
  };
  // This is a custom filter UI for selecting

  const columns: any = useMemo(() => {
    return [
      {
        Header: "name",
        accessor: "name",
        // disable filter for this column
        Filter: false,
      },
      {
        Header: "price",
        accessor: "price",
        Filter: false,
      },
      {
        Header: "type",
        accessor: "type",
        Filter: false,
      },
      {
        Header: "createdAt",
        accessor: "createdAt",
        Filter: false,
      },
      {
        Header: "updatedAt",
        accessor: "updatedAt",
        Filter: false,
      },
      {
        Header: "status",
        accessor: "status",
        Cell: ({ row }: any) => {
          return (
            <div
              className={`mb-3 ${
                row.original.status === "Active"
                  ? "text-green-500"
                  : row.original.status === "Inactive"
                  ? "text-red-500"
                  : "text-black"
              }`}
            >
              {row.original.status}
            </div>
          );
        },
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      //add delete and edit button
      {
        Header: "Action",
        Cell: (props: any) => {
          // get single data id
          const { id } = props.row.original;
          return (
            <ActionDropDown
              items={[
                {
                  id: id,
                  text: "Edit product",
                  type: "edit",
                  Icon: (
                    <EditActiveIcon
                      className="mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                  ),
                },
                {
                  id: id,
                  text: "Delete product",
                  type: "delete",
                  Icon: (
                    <DeleteActiveIcon
                      className="mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                  ),
                },
              ]}
              getselectedItemAction={actionHandler}
            />
          );
        },
        Filter: false,
      },
    ];
  }, []);

  const dataTable = useMemo(() => {
    return getData?.products?.map((product: productTypings) => {
      return {
        id: product.id,
        name: product.name.toLocaleUpperCase(),
        price: ` ${product.currency} ${product.price}`,
        type: product.type.toLocaleUpperCase(),
        createdAt: moment(product.createdAt).format("MMMM Do YYYY"),
        updatedAt: moment(product.updatedAt).format("MMMM Do YYYY"),
        status: product.status ? "Active" : "Inactive",
      };
    });
  }, [getData]);

  return (
    <div className="mt-6">
      {isFetching ? (
        <div className="flex h-screen justify-center items-center">
          Loading...
        </div>
      ) : (
        <div>
          <Table
            columns={columns}
            dataTable={dataTable}
            selectedRows={selectedRows}
            bulkyDelectFunc={bulkyDelectFunc}
            setSelectedRows={setSelectedRows}
            changeProductStatusFunc={changeProductStatusFunc}
          />
        </div>
      )}
      <DeleteProductModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        deleteHandler={deleteHandler}
        isLoading={isLoading}
      />
      {isEditOpened && (
        <EditProductModal
          productId={IdType}
          setIsOpen={setIsEditOpened}
          isOpen={isEditOpened}
        />
      )}
    </div>
  );
}
