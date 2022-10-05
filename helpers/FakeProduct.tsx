import React from "react";

export default function FakeProduct() {
  const columns = React.useMemo(() => {
    return [
      {
        Header: "Date",
        accessor: "Date",
      },
      {
        Header: "StudentId",
        accessor: "accessor",
      },
    ];
  }, []);

  const tableData = React.useMemo(() => {
    return [
      {
        Date: new Date(),
      },
      {
        StudentId: "ayomiku",
      },
    ];
  }, []);

  return <div>FakeProduct</div>;
}
