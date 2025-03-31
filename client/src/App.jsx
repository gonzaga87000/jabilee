import { useEffect, useState } from "react";
import Todo from "./Todo";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    console.log("App useEffect triggered"); // Debugging log
    const getTodos = async () => {
      console.log("Fetching todos from API"); // Debugging log
      const res = await fetch("/api/todos");
      const todos = await res.json();
      setTodos(todos);
    };
    getTodos();
  }, []);

  const createNewTodo = async (e) => {
    e.preventDefault();
    console.log("createNewTodo triggered"); // Debugging log
    if (content.length > 3) {
      console.log("Creating new todo"); // Debugging log
      const res = await fetch("/api/todos", {
        method: "POST",
        body: JSON.stringify({ todo: content }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const newTodo = await res.json();
      setContent("");
      setTodos([...todos, newTodo]);
    }
  };

  return (
    <main className="container">
      <h1 className="title">Awesome Todos</h1>
      <form className="form" onSubmit={createNewTodo}>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter a new todo..."
          className="form__input"
          required
        />
        <button type="submit">Create Todo</button>
      </form>
      <div className="todos">
        {todos.length > 0 &&
          todos.map((todo) => (
            <Todo todo={todo} setTodos={setTodos} key={todo._id} />
          ))}
      </div>
    </main>
  );
}