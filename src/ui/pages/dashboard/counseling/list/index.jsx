import React, { useState } from "react";
import UseTitle from "../../../../hooks/use-title";
import { selectCurrentToken } from "../../../../redux/feature/auth/slice";
import { useSelector } from "react-redux";
import {
  useFilterClassQuery,
  useFilterCounselingTypeQuery,
  useFilterCounsulerNameQuery,
  useFilterStudentNameQuery,
} from "../../../../redux/feature/filter/api";
import {
  PiCaretLeftLight,
  PiCaretRightLight,
  PiMagnifyingGlassLight,
} from "react-icons/pi";
import { Reusable } from "../../../../component";
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
  useGetAllCounselingQuery,
  useGetCounselingByIdQuery,
} from "../../../../redux/feature/counsule/api";

function List() {
  UseTitle("Counseling - list | Konselin");
  const token = useSelector(selectCurrentToken);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("created");
  const [className, setClassName] = useState("");
  const [student, setStudent] = useState("");
  const [counsuler, setCounsuler] = useState("");
  const [counsuleId, setCounsuleId] = useState("");
  const [type, setType] = useState("");
  const [sortDirection, setSortDirection] = useState("DESC");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);

  const {
    data: students,
    isLoading: isStudentsLoading,
    isSuccess: isStudentsSuccess,
  } = useFilterStudentNameQuery();

  const {
    data: classNames,
    isLoading: isClassNamesLoading,
    isSuccess: isClassNamesSuccess,
  } = useFilterClassQuery();

  const {
    data: counselingType,
    isLoading: isCounselingTypeLoading,
    isSuccess: isCounselingTypeSuccess,
  } = useFilterCounselingTypeQuery();

  const {
    data: counselingName,
    isLoading: isCounselingNameLoading,
    isSuccess: isCounselingNameSuccess,
  } = useFilterCounsulerNameQuery();

  const {
    data: counselingsDetail,
    isLoading: isCounselingsDetailLoading,
    isSuccess: isCounselingsDetailSuccess,
    isError: isCounselingsDetailError,
    error: counselingsDetailError,
  } = useGetCounselingByIdQuery({
    token: token,
    id: counsuleId,
  });

  const {
    data: counselings,
    isLoading: isCounselingsLoading,
    isSuccess: isCounselingsSuccess,
    isError: isCounselingsError,
    error: counselingsError,
  } = useGetAllCounselingQuery({
    token: token,
    search,
    sortBy,
    className,
    student,
    type,
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
    if (counselings?.meta?.total_pages && page < counselings.meta.total_pages) {
      setPage(page + 1);
    }
  };

  const columns = [
    { key: "type", label: "Type", sortable: true },
    { key: "student", label: "Student", sortable: true },
    { key: "class", label: "Class", sortable: true },
    { key: "problem", label: "Problem", sortable: true },
    { key: "counsuler", label: "Counsuler", sortable: true },
    { key: "created", label: "Created", sortable: true },
    { key: "action", label: null, sortable: false },
  ];

  return (
    <Container size="4" className="p-4">
      <Grid columns="2" gap="4" width="auto" className="mb-4">
        <Flex gap="1">
          <Select.Root defaultValue={className} onValueChange={setClassName}>
            <Select.Trigger placeholder="Student" />
            <Select.Content>
              {isStudentsSuccess &&
                students.data.map((item, index) => (
                  <Select.Item key={index} value={item.full_name}>
                    {item.full_name}
                  </Select.Item>
                ))}
            </Select.Content>
          </Select.Root>

          <Select.Root defaultValue={className} onValueChange={setClassName}>
            <Select.Trigger placeholder="Class" />
            <Select.Content>
              {isClassNamesSuccess &&
                classNames.data.map((item, index) => (
                  <Select.Item key={index} value={item.class}>
                    {item.class}
                  </Select.Item>
                ))}
            </Select.Content>
          </Select.Root>

          <Select.Root defaultValue={type} onValueChange={setType}>
            <Select.Trigger placeholder="Type" />
            <Select.Content>
              {isCounselingTypeSuccess &&
                counselingType.data.map((item, index) => (
                  <Select.Item key={index} value={item.type}>
                    {item.type}
                  </Select.Item>
                ))}
            </Select.Content>
          </Select.Root>

          <Select.Root defaultValue={counsuler} onValueChange={setCounsuler}>
            <Select.Trigger placeholder="Counsuler" />
            <Select.Content>
              {isCounselingNameSuccess &&
                counselingName.data.map((item, index) => (
                  <Select.Item key={index} value={item.name}>
                    {item.name}
                  </Select.Item>
                ))}
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
              !counselings?.meta?.total_pages ||
              page >= counselings.meta.total_pages
            } // Disable on last page
          >
            <PiCaretRightLight size={16} />
          </IconButton>
        </div>
      </Grid>

      {counselingsError && (
        <div
          tabIndex={-1} // Make the div focusable
          style={{ outline: "none" }} // Remove the default outline when focused
        >
          {counselingsError.message.split(":")[2]}
        </div>
      )}

      <Table.Root size="1" variant="surface">
        <Table.Header>
          <Table.Row>
            {columns.map(({ key, label, sortable }) => (
              <Reusable.SortableColumnHeader
                key={key}
                column={key}
                label={label}
                sortBy={sortBy}
                sortable={sortable}
                sortDirection={sortDirection}
                sortToggle={sortToggle}
              />
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {isCounselingsSuccess ? (
            counselings.data.map((item) => {
              return (
                <Table.Row key={item.id}>
                  <Table.RowHeaderCell>{item.type}</Table.RowHeaderCell>
                  <Table.Cell>{item.student}</Table.Cell>
                  <Table.Cell>{item.class}</Table.Cell>
                  <Table.Cell>{item.problem}</Table.Cell>
                  <Table.Cell>{item.counsuler}</Table.Cell>
                  <Table.Cell>{formatDate(item.created_at)}</Table.Cell>
                  <Table.Cell>
                    <PiMagnifyingGlassLight
                      onClick={() => {
                        setCounsuleId(item.id);
                      }}
                      size={16}
                      className="cursor-pointer"
                    />
                  </Table.Cell>
                </Table.Row>
              );
            })
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
