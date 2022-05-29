import React from "react";
import { useAuth } from "~/context/AuthContext";
import { api } from "~/services/apiClient";
import { withSSRAuth } from "~/utils/withSSRAuth";

export default function Dashboard() {
  const { user } = useAuth();

  React.useEffect(() => {
    api
      .get("/me")
      .then((response) => console.log("dashboard - client", response))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <h1>Dashboard</h1>
      <p>{user?.email}</p>
    </>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
