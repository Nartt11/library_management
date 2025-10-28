import React, { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Monitor,
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  Upload,
  Download,
  Gamepad2,
} from "lucide-react";
import { toast } from "sonner";
import { PasswordConfirmation } from "../PasswordConfirmation";

interface Equipment {
  id: string;
  name: string;
  type: "computer" | "board-game";
  category: string;
  status: "available" | "in-use" | "maintenance";
  location: string;
  description: string;
  specifications?: string;
  maxPlayers?: number;
  serialNumber?: string;
  quantity: number;
  availableQuantity: number;
}

interface AdminEquipmentManagementProps {
  onDeleteEquipment?: (equipment: Equipment) => void;
}

export function AdminEquipmentManagement({
  onDeleteEquipment,
}: AdminEquipmentManagementProps) {
  const [equipment, setEquipment] = useState<Equipment[]>([
    {
      id: "comp-1",
      name: "Desktop 1",
      type: "computer",
      category: "Desktop",
      status: "available",
      location: "Computer Lab A, Station 1",
      description: "Desktop computer available for student use.",
      specifications: "Intel i5, 8GB RAM, 256GB SSD",
      serialNumber: "DESK-001",
      quantity: 1,
      availableQuantity: 1,
    },
    {
      id: "comp-2",
      name: "Desktop 2",
      type: "computer",
      category: "Desktop",
      status: "in-use",
      location: "Computer Lab A, Station 2",
      description: "Desktop computer available for student use.",
      specifications: "Intel i5, 8GB RAM, 256GB SSD",
      serialNumber: "DESK-002",
      quantity: 1,
      availableQuantity: 0,
    },
    {
      id: "bg-1",
      name: "Chess",
      type: "board-game",
      category: "Strategy",
      status: "available",
      location: "Recreation Room, Shelf A",
      description: "Classic chess board game.",
      maxPlayers: 2,
      quantity: 1,
      availableQuantity: 1,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(
    null
  );
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: "add" | "edit" | "delete";
    action: () => void;
    title: string;
    description: string;
  } | null>(null);

  const [newEquipment, setNewEquipment] = useState({
    name: "",
    type: "computer" as "computer" | "board-game",
    category: "",
    status: "available" as "available" | "in-use" | "maintenance",
    location: "",
    description: "",
    specifications: "",
    maxPlayers: undefined,
    serialNumber: "",
    quantity: 1,
  });

  const categories = [
    "all",
    ...Array.from(new Set(equipment.map((item) => item.category))),
  ];

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.serialNumber && item.serialNumber.includes(searchTerm));
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    const matchesType = typeFilter === "all" || item.type === typeFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesType;
  });

  const requirePasswordConfirmation = (
    actionType: "add" | "edit" | "delete",
    action: () => void,
    title: string,
    description: string
  ) => {
    setPendingAction({ type: actionType, action, title, description });
    setShowPasswordConfirmation(true);
  };

  const handlePasswordConfirmed = () => {
    if (pendingAction) {
      pendingAction.action();
      setPendingAction(null);
    }
    setShowPasswordConfirmation(false);
  };

  const handlePasswordCancelled = () => {
    setPendingAction(null);
    setShowPasswordConfirmation(false);
  };

  const addEquipment = () => {
    if (!newEquipment.name || !newEquipment.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    requirePasswordConfirmation(
      "add",
      () => {
        const item: Equipment = {
          id: Date.now().toString(),
          ...newEquipment,
          availableQuantity:
            newEquipment.status === "available" ? newEquipment.quantity : 0,
          maxPlayers:
            newEquipment.type === "board-game"
              ? newEquipment.maxPlayers
              : undefined,
          specifications:
            newEquipment.type === "computer"
              ? newEquipment.specifications
              : undefined,
          serialNumber:
            newEquipment.type === "computer"
              ? newEquipment.serialNumber
              : undefined,
        };

        setEquipment([...equipment, item]);
        setNewEquipment({
          name: "",
          type: "computer",
          category: "",
          status: "available",
          location: "",
          description: "",
          specifications: "",
          maxPlayers: undefined,
          serialNumber: "",
          quantity: 1,
        });
        setIsAddDialogOpen(false);
        toast.success("Equipment added successfully!");
      },
      "Add New Equipment",
      `You are about to add "${newEquipment.name}" to the equipment inventory. This will make it available for use by students and staff.`
    );
  };

  const editEquipment = (item: Equipment) => {
    setEditingEquipment(item);
    // setNewEquipment({
    //   name: item.name,
    //   type: item.type,
    //   category: item.category,
    //   status: item.status,
    //   location: item.location,
    //   description: item.description,
    //   specifications: item.specifications || "",
    //   maxPlayers: item.maxPlayers,
    //   serialNumber: item.serialNumber || "",
    //   quantity: item.quantity,
    // });
    setIsEditDialogOpen(true);
  };

  const updateEquipment = () => {
    if (!editingEquipment || !newEquipment.name || !newEquipment.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    requirePasswordConfirmation(
      "edit",
      () => {
        const updatedEquipment: Equipment = {
          ...editingEquipment,
          ...newEquipment,
          availableQuantity:
            newEquipment.status === "available"
              ? newEquipment.quantity
              : newEquipment.status === "in-use"
              ? editingEquipment.availableQuantity +
                (newEquipment.quantity - editingEquipment.quantity)
              : 0,
          maxPlayers:
            newEquipment.type === "board-game"
              ? newEquipment.maxPlayers
              : undefined,
          specifications:
            newEquipment.type === "computer"
              ? newEquipment.specifications
              : undefined,
          serialNumber:
            newEquipment.type === "computer"
              ? newEquipment.serialNumber
              : undefined,
        };

        setEquipment(
          equipment.map((item) =>
            item.id === editingEquipment.id ? updatedEquipment : item
          )
        );
        setEditingEquipment(null);
        setNewEquipment({
          name: "",
          type: "computer",
          category: "",
          status: "available",
          location: "",
          description: "",
          specifications: "",
          maxPlayers: undefined,
          serialNumber: "",
          quantity: 1,
        });
        setIsEditDialogOpen(false);
        toast.success("Equipment updated successfully!");
      },
      "Update Equipment",
      `You are about to update "${editingEquipment.name}". This will modify the equipment information in the inventory.`
    );
  };

  const deleteEquipment = (equipmentId: string, equipmentName: string) => {
    requirePasswordConfirmation(
      "delete",
      () => {
        const equipmentToDelete = equipment.find(
          (item) => item.id === equipmentId
        );
        if (equipmentToDelete && onDeleteEquipment) {
          onDeleteEquipment(equipmentToDelete);
        }
        setEquipment(equipment.filter((item) => item.id !== equipmentId));
        toast.success(`"${equipmentName}" moved to backup!`);
      },
      "Delete Equipment",
      `You are about to permanently delete "${equipmentName}" from the equipment inventory. This action cannot be undone.`
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "default";
      case "in-use":
        return "secondary";
      case "maintenance":
        return "destructive";
      default:
        return "default";
    }
  };

  const getTypeIcon = (type: string) => {
    return type === "computer" ? Monitor : Gamepad2;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-2 flex items-center gap-2">
            <Monitor className="h-6 w-6" />
            Admin Equipment Management
          </h1>
          <p className="text-muted-foreground">
            Manage computers and board games with advanced admin features.
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Equipment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Equipment</DialogTitle>
              <DialogDescription>
                Add new equipment to the library inventory.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newEquipment.name}
                  onChange={(e) =>
                    setNewEquipment({ ...newEquipment, name: e.target.value })
                  }
                  placeholder="Equipment name"
                />
              </div>
              <div>
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={newEquipment.type}
                  onValueChange={(value: "computer" | "board-game") =>
                    setNewEquipment({ ...newEquipment, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="computer">Computer</SelectItem>
                    <SelectItem value="board-game">Board Game</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={newEquipment.category}
                  onChange={(e) =>
                    setNewEquipment({
                      ...newEquipment,
                      category: e.target.value,
                    })
                  }
                  placeholder="e.g., Desktop, Strategy"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newEquipment.description}
                  onChange={(e) =>
                    setNewEquipment({
                      ...newEquipment,
                      description: e.target.value,
                    })
                  }
                  placeholder="Equipment description"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={addEquipment} className="flex-1">
                  Add Equipment
                </Button>
                <Button
                  onClick={() => setIsAddDialogOpen(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Equipment Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="p-4 text-sm">Equipment Details</th>
                  <th className="p-4 text-sm">Type & Category</th>
                  <th className="p-4 text-sm">Status</th>
                  <th className="p-4 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEquipment.map((item) => {
                  const TypeIcon = getTypeIcon(item.type);
                  return (
                    <tr key={item.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div className="flex items-start gap-2">
                          <TypeIcon className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                          <div>
                            <p className="line-clamp-1">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="capitalize">
                            {item.type.replace("-", " ")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.category}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={getStatusColor(item.status)}>
                          {item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => editEquipment(item)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Equipment
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{item.name}"?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    deleteEquipment(item.id, item.name)
                                  }
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Equipment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Equipment</DialogTitle>
            <DialogDescription>Update equipment information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={newEquipment.name}
                onChange={(e) =>
                  setNewEquipment({ ...newEquipment, name: e.target.value })
                }
                placeholder="Equipment name"
              />
            </div>
            <div>
              <Label htmlFor="edit-type">Type *</Label>
              <Select
                value={newEquipment.type}
                onValueChange={(value: "computer" | "board-game") =>
                  setNewEquipment({ ...newEquipment, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="computer">Computer</SelectItem>
                  <SelectItem value="board-game">Board Game</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-category">Category *</Label>
              <Input
                id="edit-category"
                value={newEquipment.category}
                onChange={(e) =>
                  setNewEquipment({ ...newEquipment, category: e.target.value })
                }
                placeholder="e.g., Desktop, Strategy"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={newEquipment.description}
                onChange={(e) =>
                  setNewEquipment({
                    ...newEquipment,
                    description: e.target.value,
                  })
                }
                placeholder="Equipment description"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={updateEquipment} className="flex-1">
                Update Equipment
              </Button>
              <Button
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingEquipment(null);
                  setNewEquipment({
                    name: "",
                    type: "computer",
                    category: "",
                    status: "available",
                    location: "",
                    description: "",
                    specifications: "",
                    maxPlayers: undefined,
                    serialNumber: "",
                    quantity: 1,
                  });
                }}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Password Confirmation Dialog */}
      <PasswordConfirmation
        isOpen={showPasswordConfirmation}
        onClose={handlePasswordCancelled}
        onConfirm={handlePasswordConfirmed}
        title={pendingAction?.title || ""}
        description={pendingAction?.description || ""}
        actionName="Confirm Changes"
        userRole="admin"
      />
    </div>
  );
}
