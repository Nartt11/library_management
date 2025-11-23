"use client";
import CreatePublisher from "@/components/librarian/publisher/CreatePublisher";
import TablePublishers from "@/components/librarian/publisher/TablePublishers";
import { Input } from "@/components/ui/input";
import { Building2, Search } from "lucide-react";
import React, { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  createPublisher,
  deletePublisher,
  getAllPublishers,
  updatePublisher,
} from "@/services/publisher";

export default function PublisherManagement() {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // ---- FETCH DATA ----
  const fetchData = async () => {
    try {
      const data = await getAllPublishers(pageNumber, pageSize);
      console.log("Publishers:", data);

      setPublishers(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching publishers:", error);
    }
  };

  // Chỉ chạy khi pageNumber, pageSize đổi
  useEffect(() => {
    fetchData();
  }, [pageNumber, pageSize]);

  // ---- ADD ----
  const handleAddPublisher = async (publisher: Publisher) => {
    const payload = {
      name: publisher.name,
      phoneNumber: publisher.phoneNumber,
      address: publisher.address,
    };

    await createPublisher(payload);
    fetchData(); // refresh sau khi tạo
  };

  // ---- UPDATE ----
  const handleEditPublisher = async (publisher: Publisher) => {
    const payload = {
      name: publisher.name,
      phoneNumber: publisher.phoneNumber,
      address: publisher.address,
    };

    await updatePublisher(publisher.id, payload);
    fetchData(); // refresh sau khi update
  };

  // ---- DELETE ----
  const handleDeletePublisher = async (publisher: Publisher) => {
    await deletePublisher(publisher.id!);
    fetchData(); // refresh sau khi delete
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Publisher Management</h1>
          <p className="text-muted-foreground">
            Manage publisher information and details
          </p>
        </div>

        <CreatePublisher handleAddPublisher={handleAddPublisher} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Publishers
          </CardTitle>
          <CardDescription>
            Browse and manage all publishers in the system
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search publishers by name, email, or ID..."
                  className="pl-10"
                />
              </div>
            </div>

            <div className="rounded-md border">
              <TablePublishers
                publishers={publishers}
                handleEditPublisher={handleEditPublisher}
                handleDeletePublisher={handleDeletePublisher}
              />
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div>
                Showing {publishers.length} of {totalPages * pageSize}{" "}
                publisher(s)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
