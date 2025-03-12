import {
  Box,
  Button,
  Container,
  Grid,
  Spinner,
  Text,
  TextField,
} from "@radix-ui/themes";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  selectCurrentToken,
} from "../../../../redux/feature/auth/slice";
import { useChangePasswordMutation } from "../../../../redux/feature/account/api";
import UseTitle from "../../../../hooks/use-title";

function ChangePassword() {
  UseTitle("Setting - change password | Konselin");

  const errorRef = useRef();
  const dispatch = useDispatch();
  const token = useSelector(selectCurrentToken);

  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [error, setError] = useState("");

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  useEffect(() => {
    setError("");
  }, [oldPassword, newPassword]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await changePassword({
        token,
        oldPassword,
        newPassword,
      }).unwrap();

      setNewPassword("");
      setOldPassword("");
      dispatch(logout());
    } catch (err) {
      console.error("Failed to change password:", err);

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
    <Container size="4" className="p-4">
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
      <form onSubmit={handleSubmit} autoComplete="off">
        <Grid columns="2" gapX="4" gapY="2" width="auto" className="mb-4">
          <Box>
            <Text as="label" size="1">
              Old password
            </Text>
            <TextField.Root
              radius="large"
              size="2"
              type="password"
              placeholder="Type password here..."
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </Box>
          <Box>
            <Text as="label" size="1">
              New password
            </Text>
            <TextField.Root
              radius="large"
              size="2"
              type="password"
              placeholder="Type password here..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Box>
        </Grid>
        <Button radius="large" variant="solid" disabled={isLoading}>
          {isLoading ? <Spinner size="2" /> : "Submit"}
        </Button>
      </form>
    </Container>
  );
}

export default ChangePassword;
