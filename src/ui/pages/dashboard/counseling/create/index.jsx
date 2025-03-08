import React, { useEffect, useRef, useState } from "react";
import UseTitle from "../../../../hooks/use-title";
import { selectCurrentToken } from "../../../../redux/feature/auth/slice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAddCounselingMutation } from "../../../../redux/feature/counsule/api";
import { useFilterStudentNameQuery } from "../../../../redux/feature/filter/api";
import {
  Box,
  Button,
  Container,
  Flex,
  Select,
  Spinner,
  Text,
  TextArea,
} from "@radix-ui/themes";

function Create() {
  UseTitle("Counseling - create | Konselin");

  const errorRef = useRef();
  const navigate = useNavigate();
  const token = useSelector(selectCurrentToken);

  const [type, setType] = useState("");
  const [problem, setProblem] = useState("");
  const [problemSolving, setProblemSolving] = useState("");
  const [student, setStudent] = useState("");
  const [error, setError] = useState("");

  const {
    data: students,
    isLoading: isStudentsLoading,
    isSuccess: isStudentsSuccess,
  } = useFilterStudentNameQuery();
  const [addCounseling, { isLoading }] = useAddCounselingMutation();

  console.log(students, "<<< students");

  const counselingType = ["individu", "group"];

  useEffect(() => {
    setError("");
  }, [type, student, problem, problemSolving]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await addCounseling({
        token,
        type,
        student,
        problem,
        problemSolving,
      }).unwrap();

      setType("");
      setStudent("");
      setProblem("");
      setProblemSolving("");
      navigate("/dashboard/counseling");
    } catch (err) {
      console.error("Failed to add counseling:", err);

      if (err.data && err.data.message) {
        setError(err.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }

      if (errorRef.current) {
        errorRef.current.focus();
      }
    }
  }

  return (
    <>
      <div className="p-4 mb-16 flex justify-between">
        <div className=""></div>
        <div className=""></div>
      </div>
      {error && (
        <div
          ref={errorRef}
          tabIndex={-1}
          aria-live="assertive"
          style={{ outline: "none", color: "red", marginBottom: "1rem" }}
        >
          {error}
        </div>
      )}
      <Container size="2">
        <form onSubmit={handleSubmit} autoComplete="off">
          <Flex gap="4" className="mb-4">
            <Box>
              <Text as="label" size="1">
                Counseling type
              </Text>
              <div className="w-full">
                <Select.Root defaultValue={type} onValueChange={setType}>
                  <Select.Trigger
                    placeholder="Pick a counseling type"
                    className="w-full"
                  />
                  <Select.Content className="w-full">
                    {counselingType.map((item, index) => (
                      <Select.Item key={index} value={item}>
                        {item}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>
            </Box>
            <Box>
              <Text as="label" size="1">
                Student
              </Text>
              <div className="w-full">
                <Select.Root defaultValue={student} onValueChange={setStudent}>
                  <Select.Trigger
                    placeholder="Pick a student"
                    className="w-full"
                  />
                  <Select.Content className="w-full">
                    {isStudentsSuccess &&
                      students.data.map((item) => (
                        <Select.Item key={item.id} value={item.id}>
                          {item.full_name}
                        </Select.Item>
                      ))}
                  </Select.Content>
                </Select.Root>
              </div>
            </Box>
          </Flex>
          <div className="mb-4">
            <Text as="label" size="1">
              Problem
            </Text>
            <TextArea
              radius="large"
              placeholder="Type problem here..."
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Text as="label" size="1">
              Problem solving
            </Text>
            <TextArea
              radius="large"
              placeholder="Type problem solving here..."
              value={problemSolving}
              onChange={(e) => setProblemSolving(e.target.value)}
            />
          </div>
          <Button radius="large" variant="solid" disabled={isLoading}>
            {isLoading ? <Spinner size="2" /> : "Submit"}
          </Button>
        </form>
      </Container>
    </>
  );
}

export default Create;
