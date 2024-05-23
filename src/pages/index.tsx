import { useEffect, useState } from "react";
import { Supabase } from "@/components/Supabase";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

type Todos = {
  id: number;
  todo: string;
};

export default function Home() {
  const [todos, setTodos] = useState<null | Todos[]>(null);
  const [todoId, setTodoId] = useState<null | number>(null);
  const [todo, setTodo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  //create and update operation
  const handleSubmit = async (
    e: { preventDefault: () => void },
    id?: number
  ) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (todoId) {
      const { error } = await Supabase.from("todos")
        .update([{ todo: todo }])
        .eq("id", todoId);
      if (error) {
        console.log(error.message);
      } else {
        fetchTodos();
        console.log("Todo updated successfully");
        setTodo("");
        setTodoId(null);
      }
    } else {
      const { error } = await Supabase.from("todos").insert([{ todo: todo }]);
      if (error) {
        console.log(error.message);
      } else {
        fetchTodos();
        console.log("New todo added to Supabase DB");
        setTodo("");
      }
    }
    setIsSubmitting(false);
  };

  const fetchTodos = async () => {
    const { data, error } = await Supabase.from("todos").select();
    if (error) {
      console.log(error?.message);
    } else {
      setTodos(data);
    }
  };
  //read operations
  useEffect(() => {
    fetchTodos();
  }, []);

  //delete operations
  const handleDelete = async (id: number) => {
    const { error } = await Supabase.from("todos").delete().eq("id", id);
    if (error) {
      console.log(error.message);
    } else {
      console.log("Deleted todo from Supabase DB");
      fetchTodos();
    }
  };

  return (
    <main>
      <div className="bg-[url('/bg-mobile-light.jpg')] lg:bg-[url('/bg-desktop-light.jpg')] bg-cover h-96 w-full">
        <div className="flex flex-col pt-40 items-center justify-start">
          <div className="space-y-5">
            <h1 className="text-white font-bold text-4xl tracking-widest">
              Todo
            </h1>
            <form>
              <label htmlFor="todo" className="relative">
                <input
                  placeholder="Create a new todo..."
                  name="todo"
                  type="text"
                  value={todo}
                  onChange={(e) => setTodo(e.target.value)}
                  className="rounded-lg lg:w-96 h-14 pl-12"
                />
                <div>
                  <button
                    onClick={handleSubmit}
                    disabled={!todo || isSubmitting}
                    className="absolute inset-y-0 left-3 w-6 h-6 border rounded-full flex items-center"
                  />
                </div>
              </label>
            </form>
            <div className="bg-white rounded-lg shadow-md">
              {todos?.map((todo, index) => (
                <div key={todo.id}>
                  <div className={`flex items-center justify-between gap-x-5 p-5 ${todos.length -1 == index ? "" : "border-b"}`}>
                    <p>{todo.todo}</p>
                    <div className="space-x-2">
                      <button
                        onClick={(e) => {
                          setTodoId(todo.id);
                          setTodo(todo.todo);
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(todo.id)}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
