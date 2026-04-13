import { useState } from "react";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import { isEmail, required } from "../../utils/validators";

interface Props {
  onSubmit: (values: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  loading: boolean;
}

export default function RegisterForm({ onSubmit, loading }: Props) {
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange =
    (field: "name" | "email" | "password") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!required(values.name)) {
      setError("Name is required");
      return;
    }

    if (!required(values.email) || !isEmail(values.email)) {
      setError("Please enter a valid email");
      return;
    }

    if (values.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setError("");
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Register failed");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Name"
          value={values.name}
          onChange={handleChange("name")}
          fullWidth
        />
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
          {loading ? "Creating account..." : "Register"}
        </Button>
      </Stack>
    </Box>
  );
}
