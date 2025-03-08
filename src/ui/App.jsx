import React from "react";
import { Route, Routes } from "react-router-dom";
import RequireAuth from "./redux/feature/auth/require-auth";
import { Layout } from "./component";
import { Account, Counseling, Home, Login, Setting, Student } from "./pages";

function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route index element={<Login />} />

      {/* Protected routes */}
      <Route element={<RequireAuth />}>
        <Route path="dashboard" element={<Layout />}>
          <Route index element={<Home />} />

          {/* Account routes */}
          <Route path="account">
            <Route index element={<Account.List />} />
            <Route path="create" element={<Account.Create />} />
          </Route>

          {/* Student routes */}
          <Route path="student">
            <Route index element={<Student.List />} />
            <Route path="create" element={<Student.Create />} />
          </Route>

          {/* Counseling routes */}
          <Route path="counseling">
            <Route index element={<Counseling.List />} />
            <Route path="create" element={<Counseling.Create />} />
          </Route>

          {/* Setting routes */}
          <Route path="setting">
            <Route index element={<Setting.ChangePassword />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
