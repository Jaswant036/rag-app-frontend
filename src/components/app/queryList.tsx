"use client";

import { QueryModel } from "@/api-client";
import createApiClient from "@/lib/getApiClient";
import { useEffect, useState } from "react";
import QueryListItem from "./queryListItem";
import { getSessionId } from "@/lib/getUserId";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function QueryList() {
  const api = createApiClient();
  const userId = getSessionId();

  const [isLoading, setIsLoading] = useState(true);
  const [queryItems, setQueryItems] = useState<QueryModel[]>([]);
  

  // Create a hook to call the API.
  useEffect(() => {
  const fetchData = async () => {
    try {
      setIsLoading(true);

      // The request object must match ListQueryEndpointListQueryGetRequest type
      const request = {
        userId: userId, // `userId` must match the generated OpenAPI parameter name
      };

      // Call the generated API method
      const response = await api.listQueryEndpointListQueryGet(request);

      console.log("Fetched Data:", response);

      // Update state with the fetched data
      setQueryItems(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch only when userId exists
  if (userId) {
    fetchData();
  }
}, [userId]);


  let queryElements;
  if (isLoading) {
    queryElements = (
      <div className="space-y-2">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    );
  } else {
    queryElements = queryItems.map((queryItem) => {
      return <QueryListItem key={queryItem.queryId} {...queryItem} />;
    });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recent Queries</CardTitle>
        <CardDescription>
          Here are queries you've recently submitted.
        </CardDescription>
      </CardHeader>
      <CardContent>{queryElements}</CardContent>
    </Card>
  );
}
