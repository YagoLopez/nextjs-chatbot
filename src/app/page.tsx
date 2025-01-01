"use client";

import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompletion } from "ai/react";
import { Loader2 } from "lucide-react";
const INITIAL_URL = "https://lilianweng.github.io/posts/2023-06-23-agent/";

export default function TwoBlockPage() {
  const [url, setUrl] = useState(INITIAL_URL);

  const {
    completion: responseFromAI,
    input: userInput,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useCompletion({
    api: `/api/test5?url=${url}`,
    onError: (err) => console.error("llm model error:", err),
  });

  const onChangeUrl = (e: ChangeEvent<HTMLInputElement>) =>
    setUrl(e.target.value);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 flex flex-col">
      <Card className="flex-grow w-full max-w-6xl mx-auto my-4 sm:my-6 md:my-8 flex flex-col shadow-xl">
        <CardTitle className="text-2xl font-bold text-center mt-5">
          Chat with a web page. By Yago López
        </CardTitle>
        <CardContent className="p-4 sm:p-6 flex-grow flex flex-col">
          <div className="flex-grow flex flex-col lg:flex-row gap-6">
            {/* Left Block */}
            <div className="w-full lg:w-1/2 flex flex-col">
              <label htmlFor="url1" className="text-sm font-medium">
                ℹ️ Enter the web page url to get information
              </label>
              <Input
                id="url1"
                className="my-4"
                type="text"
                placeholder="Enter url to get information"
                value={url}
                onChange={onChangeUrl}
              />
              <div className="flex-grow w-full border border-blue-300 rounded overflow-hidden">
                {url && (
                  <iframe
                    src={url}
                    className="w-full h-full"
                    title="Left Block iframe"
                  />
                )}
              </div>
            </div>

            {/* Right Block */}
            <div className="w-full lg:w-1/2 flex flex-col">
              <form onSubmit={handleSubmit} className="mb-4 space-y-2">
                <label htmlFor="question">
                  ➡️ Ask a question about the above web page
                </label>
                <Input
                  id="question"
                  type="text"
                  placeholder="For example: Make a summary of the provided web page"
                  value={userInput}
                  onChange={handleInputChange}
                />
                {isLoading ? (
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    <Loader2 className="animate-spin" /> Analyzing Remote
                    Data...
                  </Button>
                ) : (
                  <Button type="submit" className="w-full">
                    Submit
                  </Button>
                )}
              </form>
              <Card className="flex-grow overflow-auto border border-blue-200">
                <CardContent className="my-8">
                  <p>{responseFromAI}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
