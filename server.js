require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const port = process.env.PORT || 3001;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.use(cors());
app.use(express.json());

// GET todos
app.get("/todos", async (req, res) => {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST todo
app.post("/todos", async (req, res) => {
  const todo = req.body;
  const { data, error } = await supabase.from("todos").insert([todo]).single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PUT update todo
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const updated = req.body;
  const { data, error } = await supabase
    .from("todos")
    .update(updated)
    .eq("id", id)
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// DELETE todo
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("todos").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});
