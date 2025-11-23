"use client";
import DialogAddNewItem from "@/components/librarian/author/CreateAuthor";
import TableAuthors from "@/components/librarian/author/TableAuthors";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  createAuthor,
  deleteAuthor,
  getAllAuthors,
  updateAuthor,
} from "@/services/author";
import { Author } from "@/types/author";
import { Search, UserPen } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function AuthorManagement() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllAuthors(pageNumber, pageSize);
        console.log(data);
        setAuthors(data.data || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching authors:", error);
      }
    };
    fetchData();
  }, [authors, pageNumber, pageSize]);

  const handleAddAuthor = async (author: Author) => {
    const payload = {
      name: author.name,
      yearOfBirth: author.yearOfBirth,
      briefDescription: author.briefDescription,
    };

    const res = await createAuthor(payload);
    console.log("run");
  };
  const handleEditAuthor = async (author: Author) => {
    const payload = {
      name: author.name,
      yearOfBirth: author.yearOfBirth,
      briefDescription: author.briefDescription,
    };

    const res = await updateAuthor(author.id, payload);
    console.log("run");
  };
  const handleDeleteAuthor = async (author: Author) => {
    // Implement delete logic here
    console.log("Delete author:", author);
    await deleteAuthor(author.id!);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Author Management</h1>
          <p className="text-muted-foreground">
            Manage author information and details
          </p>
        </div>
        <DialogAddNewItem handleAddAuthor={handleAddAuthor} />
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPen className="h-5 w-5" />
              Authors
            </CardTitle>
            <CardDescription>
              Browse and manage all authors in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search authors by name, email, or ID..."
                    // value={searchTerm}
                    // onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <TableAuthors
                authors={authors}
                handleEditAuthor={handleEditAuthor}
                handleDeleteAuthor={handleDeleteAuthor}
              />

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div>
                  Showing {totalPages} of {authors.length} author(s)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// "use client";
// import React, { useEffect, useState } from "react";
// import { UserPen, Search, Plus, Edit, Trash2, Table } from "lucide-react";
// import { toast } from "sonner";
// import { Author } from "@/types/author";
// import { AddAuthor, getAuthors } from "@/services/author";
// import { User } from "@/types/user";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Label } from "recharts";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import DialogAddNewItem from "@/components/librarian/DialogAddNewItem";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import TableAuthors from "@/components/librarian/TableAuthors";
// import { log } from "console";

// // interface Author {
// //   id: string;
// //   name: string;
// //   email: string;
// //   phone: string;
// //   address: string;
// // }

// interface AuthorManagementProps {
//   currentUser: User;
// }

// export default function AuthorManagement({
//   currentUser,
// }: AuthorManagementProps) {
//   // const [authors, setAuthors] = useState<Author[]>([
//   //   {
//   //     id: "AUTH-001",
//   //     name: "John Smith",
//   //     email: "john.smith@publisher.com",
//   //     phone: "+1 (555) 123-4567",
//   //     address: "123 Writer St, New York, NY 10001",
//   //   },
//   //   {
//   //     id: "AUTH-002",
//   //     name: "Jane Doe",
//   //     email: "jane.doe@authors.com",
//   //     phone: "+1 (555) 234-5678",
//   //     address: "456 Book Ave, Boston, MA 02101",
//   //   },
//   //   {
//   //     id: "AUTH-003",
//   //     name: "Robert Johnson",
//   //     email: "r.johnson@writing.org",
//   //     phone: "+1 (555) 345-6789",
//   //     address: "789 Literary Ln, Chicago, IL 60601",
//   //   },
//   //   {
//   //     id: "AUTH-004",
//   //     name: "Dr. Emily Chen",
//   //     email: "emily.chen@academic.edu",
//   //     phone: "+1 (555) 456-7890",
//   //     address: "321 Scholar Rd, San Francisco, CA 94101",
//   //   },
//   // ]);

//   const [authors, setAuthors] = useState<Author[]>([]);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [pageSize] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const data = await getAuthors(pageNumber, pageSize);
//       console.log(data);
//       setAuthors(data.data || []);
//       setTotalPages(data.totalPages || 1);
//     } catch (error) {
//       console.error("Error fetching authors:", error);
//     }
//   };
//   fetchData();
// }, [pageNumber, pageSize]);

//   console.log("Authors:", authors);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
//   const [deletingAuthor, setDeletingAuthor] = useState<Author | null>(null);
//   const [showPasswordConfirmation, setShowPasswordConfirmation] =
//     useState(false);
//   const [pendingAction, setPendingAction] = useState<{
//     type: "add" | "edit" | "delete";
//     action: () => void;
//     title: string;
//   } | null>(null);

// const [formData, setFormData] = useState({
//   name: "",
//   yearOfBirth: 2005,
//   briefDescription: "",
// });

// const resetForm = () => {
//   setFormData({
//     name: "",
//     yearOfBirth: 2005,
//     briefDescription: "",
//   });
// };

//   const handleAddAuthor = async () => {
//     // const action = () => {
//     //   const newAuthor: Author = {
//     //     id: `AUTH-${String(authors.length + 1).padStart(3, "0")}`,
//     //     ...formData,
//     //   };
//     //   setAuthors([...authors, newAuthor]);
//     //   setIsAddDialogOpen(false);
//     //   resetForm();
//     //   toast.success("Author added successfully");
//     // };

//     const res = await AddAuthor(formData);

//     if (res.success) {
//       alert("Added author successfully");
//       // onSuccess(); // refresh table
//       // onClose();
//     } else {
//       alert("Failed: " + res.message);
//     }
//   };

//   //   setPendingAction({
//   //     type: "add",
//   //     action,
//   //     title: "Add New Author",
//   //   });
//   //   setShowPasswordConfirmation(true);
//   // };

//   // const handleEditAuthor = (author: Author) => {
//   //   setEditingAuthor(author);
//   //   setFormData({
//   //     name: author.name,
//   //     email: author.email,
//   //     phone: author.phone,
//   //     address: author.address,
//   //   });
//   //   setIsEditDialogOpen(true);
//   // };

//   // const handleUpdateAuthor = () => {
//   //   if (!editingAuthor) return;

//   //   const action = () => {
//   //     setAuthors(
//   //       authors.map((a) =>
//   //         a.id === editingAuthor.id ? { ...a, ...formData } : a
//   //       )
//   //     );
//   //     setIsEditDialogOpen(false);
//   //     setEditingAuthor(null);
//   //     resetForm();
//   //     toast.success("Author updated successfully");
//   //   };

//   //   setPendingAction({
//   //     type: "edit",
//   //     action,
//   //     title: "Update Author",
//   //   });
//   //   setShowPasswordConfirmation(true);
//   // };

//   const handleDeleteAuthor = (author: Author) => {
//     const action = () => {
//       setAuthors(authors.filter((a) => a.id !== author.id));
//       setDeletingAuthor(null);
//       toast.success("Author deleted successfully");
//     };

//     setPendingAction({
//       type: "delete",
//       action,
//       title: "Delete Author",
//     });
//     setShowPasswordConfirmation(true);
//     setDeletingAuthor(author);
//   };

//   const handlePasswordSuccess = () => {
//     if (pendingAction) {
//       pendingAction.action();
//       setPendingAction(null);
//     }
//     setShowPasswordConfirmation(false);
//   };

//   const handlePasswordCancel = () => {
//     setShowPasswordConfirmation(false);
//     setPendingAction(null);
//     setDeletingAuthor(null);
//   };

//   const filteredAuthors = authors.filter(
//     (author) => author.name.toLowerCase().includes(searchTerm.toLowerCase())
//     //  ||
//     // author.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     // author.id.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <>
//       <div className="p-6 space-y-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="mb-2">Author Management</h1>
//             <p className="text-muted-foreground">
//               Manage author information and details
//             </p>
//           </div>
//           <DialogAddNewItem
//             formData={formData}
//             setFormData={setFormData}
//             resetForm={resetForm}
//             handleAddAuthor={handleAddAuthor}
//           />
//         </div>

// <div>
//   <Card>
//     <CardHeader>
//       <CardTitle className="flex items-center gap-2">
//         <UserPen className="h-5 w-5" />
//         Authors
//       </CardTitle>
//       <CardDescription>
//         Browse and manage all authors in the system
//       </CardDescription>
//     </CardHeader>
//     <CardContent>
//       <div className="space-y-4">
//         <div className="flex items-center gap-4">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//             <Input
//               placeholder="Search authors by name, email, or ID..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10"
//             />
//           </div>
//         </div>
//         <TableAuthors authors={authors} />

//         <div className="flex items-center justify-between text-sm text-muted-foreground">
//           <div>
//             Showing {filteredAuthors.length} of {authors.length}{" "}
//             author(s)
//           </div>
//         </div>
//       </div>
//     </CardContent>
//   </Card>
// </div>
//       </div>
//     </>
//   );
// }
