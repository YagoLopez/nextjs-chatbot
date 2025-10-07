"use client";

import { ChangeEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useCompletion } from "@ai-sdk/react";
import { Loader2, Github } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Markdown from "react-markdown";
import Link from "next/link";
import { URLS } from "@/lib/utils";

const getSelectedUrl = (url1: string, url2: string) => (url1 ? url1 : url2);

export default function TwoBlockPage() {
  const [url1, setUrl1] = useState("");
  const [url2, setUrl2] = useState(URLS[0]);
  const responseElRef = useRef<HTMLParagraphElement | null>(null);

  const {
    completion: responseFromAI,
    input: userInput,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useCompletion({
    api: `/api/rag2?url=${getSelectedUrl(url1, url2)}`,
    onError: (err) => alert("Response error:" + err),
  });

  const onInputUrlChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUrl1(e.target.value);

  const onSelectUrlChange = (value: string) => {
    setUrl1("");
    setUrl2(value);
    if (responseElRef.current !== null) {
      responseElRef.current.innerHTML = "";
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 flex flex-col bg-gradient-to-tl from-lime-200 via-sky-500 to-violet-500">
      <Card className="flex-grow w-full max-w-6xl mx-auto my-4 sm:my-6 md:my-8 flex flex-col shadow-xl">
        <CardTitle className="text-2xl font-bold mt-7 flex justify-center">
          <Image
            width="40"
            height="10"
            src="/chat-logo.png"
            alt="logo"
            className="mx-2 min-w-[100px] sm:min-w-[50px] border-2 border-gray-300 rounded-xl p-[10px] shadow-gray-300 shadow-lg animate-pulse"
          />
          <div className="flex items-center">
            Chat with a web page. By Yago López
          </div>
        </CardTitle>
        <CardContent className="p-4 sm:p-6 flex-grow flex flex-col">
          <div className="flex-grow flex flex-col lg:flex-row gap-6">
            {/* Left Block */}
            <div className="w-full lg:w-1/2 flex flex-col">
              <label htmlFor="url1" className="text-blue-900 font-bold">
                ️1️⃣ Enter or select the url to fetch the information
              </label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Input
                      id="url1"
                      className="my-2 hover:cursor-help"
                      type="text"
                      placeholder="Type an url..."
                      value={url1}
                      onChange={onInputUrlChange}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Warning: some websites prevent iframe embedding</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
                  2️⃣ Ask a question about the web page (English or Spanish)
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
                <CardContent className="p-4">
                  <Markdown className="min-h-[290px] text-[14px] font-mono border-0">
                    {responseFromAI}
                  </Markdown>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
      <Link
        href="/lighthouse.html"
        target="_blank"
        className="flex items-center justify-center text-[16px] hover:text-cyan-950 text-bold text-white"
        title="See the performance audit of this page"
      >
        📊 Performance Audit
      </Link>
      <a
        href="https://github.com/YagoLopez/nextjs-chatbot"
        className="flex items-center justify-center text-[14px] hover:text-cyan-950 text-bold text-white"
        target="_blank"
      >
        <Github className="w-6 p-[3px] m-1" />
        <div>View project on GitHub</div>
      </a>
    </div>
  );
}
