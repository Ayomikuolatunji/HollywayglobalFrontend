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
} from "../../../../redux/apis/productApi";
import {
  DeleteActiveIcon,
  EditActiveIcon,
  MoveInactiveIcon,
} from "../../../../helpers/Icons";
import DeleteProductModal from "./DeleteProductModal";

export default function ProductTable() {
  const { data, isFetching } = useGetProductsQuery();
  const [IdType, setIdType] = useState<string>("");
  const getData = data as fetchProductTypings;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deleteProduct, { isLoading, isSuccess }] = useDeleteProductMutation();
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
      if(IdType) {
         await deleteProduct({
          productId: IdType,
        }).unwrap();
      }
    } catch (error) {
      console.log(error);
    }
  }, [IdType]);

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
        Header: "status",
        accessor: "status",
      },
      {
        Header: "createdAt",
        accessor: "createdAt",
      },
      {
        Header: "updatedAt",
        accessor: "updatedAt",
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
                {
                  id: id,
                  text: "Deactivate product",
                  type: "deactivate",
                  Icon: (
                    <MoveInactiveIcon
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
        name: product.name,
        price: ` ${product.currency} ${product.price}`,
        type: product.type,
        status: product.status ? "Active" : "Inactive",
        createdAt: moment(product.createdAt).format("MMMM Do YYYY"),
        updatedAt: moment(product.updatedAt).format("MMMM Do YYYY"),
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
        <Table
          columns={columns}
          dataTable={dataTable}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
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
