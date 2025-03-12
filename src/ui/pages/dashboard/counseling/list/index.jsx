import React, { useEffect, useState } from "react";
import UseTitle from "../../../../hooks/use-title";
import { selectCurrentToken } from "../../../../redux/feature/auth/slice";
import { useDispatch, useSelector } from "react-redux";
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
  Container,
  Flex,
  Grid,
  IconButton,
  Spinner,
  Table,
} from "@radix-ui/themes";
import { useGetAllCounselingQuery } from "../../../../redux/feature/counsule/api";
import {
  searchValue,
  selectCurrentSearchValue,
} from "../../../../redux/feature/filter/slice";
import { useLocation } from "react-router-dom";

function List() {
  UseTitle("Counseling - list | Konselin");

  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    // Reset search when location changes
    dispatch(searchValue(""));
  }, [location.pathname, dispatch]);

  const token = useSelector(selectCurrentToken);
  const search = useSelector(selectCurrentSearchValue);

  const [sortBy, setSortBy] = useState("created");

  const [className, setClassName] = useState("");
  const [selectedClassName, setSelectedClassName] = useState("");

  const [student, setStudent] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");

  const [counsuler, setCounsuler] = useState("");
  const [selectedCounsuler, setSelectedCounsuler] = useState("");

  const [type, setType] = useState("");
  const [selectedType, setSelectedType] = useState("");

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
    data: counselings,
    isLoading: isCounselingsLoading,
    isSuccess: isCounselingsSuccess,
    isError: isCounselingsError,
    error: counselingsError,
  } = useGetAllCounselingQuery(
    {
      token: token,
      search: search,
      sortBy,
      className,
      student,
      type,
      sortDirection,
      page,
      perPage,
    },
    { skip: !token }
  );

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
    { key: "type", label: "Tipe", sortable: true },
    { key: "student", label: "Murid", sortable: true },
    { key: "class", label: "Kelas", sortable: true },
    { key: "problem", label: "Permasalahan", sortable: true },
    { key: "counsuler", label: "Konsuler", sortable: true },
    { key: "created", label: "Created", sortable: true },
    { key: "action", label: null, sortable: false },
  ];

  return (
    <Container size="4" className="p-4">
      <Grid columns="2" gap="4" width="auto" className="mb-4">
        <Flex gap="1">
          {isClassNamesSuccess && (
            <Reusable.SearchableSelect
              options={classNames.data} // Pass the array of class objects
              onSelect={(selectedClass) => {
                setClassName(selectedClass); // Update the className state
                setSelectedClassName(selectedClass); // Update the selectedClassName state
              }}
              selectedValue={selectedClassName} // Display the selected class name
              displayField="class" // Use the "class" property for display
              valueField="class" // Use the "class" property for the value
              placeholder="Class" // Placeholder text
            />
          )}

          {isStudentsSuccess && (
            <Reusable.SearchableSelect
              options={students.data} // Pass the array of class objects
              onSelect={(selectedStudent) => {
                console.log(selectedStudent, "<<< selectedStudent");
                setStudent(selectedStudent); // Update the className state
                setSelectedStudent(selectedStudent); // Update the selectedClassName state
              }}
              selectedValue={selectedStudent} // Display the selected class name
              displayField="full_name" // Use the "class" property for display
              valueField="full_name" // Use the "class" property for the value
              placeholder="Student" // Placeholder text
            />
          )}

          {isCounselingTypeSuccess && (
            <Reusable.SearchableSelect
              options={counselingType.data} // Pass the array of class objects
              onSelect={(selectedType) => {
                console.log(selectedType, "<<< selectedType");
                setType(selectedType); // Update the className state
                setSelectedType(selectedType); // Update the selectedClassName state
              }}
              selectedValue={selectedType} // Display the selected class name
              displayField="type" // Use the "class" property for display
              valueField="type" // Use the "class" property for the value
              placeholder="Type" // Placeholder text
            />
          )}

          {isCounselingNameSuccess && (
            <Reusable.SearchableSelect
              options={counselingName.data} // Pass the array of class objects
              onSelect={(selectedCounsuler) => {
                console.log(selectedCounsuler, "<<< selectedCounsuler");
                setCounsuler(selectedCounsuler); // Update the className state
                setSelectedCounsuler(selectedCounsuler); // Update the selectedClassName state
              }}
              selectedValue={selectedCounsuler} // Display the selected class name
              displayField="name" // Use the "class" property for display
              valueField="name" // Use the "class" property for the value
              placeholder="Counsuler" // Placeholder text
            />
          )}
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
                      size={16}
                      className="cursor-pointer"
                    />
                  </Table.Cell>
                </Table.Row>
              );
            })
          ) : (
            <Table.Row>
              <Table.Cell colSpan={columns.length} align="center">
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
