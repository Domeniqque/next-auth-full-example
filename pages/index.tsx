import React from "react";
import { useAuth } from "~/context/AuthContext";
import styles from "~/styles/Home.module.css";
import { withSSRGuest } from "~/utils/withSSRGuest";

export default function Home() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const { signIn } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const data = {
      email,
      password,
    };

    await signIn(data);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.loginContainer}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Entrar</button>
    </form>
  );
}

export const getServerSideProps = withSSRGuest(async () => {
  return {
    props: {},
  };
});
