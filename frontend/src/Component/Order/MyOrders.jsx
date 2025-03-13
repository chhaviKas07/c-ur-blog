import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./myOrders.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, myBlogPayment } from "../../Slices/OrderSlice";
import Loader from "../../Component/Layout/Loader/Loader";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import MetaData from "../../Component/Layout/MetaData";
import LaunchIcon from "@mui/icons-material/Launch";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyOrders = () => {
  const dispatch = useDispatch();
  const { loading, error, userBlogPayments } = useSelector(
    (state) => state.orders
  );
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(myBlogPayment());
  }, [dispatch, error]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 300, flex: 1 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.5,
      cellClassName: (params) => {
        return params.row.status === "Delivered" ? "greenColor" : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 150,
      flex: 0.3,
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 270,
      flex: 0.5,
    },
    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/blogpayment/${params.row.id}`}>
            <LaunchIcon />
          </Link>
        );
      },
    },
  ];

  // const rows = [];

  // order &&
  //   order.forEach((item) => {
  //     rows.push({
  //       itemsQty: item.orderItems.length,
  //       id: item._id,
  //       status: item.orderStatus,
  //       amount: item.totalPrice,
  //     });
  //   });

  const rows = userBlogPayments.map((item) => ({
    itemsQty: item.orderItems.length,
    id: item._id,
    status: item.userBlogPaymentStatus,
    amount: item.totalPrice,
  }));

  return (
    <Fragment>
      <ToastContainer />
      <MetaData title={`${user.name} - Orders`} />
      {loading ? (
        <Loader />
      ) : (
        <div className="myOrdersPage">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            className="myOrdersTable"
            autoHeight
          />
          <Typography id="myOrdersHeading">{user.name}'s Orders</Typography>
        </div>
      )}
    </Fragment>
  );
};

export default MyOrders;
