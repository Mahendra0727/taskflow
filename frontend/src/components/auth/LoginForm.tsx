import { useState } from "react";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import { isEmail, required } from "../../utils/validators";

interface Props {
  onSubmit: (values: { email: string; password: string }) => Promise<void>;
  loading: boolean;
}

export default function LoginForm({ onSubmit, loading }: Props) {
  const [values, setValues] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange =
    (field: "email" | "password") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!required(values.email) || !isEmail(values.email)) {
      setError("Please enter a valid email");
      return;
    }

    if (!required(values.password)) {
      setError("Password is required");
      return;
    }

    try {
      setError("");
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Email"
          value={values.email}
          onChange={handleChange("email")}
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          value={values.password}
          onChange={handleChange("password")}
          fullWidth
        />
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </Button>
      </Stack>
    </Box>
  );
}
