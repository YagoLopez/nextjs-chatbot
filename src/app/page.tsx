"use client";

import { ChangeEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useCompletion } from "ai/react";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

const URLS = [
  "https://lilianweng.github.io/posts/2023-06-23-agent/",
  "https://blog.openreplay.com/top-four-ai-powered-ui-frameworks-for-2024/?ref=dailydev",
  "https://angularexperts.io/blog/advanced-typescript?ref=dailydev",
];

const getSelectedUrl = (url1: string, url2: string) => (url1 ? url1 : url2);

export default function TwoBlockPage() {
  const [url1, setUrl1] = useState("");
  const [url2, setUrl2] = useState(URLS[0]);
  const aiResponseRef = useRef<HTMLParagraphElement | null>(null);

  const {
    completion: responseFromAI,
    input: userInput,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useCompletion({
    api: `/api/rag?url=${getSelectedUrl(url1, url2)}`,
    onError: (err) => console.error("llm model error:", err),
  });

  const onInputUrlChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUrl1(e.target.value);

  const onSelectUrlChange = (value: string) => {
    setUrl1("");
    setUrl2(value);
    if (aiResponseRef.current !== null) {
      aiResponseRef.current.innerHTML = "";
    }
  };

  // noinspection TypeScriptValidateTypes
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 flex flex-col">
      <Card className="flex-grow w-full max-w-6xl mx-auto my-4 sm:my-6 md:my-8 flex flex-col shadow-xl">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-700 via-blue-500 to-green-400 text-transparent bg-clip-text animate-gradient mt-7 flex justify-center">
          <Image
            width="40"
            height="10"
            src="/chat-logo.png"
            alt="logo"
            className="mx-2"
          />
          Chat with a web page. By Yago López
        </CardTitle>
        <CardContent className="p-4 sm:p-6 flex-grow flex flex-col">
          <div className="flex-grow flex flex-col lg:flex-row gap-6">
            {/* Left Block */}
            <div className="w-full lg:w-1/2 flex flex-col">
              <label htmlFor="url1" className="text-blue-900 font-bold">
                ️➡️ Enter or select the url to fetch the information
              </label>
              <Input
                id="url1"
                className="my-2"
                type="text"
                placeholder="Type an url..."
                value={url1}
                onChange={onInputUrlChange}
              />
              <Select onValueChange={onSelectUrlChange}>
                <SelectTrigger className="mb-2">
                  <SelectValue placeholder={URLS[0]} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {URLS.map((url) => (
                      <SelectItem key={url} value={url}>
                        {url}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <div className="flex-grow w-full border border-blue-300 rounded overflow-hidden">
                <iframe
                  src={getSelectedUrl(url1, url2)}
                  className="w-full h-full"
                  title="Left Block iframe"
                />
              </div>
            </div>

            {/* Right Block */}
            <div className="w-full lg:w-1/2 flex flex-col">
              <form onSubmit={handleSubmit} className="mb-4 space-y-2">
                <label htmlFor="question" className="text-blue-900 font-bold">
                  ➡️ Ask a question about the web page
                </label>
                <Input
                  id="question"
                  type="text"
                  placeholder="For example: Make a summary of the text"
                  value={userInput}
                  onChange={handleInputChange}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" /> Processing Data...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </form>
              <Card className="flex-grow overflow-auto border border-blue-200">
                <CardContent className="mt-7">
                  <p ref={aiResponseRef}>{responseFromAI}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
