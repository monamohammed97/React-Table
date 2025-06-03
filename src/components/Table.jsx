import React, { useCallback, useMemo } from "react";
import { useTable, usePagination } from "react-table";
import ArrowIcon from "../assets/ArrowIcon";
import DoubleArrow from "../assets/DoubleArrow";
import getCellStyle from "../utils/getCellStyle";
import exportExcel from "../utils/exportExcel";

function Table({
  data,
  differences,
  isFirstUpload,
  fileName,
  handleEdit,
  handleDelete,
}) {
<<<<<<< HEAD
 
=======
  const { role } = JSON.parse(localStorage.getItem("user"));

>>>>>>> gh-pages
  const ActionButtons = React.memo(({ rowData, onEdit, onDelete }) => {
    return (
      <div className="actions-box">
        {/* <button className="accepted" onClick={() => onEdit(rowData)}>
          Edit
        </button> */}
        <button className="rejected" onClick={() => onDelete(rowData)}>
          Delete
        </button>
      </div>
    );
  });

  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];

    const baseColumns = Object.keys(data[0]).map((key) => ({
      Header: key.charAt(0).toUpperCase() + key.slice(1),
      accessor: key,
    }));

    const actionColumn = {
      Header: "Actions",
      id: "actions",
      Cell: ({ row }) => (
        <ActionButtons
          rowData={row.original}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ),
    };
<<<<<<< HEAD

    return [...baseColumns, actionColumn];
=======
    return role == "admin" ? [...baseColumns, actionColumn] : [...baseColumns];
>>>>>>> gh-pages
  }, [data, handleEdit, handleDelete]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    state: { pageIndex },
    nextPage,
    previousPage,
    gotoPage,
    setPageSize,
    state,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    usePagination
  );

  if (columns.length === 0)
    return <p className="flex">Upload file to display data ..</p>;

  return (
    <div className="table-container">
      <table
        {...getTableProps()}
        border="1"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  key={column.id}
                  style={{ padding: "8px" }}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.id}>
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    key={cell.column.id}
                    style={{
                      padding: "8px",
                      ...getCellStyle(
                        row.index,
                        cell.column.id,
                        differences,
                        isFirstUpload
                      ),
                    }}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="container-pagination">
        <button
          className="btn-export"
          onClick={() => exportExcel(data, fileName)}
        >
          Export File
        </button>
        <div className="pagination">
          <button
            className="btn-page rotate"
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            <DoubleArrow />
          </button>{" "}
          <button
            className="btn-page rotate"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            <ArrowIcon />
          </button>{" "}
          <span>
            <strong>
              {pageIndex + 1} - {pageOptions.length}
            </strong>{" "}
          </span>
          <button
            className="btn-page"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            <ArrowIcon />
          </button>{" "}
          <button
            className="btn-page "
            onClick={() => gotoPage(pageOptions.length - 1)}
            disabled={!canNextPage}
          >
            <DoubleArrow />
          </button>{" "}
          <select
            value={state.pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="select-page"
          >
            {[5, 10, 15].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize} row
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default Table;
