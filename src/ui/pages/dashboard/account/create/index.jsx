import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Spinner,
  Text,
  TextField,
} from "@radix-ui/themes";
import { PiPlusLight } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import UseTitle from "../../../../hooks/use-title";
import { selectCurrentToken } from "../../../../redux/feature/auth/slice";
import { useRegisterMutation } from "../../../../redux/feature/account/api";

function Create() {
  UseTitle("Counsuler - create | Konselin");

  const errorRef = useRef();
  const navigate = useNavigate();
  const token = useSelector(selectCurrentToken);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [register, { isLoading }] = useRegisterMutation();

  useEffect(() => {
    setError("");
  }, [name, phone, password]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      register({
        token,
        name,
        phone,
        password,
      }).unwrap();

      setName("");
      setPhone("");
      setPassword("");
      navigate("/dashboard/account");
    } catch (err) {
      console.error("Failed to add account:", err);

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
          <Grid columns="3" gapX="4" gapY="2" width="auto" className="mb-2">
            <Box>
              <Text as="label" size="1">
                Name
              </Text>
              <TextField.Root
                radius="large"
                size="2"
                placeholder="Type name here..."
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                Password
              </Text>
              <TextField.Root
                radius="large"
                size="2"
                type="password"
                placeholder="Type password here..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Box>
          </Grid>
          <Button radius="large" variant="solid" disabled={isLoading}>
            {isLoading ? <Spinner size="2" /> : "Submit"}
          </Button>
        </form>
      </Container>
    </>
  );
}

export default Create;
