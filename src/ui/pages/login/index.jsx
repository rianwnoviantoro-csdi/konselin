import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import UseTitle from "../../hooks/use-title";
import { useLoginMutation } from "../../redux/feature/auth/api";
import { loginSuccess } from "../../redux/feature/auth/slice";
import { useGetAccountNamesQuery } from "../../redux/feature/account/api";
import { Button, Grid, Spinner, TextField } from "@radix-ui/themes";
import { Reusable } from "../../component";
import { Phone } from "lucide-react";

function Login() {
  UseTitle("Login - Konselin");

  const errorRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [selectedName, setSelectedName] = useState(""); // State to store the selected name
  const [login, { isLoading }] = useLoginMutation();
  const { data: accounts, isLoading: isAccountsLoading } =
    useGetAccountNamesQuery();

  useEffect(() => {
    setError("");
  }, [phone, password]);

  //   useEffect(() => {
  //     if (!isAccountsLoading && accounts?.data?.length > 0) {
  //       // Set the default phone number and name to the first account's values
  //       setPhone(accounts.data[0].phone);
  //       setSelectedName(accounts.data[0].name);
  //     }
  //   }, [accounts, isAccountsLoading]);

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
          {accounts && (
            <Reusable.SearchableSelect
              options={accounts.data}
              onSelect={(phone) => {
                setPhone(phone);
                const selectedAccount = accounts.data.find(
                  (account) => account.phone === phone
                );
                setSelectedName(selectedAccount?.name || ""); // Update selected name
              }}
              selectedValue={selectedName}
              displayField="name"
              valueField="phone"
              placeholder="Search by name..."
            />
          )}

          <input
            type="password"
            placeholder="Your password here..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
