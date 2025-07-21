import React, { Fragment, useEffect } from "react"; 
import { DataGrid } from "@mui/x-data-grid";
import "./myOrders.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, myOrders } from "../../OrderSlice";
import Loader from "../layout/Loader/Loader";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import MetaData from "../layout/MetaData";
import LaunchIcon from "@mui/icons-material/Launch";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import IconButton from "@mui/material/IconButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyOrders = () => {
  const dispatch = useDispatch();
  const { loading, error, orders } = useSelector(
    (state) => state.orders
  );
  const { user } = useSelector((state) => state.user);

  const handleDownloadInvoice = (orderId) => {
    window.open(`/api/v1/order/${orderId}/invoice`, "_blank");
  };
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(myOrders());
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
          // <Link to={`/order/${params.row.id}`}>
          //   <LaunchIcon />
          // </Link>
            <div style={{ display: "flex", gap: "10px" }}>
            <Link to={`/order/${params.row.id}`}>
              <LaunchIcon />
            </Link>
            <IconButton
              color="primary"
              title="Download Invoice"
              onClick={() => handleDownloadInvoice(params.row.id)}
            >
              <PictureAsPdfIcon />
            </IconButton>
          </div>
        );
      },
    },
  ];


  const rows = orders && Array.isArray(orders)
  ? orders.map((item) => ({
      itemsQty: item.orderItems.length,
      id: item._id,
      status: item.orderStatus,
      amount: item.totalPrice,
    }))
  : [];

  return (
  <Fragment>
    <ToastContainer />
    <MetaData title={`${user?.name || "User"} - Orders`} />
    {loading ? (
      <Loader />
    ) : (
      <div className="myOrdersPage">
        {rows.length > 0 ? (
          <>
              <Typography
                id="myOrdersHeading"
                variant="h5"
                style={{ textAlign: "center", margin: "20px 0", fontWeight: "600" }}
              >
                🧾 Download Invoices
              </Typography>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              disableSelectionOnClick
              className="myOrdersTable"
              autoHeight
            />
            <Typography id="myOrdersHeading">
              {user?.name || "User"}'s Orders
            </Typography>
          </>
        ) : (
          <div className="noOrdersMessage">
            <div className="emptyCart">
              <Typography>No Orders yet 🛒</Typography>
              <Link to="/products">View Products</Link>
            </div>
          </div>
        )}
      </div>
    )}
  </Fragment>
);
};

export default MyOrders;
