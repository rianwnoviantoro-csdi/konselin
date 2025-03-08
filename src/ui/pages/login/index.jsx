import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import UseTitle from "../../hooks/use-title";
import { useLoginMutation } from "../../redux/feature/auth/api";
import { loginSuccess } from "../../redux/feature/auth/slice";
import { useGetAccountNamesQuery } from "../../redux/feature/account/api";
import { Button, Grid, Select, Spinner, TextField } from "@radix-ui/themes";

function Login() {
  UseTitle("Login - Konselin");

  const errorRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const { data: accounts, isLoading: isAccountsLoading } =
    useGetAccountNamesQuery();

  useEffect(() => {
    setError("");
  }, [phone, password]);

  useEffect(() => {
    if (!isAccountsLoading && accounts.data.length > 0) {
      setPhone(accounts.data[0].phone);
    }
  }, [accounts, isAccountsLoading]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const loggedIn = await login({ phone, password }).unwrap();

      dispatch(loginSuccess(loggedIn));
      setPhone("");
      setPassword("");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message.split(":")[2]);

      if (errorRef.current) {
        errorRef.current.focus();
      }
    }
  }

  return (
    <Grid columns="2" gap="3" width="auto" className="h-screen">
      <div className="p-4 flex justify-center items-center m-auto w-full">
        {error && (
          <div
            ref={errorRef}
            tabIndex={-1} // Make the div focusable
            style={{ outline: "none" }} // Remove the default outline when focused
          >
            {error}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          className="flex flex-col gap-3 justify-center w-[50%]"
        >
          <Select.Root defaultValue={phone} onValueChange={setPhone}>
            <Select.Trigger
              radius="large"
              placeholder="Pick an account"
              className="w-full"
            />
            <Select.Content className="w-full">
              {!isAccountsLoading &&
                accounts.data.map((account) => (
                  <Select.Item key={account.id} value={account.phone}>
                    {account.name}
                  </Select.Item>
                ))}
            </Select.Content>
          </Select.Root>

          <TextField.Root
            radius="large"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Type your password here"
            className="w-full"
          />

          <Button
            radius="large"
            variant="soft"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? <Spinner size="2" /> : "Login"}
          </Button>
        </form>
      </div>
      <div className="p-4 bg-gray-800"></div>
    </Grid>
  );
}

export default Login;
