import { Avatar, Button, Typography } from "@mui/material";

export function createOrderColumns(onOrderDetail) {
  return [
    {
      field: "id",
      headerName: "ID",
      width: 90,
      description: "id of the product",
    },
    {
      field: "fullname",
      headerName: "Full Name",
      width: 400,
      description: "customer full name",
      renderCell: (params) => {
        return (
          <>
            <Avatar alt="name" sx={{ width: 30, height: 30 }}>
              Z
            </Avatar>
            <Typography variant="subtitle2" sx={{ mx: 3 }}>
              {`${params.row.customer.firstName || ""} ${
                params.row.customer.lastName || ""
              } `}
            </Typography>
          </>
        );
      },
    },
    {
      field: "mobile",
      headerName: "Mobile",
      width: 400,
      description: "customer phone number ",
      valueGetter: (params) => params.row.customer.mobile,
    },
    {
      field: "total",
      headerName: "Total Amount",
      width: 300,
      description: "total amount of the order",
      valueGetter: (params) => {
        const total = params.row.products.reduce(
          (subtotal, orderProduct) =>
            subtotal + orderProduct.quantity * orderProduct.product.price,
          0
        );
        return total;
      },
    },
    {
      field: "details",
      headerName: "Order Details",
      width: 300,
      description: "the details of the order",

      renderCell: (params) => {
        const order = params.row;
        return (
          <Button
            variant="contained"
            sx={{ bgcolor: "#504099" }}
            onClick={() => onOrderDetail(order)}
          >
            Order Details
          </Button>
        );
      },
    },
  ];
}
