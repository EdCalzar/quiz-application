import { useState } from "react";

export default function OnSubmit() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const blog = { title, body, author };
    console.log(blog);
  };

  return (
    <div className="p-4">
      <h2 className="mb-2">Add a New Blog</h2>
      <form onSubmit={handleSubmit}>
        <label>Blog Title:</label>
        <br />
        <input
          required
          className="border mb-2"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <label>Blog Body:</label>
        <br />
        <textarea
          required
          className="border"
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <br />
        <label>Blog Author:</label>
        <br />
        <select
          className="border mb-4"
          onChange={(e) => setAuthor(e.target.value)}
        >
          <option value="">Select author</option>
          <option value="John">John</option>
          <option value="Doe">Doe</option>
        </select>
        <br />
        <button className="border p-1">Add Blog</button>
      </form>
    </div>
  );
}
