"use client";

import { ChangeEvent, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCompletion } from "ai/react";

const defaultUrl = "https://lilianweng.github.io/posts/2023-06-23-agent/";

export default function RagForm() {
  const [url, setUrl] = useState(defaultUrl);

  const { completion, input, handleInputChange, handleSubmit, isLoading } =
    useCompletion({
      api: `/api/test5?url=${url}`,
      // onResponse: (response) => response.text(),
      onError: (err) => console.error("mi error --->", err),
    });

  const onChangeUrl = (e: ChangeEvent<HTMLInputElement>) =>
    setUrl(e.target.value);

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle>RAG Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="url1" className="text-sm font-medium">
                URL 1
              </label>
              <Input
                id="url1"
                type="text"
                placeholder="Enter url to get information"
                value={url}
                onChange={onChangeUrl}
              />
            </div>

            <div className="aspect-video w-full bg-gray-100 rounded-md flex items-center justify-center">
              {url ? (
                <iframe
                  src={url}
                  className="w-full h-full border-2 border-gray-300 rounded-md"
                  title="Content Preview"
                />
              ) : (
                <p className="text-gray-500">
                  Enter a URL and submit to see content preview
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="question"
                className={
                  isLoading
                    ? "text-red-700 animate-pulse h-32"
                    : "text-sm font-medium"
                }
              >
                {isLoading
                  ? "Fetching and Analyzing Remote Data..."
                  : "ℹ️ Ask a question about the above web page"}
              </label>
              <Input
                id="question"
                type="text"
                placeholder="Type here your question..."
                value={input}
                onChange={handleInputChange}
              />
            </div>
            <Button type="submit" className="w-full" onClick={handleSubmit}>
              Submit
            </Button>
            <section>{completion}</section>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
