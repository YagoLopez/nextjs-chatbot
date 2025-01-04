"use client";

import { useCompletion } from "ai/react";
import { ChangeEvent, useState } from "react";

const defaultUrl = "https://lilianweng.github.io/posts/2023-06-23-agent/";

export default function Chat() {
  const [url, setUrl] = useState(defaultUrl);

  const { completion, input, handleInputChange, handleSubmit, isLoading } =
    useCompletion({
      api: `/api/rag?url=${url}`,
      // onResponse: (response) => response.text(),
      onError: (err) => console.error("mi error --->", err),
    });

  const onChangeUrl = (e: ChangeEvent<HTMLInputElement>) =>
    setUrl(e.target.value);

  return (
    <div className="m-5">
      <h1>Chat with a web page</h1>
      <div>
        Ask a question about this url:
        <input
          value={url}
          onChange={onChangeUrl}
          className="my-2 w-[600px] mx-2"
        />
      </div>
      <form onSubmit={handleSubmit} className="flex">
        <div>
          <input
            placeholder="Type here your question..."
            value={input}
            onChange={handleInputChange}
            className="my-2 w-[814px]"
          />
        </div>
        <div
          style={{ alignContent: "center" }}
          className="mx-2 text-red-600 animate-pulse"
        >
          {isLoading && "Fetching information..."}
        </div>
      </form>
      <section className="flex">
        <div>
          <iframe src={url} className="w-[600px] h-[600px]" />
        </div>
        <div className="m-10">{completion}</div>
      </section>
    </div>
  );
}
