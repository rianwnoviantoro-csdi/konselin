import React from "react";
import UseTitle from "../../../hooks/use-title";
import { Container } from "@radix-ui/themes";

function Home() {
  UseTitle("Dashboard | Konselin");

  return (
    <Container size="4" className="p-4">
      Home
    </Container>
  );
}

export default Home;
