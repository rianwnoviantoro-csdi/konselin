import React, { useState } from "react";
import UseTitle from "../../../../hooks/use-title";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../../../redux/feature/auth/slice";
import { useGetAllStudentsQuery } from "../../../../redux/feature/student/api";
import {
  Box,
  Container,
  Flex,
  Grid,
  IconButton,
  Select,
  Spinner,
  Table,
  TextField,
} from "@radix-ui/themes";
import {
  PiCaretLeftLight,
  PiCaretRightLight,
  PiMagnifyingGlassLight,
} from "react-icons/pi";
import { Reusable } from "../../../../component";

function List() {
  UseTitle("Student - list | Konselin");
  const token = useSelector(selectCurrentToken);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("created");
  const [sortDirection, setSortDirection] = useState("DESC");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);

  const {
    data: students,
    isLoading: isStudentsLoading,
    isSuccess: isStudentsSuccess,
  } = useGetAllStudentsQuery({
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

    // Format time as "19:09:48"
    const formattedTime = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // Use 24-hour format
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
    if (students?.meta?.total_pages && page < students.meta.total_pages) {
      setPage(page + 1);
    }
  };

  const columns = [
    { key: "nis", label: "NIS", sortable: true },
    { key: "full_name", label: "Full name", sortable: true },
    { key: "class", label: "Class", sortable: true },
    { key: "created", label: "Created Date", sortable: true },
    { key: "modified", label: "Modified Date", sortable: true },
  ];

  return (
    <Container size="4" className="p-4">
      <Grid columns="2" gap="4" width="auto" className="mb-4">
        <Flex gap="1">
          <Select.Root>
            <Select.Trigger placeholder="Pick a class" />
            <Select.Content>
              <Select.Group>
                <Select.Label>Fruits</Select.Label>
                <Select.Item value="orange">Orange</Select.Item>
                <Select.Item value="apple">Apple</Select.Item>
                <Select.Item value="grape" disabled>
                  Grape
                </Select.Item>
              </Select.Group>
              <Select.Separator />
              <Select.Group>
                <Select.Label>Vegetables</Select.Label>
                <Select.Item value="carrot">Carrot</Select.Item>
                <Select.Item value="potato">Potato</Select.Item>
              </Select.Group>
            </Select.Content>
          </Select.Root>

          <Box width="100%">
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
          </Box>
        </Flex>
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
              !students?.meta?.total_pages || page >= students.meta.total_pages
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
          {isStudentsSuccess ? (
            students.data.map((item) => (
              <Table.Row key={item.id}>
                <Table.RowHeaderCell>{item.nis}</Table.RowHeaderCell>
                <Table.Cell>{item.full_name}</Table.Cell>
                <Table.Cell>{item.class}</Table.Cell>
                <Table.Cell>{formatDate(item.created_at)}</Table.Cell>
                <Table.Cell>{formatDate(item.updated_at)}</Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Spinner />
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>
    </Container>
  );
}

export default List;
