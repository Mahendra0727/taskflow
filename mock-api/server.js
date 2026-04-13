const jsonServer = require("json-server");
const { randomUUID } = require("crypto");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(jsonServer.bodyParser);
server.use(middlewares);

server.post("/login", (req, res) => {
  const { email, password } = req.body;
  const db = router.db;
  const user = db.get("users").find({ email, password }).value();

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  return res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at,
  });
});

server.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const db = router.db;

  const existing = db.get("users").find({ email }).value();
  if (existing) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const newUser = {
    id: randomUUID(),
    name,
    email,
    password,
    created_at: new Date().toISOString(),
  };

  db.get("users").push(newUser).write();

  return res.status(201).json({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    created_at: newUser.created_at,
  });
});

server.use(router);
server.listen(4000, "0.0.0.0", () => {
  console.log("Mock API running on port 4000");
});
