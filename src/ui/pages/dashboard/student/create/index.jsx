import React, { useEffect, useRef, useState } from "react";
import UseTitle from "../../../../hooks/use-title";
import {
  Box,
  Button,
  Container,
  Grid,
  Select,
  Spinner,
  Text,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import { PiPlusLight } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAddStudentMutation } from "../../../../redux/feature/student/api";
import { selectCurrentToken } from "../../../../redux/feature/auth/slice";

function Create() {
  UseTitle("Student - create | Konselin");

  const errorRef = useRef();
  const navigate = useNavigate();
  const token = useSelector(selectCurrentToken);

  const [NISN, setNISN] = useState("");
  const [NIS, setNIS] = useState("");
  const [fullName, setFullName] = useState("");
  const [className, setClassName] = useState("");
  const [phone, setPhone] = useState("");
  const [parent, setParent] = useState("");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const [addStudent, { isLoading }] = useAddStudentMutation();

  useEffect(() => {
    setError("");
  }, [
    NISN,
    NIS,
    fullName,
    className,
    phone,
    parent,
    placeOfBirth,
    dateOfBirth,
    gender,
    address,
  ]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await addStudent({
        token,
        NISN,
        NIS,
        fullName,
        className,
        phone,
        parent,
        placeOfBirth,
        dateOfBirth,
        gender,
        address,
      }).unwrap();

      setNISN("");
      setNIS("");
      setFullName("");
      setClassName("");
      setPhone("");
      setParent("");
      setPlaceOfBirth("");
      setDateOfBirth("");
      setGender("");
      setAddress("");
      navigate("/dashboard/student");
    } catch (err) {
      console.error("Failed to add student:", err);

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
        <div className="">
          <Button radius="large" variant="solid">
            <PiPlusLight size={16} /> Import excell
          </Button>
        </div>
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
          <Grid columns="2" gapX="4" gapY="2" width="auto" className="mb-2">
            <Box>
              <Text as="label" size="1">
                NISN
              </Text>
              <TextField.Root
                radius="large"
                size="2"
                placeholder="Type NISN here..."
                value={NISN}
                onChange={(e) => setNISN(e.target.value)}
              />
            </Box>
            <Box>
              <Text as="label" size="1">
                NIS
              </Text>
              <TextField.Root
                radius="large"
                size="2"
                placeholder="Type NIS here..."
                value={NIS}
                onChange={(e) => setNIS(e.target.value)}
              />
            </Box>
            <Box>
              <Text as="label" size="1">
                Full name
              </Text>
              <TextField.Root
                radius="large"
                size="2"
                placeholder="Type full name here..."
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </Box>
            <Box>
              <Text as="label" size="1">
                Class
              </Text>
              <TextField.Root
                radius="large"
                size="2"
                placeholder="Type class here..."
                value={className}
                onChange={(e) => setClassName(e.target.value)}
              />
            </Box>
            <Box>
              <Text as="label" size="1">
                Phone
              </Text>
              <TextField.Root
                radius="large"
                size="2"
                placeholder="Type phone here..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Box>
            <Box>
              <Text as="label" size="1">
                Parent name
              </Text>
              <TextField.Root
                radius="large"
                size="2"
                placeholder="Type parent name here..."
                value={parent}
                onChange={(e) => setParent(e.target.value)}
              />
            </Box>
          </Grid>
          <Grid columns="3" gapX="4" gapY="2" width="auto" className="mb-2">
            <Box>
              <Text as="label" size="1">
                Place of birth
              </Text>
              <TextField.Root
                radius="large"
                size="2"
                placeholder="Type Place of birth here..."
                value={placeOfBirth}
                onChange={(e) => setPlaceOfBirth(e.target.value)}
              />
            </Box>
            <Box>
              <Text as="label" size="1">
                Date of birth
              </Text>
              <TextField.Root
                radius="large"
                type="date"
                size="2"
                placeholder="Type Date of birth here..."
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </Box>
            <Box>
              <Text as="label" size="1">
                Gender
              </Text>
              <div className="w-full">
                <Select.Root defaultValue={gender} onValueChange={setGender}>
                  <Select.Trigger
                    placeholder="Pick a gender"
                    className="w-full"
                  />
                  <Select.Content className="w-full">
                    <Select.Item value="male">Male</Select.Item>
                    <Select.Item value="female">Female</Select.Item>
                  </Select.Content>
                </Select.Root>
              </div>
            </Box>
          </Grid>
          <div className="mb-4">
            <Text as="label" size="1">
              Address
            </Text>
            <TextArea
              radius="large"
              placeholder="Type address here..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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
