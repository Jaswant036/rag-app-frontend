"use client";

import { QueryModel } from "@/api-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import createApiClient from "@/lib/getApiClient";
import { ArrowLeft, Link2, Loader } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ViewQueryPage() {
  const searchParams = useSearchParams();
  const queryId = searchParams.get("query_id");
  const api = createApiClient();
  const [queryItem, setQueryItem] = useState<QueryModel>();

  // Create a hook to call the API.
  useEffect(() => {
  if (!queryId) return;

  let interval: NodeJS.Timeout;

  const fetchData = async () => {
    try {
      const response = await api.getQueryEndpointGetQueryGet({ queryId });
      setQueryItem(response);

      // Stop polling when the query is complete
      if (response.isComplete) {
        clearInterval(interval);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // 1️⃣ fetch immediately
  fetchData();

  // 2️⃣ start polling every 3 seconds
  interval = setInterval(fetchData, 3000);

  // 3️⃣ cleanup when component unmounts
  return () => clearInterval(interval);
}, [queryId]);

  let viewQueryElement;

  if (!queryItem) {
    viewQueryElement = (
      <div>
        <div className="space-y-2">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  } else {
    if (!queryItem.sources) {
      queryItem.sources = [];
    }

    const isComplete = queryItem.isComplete;
    const answerElement = isComplete ? (
      <>
        <div className="font-bold">Response</div>
        {queryItem?.answerText}
      </>
    ) : (
      <div className="flex flex-col items-center justify-center py-6 text-slate-500">
          <Loader className="h-10 w-10 animate-spin mb-2" />
          <span>Fetching your answer...</span>
      </div>
    );

    queryItem.answerText || "Query still in progress. Please wait...";

    // Displayed Element.
    viewQueryElement = (
      <>
        <div className="bg-blue-100 text-blue-800 p-3 rounded-sm">
          <div className="font-bold">Question</div>
          {queryItem?.queryText}
        </div>
        <div className="bg-slate-100 text-slate-700  p-3 rounded-sm">
          {answerElement}
        </div>
      </>
    );
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>View Query</CardTitle>
          <CardDescription>Query ID: {queryId}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {viewQueryElement}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/">
            <Button variant="outline">
              {" "}
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </>
  );
}
