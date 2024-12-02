import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector } from "react-redux";

// Define light theme
const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
  typography: {
    fontFamily: "Nunito, Inter, Arial, sans-serif",
  },
});

// Define dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: "Nunito, Inter, Arial, sans-serif",
  },
});

export default function PaginatedDataTable({
  items,
  columns,
  paginationModel,
  setPaginationModel,
  sortModel,
  setSortModel,
  totalRows,
}) {
  const layoutTheme = useSelector((state) => state.Layout.theme);

  const theme = layoutTheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <div style={{ height: "100%", width: "100%" }}>
        <DataGrid
          sx={{
            flexGrow: 1,
            ".MuiDataGrid-columnSeparator": {
              display: "none",
            },
            "& .MuiDataGrid-columnHeader": {
              paddingLeft: "1.5rem",
              backgroundColor: layoutTheme === 'dark' ? "#141414" : "#FAFAFA",
              borderBottom: "1px solid",
              borderBottomColor: layoutTheme === 'dark' ? "#555" : "#E0E0E0",
            },
            "& .MuiDataGrid-columnHeaders": {
              color: layoutTheme === 'dark' ? "white" : "black",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              whiteSpace: "break-spaces",
              lineHeight: 1,
              letterSpacing: 1.1,
              fontSize: 12,
              fontWeight: 600,
              color: layoutTheme === 'dark' ? "white" : "black",
            },
            ".MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel": {
              marginTop: "1em",
              marginBottom: "1em",
            },
            "& .MuiDataGrid-row": {
              paddingLeft: "1rem",
              borderBottom: "1px solid",
              borderBottomColor: layoutTheme === 'dark' ? "#555" : "#E0E0E0",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid",
              borderTopColor: layoutTheme === 'dark' ? "#555" : "#E0E0E0",
            },
            "& .MuiDataGrid-cell": {
              fontSize: 14, // Adjust this value to your desired size
            },
            backgroundColor: layoutTheme === 'dark' ? "#252b3b" : "#FFF",
            // Pagination footer styles
            "& .MuiTablePagination-root": {
              color: layoutTheme === 'dark' ? "#FFF" : "#000",
            },
            "& .MuiTablePagination-actions": {
              color: layoutTheme === 'dark' ? "#FFF" : "#000",
            },
            "& .MuiTablePagination-displayedRows": {
              color: layoutTheme === 'dark' ? "#FFF" : "#000",
            },
            "& .MuiTablePagination-selectLabel": {
              color: layoutTheme === 'dark' ? "#FFF" : "#000",
            },
          }}
          rows={items}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: paginationModel,
            },
            sorting: {
              sortModel: sortModel,
            }
          }}
          pageSizeOptions={[5, 10, 25]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          rowCount={totalRows}
          paginationMode="server"
          autoHeight
          disableRowSelectionOnClick
          // Sorting functionality
          sortModel={sortModel} 
          onSortModelChange={setSortModel}
          sortingMode="server" // To handle sorting on the server-side
        />
      </div>
    </ThemeProvider>
  );
}
