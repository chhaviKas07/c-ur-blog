import React, { Fragment, useEffect, useState } from "react";
import "./productList.css";
import { useSelector, useDispatch } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Button } from "@mui/material";
import MetaData from "../layout/MetaData";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SideBar from "./Sidebar";
import {
  deleteOrder,
  getAllOrders,
  clearErrors,
  deleteorderReset,
  updateOrder,
  UPDATE_ORDER_RESET
} from "../../OrderSlice";

const OrderList = ({ history }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getPageSizeFromCount = (count) => {
    if (count <= 5) return 5;
    else if (count <= 10) return 10;
    else if (count <= 20) return 20;
    else if (count <= 50) return 50;
    else return 100;
  };
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const { error, orders } = useSelector((state) => state.orders);

  const { error: deleteError, isDeleted } = useSelector((state) => state.orders);

  const deleteOrderHandler = (id) => {
    dispatch(deleteOrder(id));
    // dispatch(deleteorderReset());
  };

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  useEffect(() => {
    // console.log("Error:", error);
    // console.log("DeleteError:", deleteError);
    // console.log("isDeleted:", isDeleted);
    if (orders) {
      const dynamicPageSize = getPageSizeFromCount(orders.length);
      setPaginationModel((prev) => ({
        ...prev,
        pageSize: dynamicPageSize,
      }));
    }
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("Order Deleted Successfully");
      dispatch(deleteorderReset()); // ✅ Reset here only after toast
      // dispatch(getAllOrders());    // ✅ Refetch list after successful delete
    }
    // else if (!orders || orders.length === 0) {
    //   dispatch(getAllOrders());    // ✅ Initial fetch
    // }
    // }, [dispatch, error, deleteError, isDeleted, orders, navigate]);
    // dispatch(getAllOrders());

  }, [dispatch, error, deleteError, isDeleted, orders]);



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
      flex: 0.4,
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
          <Fragment>
            {/* <ToastContainer /> */}
            <Link to={`/admin/order/${params.row.id}`}>
              <EditIcon />
            </Link>

            <Button onClick={() => deleteOrderHandler(params.row.id)}>
              <DeleteIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];

  orders &&
    orders.forEach((item) => {
      rows.push({
        id: item._id,
        itemsQty: item.orderItems.length,
        amount: item.totalPrice,
        status: item.orderStatus,
      });
    });

  return (
    <Fragment>
      {/* <ToastContainer /> */}
      <MetaData title={`ALL ORDERS - Admin`} />
      <div className="dashboard">
        <SideBar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL ORDERS</h1>
          {/* <DataGrid
            rows={rows}
            columns={columns}
            pagination
            paginationModel={paginationModel}
            onPaginationModelChange={(model) => setPaginationModel(model)}
            pageSizeOptions={[5, 10, 20, 50]}
            disableSelectionOnClick
            className="productListTable"
            autoHeight
          /> */}
          {/* <DataGrid
            rows={rows}
            columns={columns}
            pagination
            paginationModel={paginationModel}
            onPaginationModelChange={(model) => setPaginationModel(model)}
            pageSizeOptions={[]} // ❌ no dropdown
            disableRowSelectionOnClick
            className="productListTable"
            autoHeight
            rowCount={rows.length}
            paginationMode="client"
          /> */}
          <DataGrid
            rows={rows}
            columns={columns}
            pagination
            paginationModel={paginationModel}
            onPaginationModelChange={(model) => setPaginationModel(model)}
            pageSizeOptions={[5, 10, 20, 50]}
            disableSelectionOnClick
            className="productListTable"
            autoHeight
          />
        </div>
      </div>
    </Fragment>
  );
};

export default OrderList;
