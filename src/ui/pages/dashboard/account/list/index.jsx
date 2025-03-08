import React, { useState } from "react";
import { useGetAllAccountsQuery } from "../../../../redux/feature/account/api";
import UseTitle from "../../../../hooks/use-title";
import {
  Container,
  Grid,
  IconButton,
  Spinner,
  Table,
  TextField,
} from "@radix-ui/themes";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../../../redux/feature/auth/slice";
import {
  PiMagnifyingGlassLight,
  PiCaretRightLight,
  PiCaretLeftLight,
} from "react-icons/pi";
import { Reusable } from "../../../../component";

function List() {
  UseTitle("Counsuler - list | Konselin");

  const token = useSelector(selectCurrentToken);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("created");
  const [sortDirection, setSortDirection] = useState("DESC");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);

  const {
    data: counsulers,
    isLoading: isCounsulersLoading,
    isSuccess: isCounsulersSuccess,
  } = useGetAllAccountsQuery({
    token: token,
    search,
    sortBy,
    sortDirection,
    page,
    perPage,
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Format date as "03 March, 2025"
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    // Combine date and time
    return `${formattedDate}`;
  };

  const sortToggle = (column) => {
    setSortBy(column);
    setSortDirection(
      sortBy === column && sortDirection === "ASC" ? "DESC" : "ASC"
    );
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (counsulers?.meta?.total_pages && page < counsulers.meta.total_pages) {
      setPage(page + 1);
    }
  };

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "phone", label: "Phone", sortable: true },
    { key: "created", label: "Created Date", sortable: true },
    { key: "modified", label: "Modified Date", sortable: true },
  ];

  return (
    <Container size="4" className="p-4">
      <Grid columns="2" gap="4" width="auto" className="mb-4">
        <TextField.Root
          radius="large"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        >
          <TextField.Slot>
            <PiMagnifyingGlassLight size={16} />
          </TextField.Slot>
        </TextField.Root>
        <div className="flex justify-end items-center gap-1">
          {/* Previous Button */}
          <IconButton
            radius="large"
            variant="outline"
            className="cursor-pointer"
            onClick={handlePreviousPage}
            disabled={page === 1} // Disable on first page
          >
            <PiCaretLeftLight size={16} />
          </IconButton>

          {/* Next Button */}
          <IconButton
            radius="large"
            variant="outline"
            className="cursor-pointer"
            onClick={handleNextPage}
            disabled={
              !counsulers?.meta?.total_pages ||
              page >= counsulers.meta.total_pages
            } // Disable on last page
          >
            <PiCaretRightLight size={16} />
          </IconButton>
        </div>
      </Grid>
      <Table.Root size="1" variant="surface">
        <Table.Header>
          <Table.Row>
            {columns.map(({ key, label, sortable }) => (
              <Reusable.SortableColumnHeader
                key={key}
                column={key}
                label={label}
                sortable={sortable}
                sortBy={sortBy}
                sortDirection={sortDirection}
                sortToggle={sortToggle}
              />
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {isCounsulersSuccess ? (
            counsulers.data.map((item) => (
              <Table.Row key={item.id}>
                <Table.RowHeaderCell>{item.name}</Table.RowHeaderCell>
                <Table.Cell>{item.phone}</Table.Cell>
                <Table.Cell>{formatDate(item.created_at)}</Table.Cell>
                <Table.Cell>{formatDate(item.updated_at)}</Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan={4}>
                <Spinner />
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>
    </Container>
  );
}

export default List;
