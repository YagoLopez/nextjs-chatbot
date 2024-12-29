"use client";

import { useCompletion } from "ai/react";

export default function Chat() {
  const { completion, input, handleInputChange, handleSubmit, isLoading } =
    useCompletion({
      api: "/api/test5",
      // onResponse: (response) => response.text(),
      onError: (err) => console.error("mi error --->", err),
    });

  return (
    <div className="m-5">
      <h1>Chat with a web page</h1>
      <p>
        Ask a question about this url:
        https://lilianweng.github.io/posts/2023-06-23-agent/
      </p>
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} className="my-2" />
      </form>
      <div>{isLoading && "Fetching information..."}</div>
      <div>{completion}</div>
    </div>
  );
}
