import React from "react";
import DialogDelete from "../DialogDelete";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import EditPublisher from "./EditPublisher";

export default function TablePublishers({
  publishers,
  handleEditPublisher,
  handleDeletePublisher,
}: {
  publishers: Publisher[];
  handleEditPublisher: (publisher: Publisher) => void;
  handleDeletePublisher: (publisher: Publisher) => void;
}) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b bg-muted/50">
          <th className="p-3 text-left">Publisher ID</th>
          <th className="p-3 text-left">Publisher Name</th>
          <th className="p-3 text-left">Phone</th>
          <th className="p-3 text-left">Address</th>
          <th className="p-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {publishers.length === 0 ? (
          <tr>
            <td colSpan={6} className="p-8 text-center text-muted-foreground">
              No publishers found
            </td>
          </tr>
        ) : (
          publishers.map((publisher) => (
            <tr key={publisher.id} className="border-b hover:bg-muted/50">
              <td className="p-3">{publisher.id}</td>
              <td className="p-3">{publisher.name}</td>
              <td className="p-3">{publisher.phoneNumber}</td>
              <td className="p-3">{publisher.address}</td>
              <td className="p-3">
                <div className="flex justify-end gap-2">
                  <EditPublisher
                    editingPublisher={publisher}
                    handleEditPublisher={handleEditPublisher}
                  />
                  <DialogDelete
                    title="Delete Publisher"
                    description={`This will delete publisher "${publisher.name}". This action cannot be undone.`}
                    onConfirm={() => handleDeletePublisher(publisher)}
                  />
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
