import React, { useCallback, useEffect, useMemo, useState } from "react";
import moment from "moment";
import { Table, ActionDropDown } from "../../../../components";

import {
  fetchProductTypings,
  productTypings,
} from "../../../../models/product";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useChangeProductStatusMutation,
} from "../../../../redux/apis/productApi";
import {
  DeleteActiveIcon,
  EditActiveIcon,
} from "../../../../helpers/Icons";
import DeleteProductModal from "./DeleteProductModal";

export default function ProductTable() {
  const { data, isFetching } = useGetProductsQuery();
  const [IdType, setIdType] = useState<string>("");
  const getData = data as fetchProductTypings;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deleteProduct, { isLoading, isSuccess }] = useDeleteProductMutation();
  const [changeProductStatus, { error }] = useChangeProductStatusMutation();
  const [selectedRows, setSelectedRows] = useState([]);

  const actionHandler = (id: string, type: string) => {
    setIdType(id);
    if (type === "delete") {
      setIsOpen(true);
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

  const changeProductStatusFunc = async (selectedRows: any) => {
    try {
      if (selectedRows) {
        console.log(selectedRows)
        const ids = selectedRows.map((row: { original: { id: string; }; }) => row.original.id);
        const statuses = selectedRows.map((row:{original:{status:string}}) =>
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
// a unique option from a list
function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}:any) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options:any= React.useMemo(() => {
    const options:any= new Set()
    preFilteredRows.forEach((row:any)=> {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
      className="bg-black p-4 text-white"
    >
      <option value="">All</option>
      {options.map((option:string, i:number) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}
  const columns: any = useMemo(() => {
    return [
      {
        Header: "name",
        accessor: "name",
      },
      {
        Header: "price",
        accessor: "price",
      },
      {
        Header: "type",
        accessor: "type",
      },
      {
        Header: "createdAt",
        accessor: "createdAt",
      },
      {
        Header: "updatedAt",
        accessor: "updatedAt",
      },
      {
        Header: "status",
        accessor: "status",
        Cell:({ row }:any)=>{
           return (
               <div className={`${
                 row.original.status === "Active"
                  ? "text-green-500"
                  : row.original.status === "Inactive"
                  ? "text-red-500"
                  : "text-black"
              }`}>
                  {row.original.status}
               </div>
           )
        },
        Filter: SelectColumnFilter,
        filter: 'includes',
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
    <div className="mt-10 ">
      {isFetching ? (
        <div className="flex h-screen justify-center items-center">
          Loading...
        </div>
      ) : dataTable && dataTable.length > 0 ? (
        <div>
          <Table
            columns={columns}
            dataTable={dataTable}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            changeProductStatusFunc={changeProductStatusFunc}
          />
        </div>
      ) : (
        <div className="flex justify-center items-center w-full border-2">
          Your products lists is empty
        </div>
      )}
      <DeleteProductModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        deleteHandler={deleteHandler}
        isLoading={isLoading}
      />
    </div>
  );
}
