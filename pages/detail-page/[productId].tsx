import React from "react";
import axios from "axios";
export default function DetailPage({ data }: any) {
  console.log(data);
  return (
    <>
      <div className="grid">he</div>
    </>
  );
}

type params = {
  params: { productId: string };
};

// This gets called on every request
export async function getServerSideProps({ params }: params) {
  try {
    const res = await axios(
      `http://localhost:8080/api/v1/user_product/${params.productId}`
    );
    const data = await res.data;
    return { props: { data } };
  } catch (error) {
    return { props: { error } };
  }
}
