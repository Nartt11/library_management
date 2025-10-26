import React, { useState } from "react";
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
import { Search, ShoppingCart, Filter, Monitor, Gamepad2 } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { toast } from "sonner";

interface Equipment {
  id: string;
  name: string;
  type: "computer" | "board-game";
  category: string;
  status: "available" | "borrowed" | "maintenance";
  location: string;
  description: string;
  specifications?: string;
  maxPlayers?: number;
  serialNumber?: string;
  image: string;
}

interface EquipmentCatalogProps {
  cartItems: string[];
  onAddToCart: (items: string[]) => void;
}

export function EquipmentCatalog({
  cartItems,
  onAddToCart,
}: EquipmentCatalogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const equipment: Equipment[] = [
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
      image:
        "https://images.unsplash.com/photo-1593486544625-13ef2368e43a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMGRlc2t0b3AlMjB3b3Jrc3RhdGlvbnxlbnwxfHx8fDE3NTY4NjIxMDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "comp-2",
      name: "Desktop 2",
      type: "computer",
      category: "Desktop",
      status: "available",
      location: "Computer Lab A, Station 2",
      description: "Desktop computer available for student use.",
      specifications: "Intel i5, 8GB RAM, 256GB SSD",
      serialNumber: "DESK-002",
      image:
        "https://images.unsplash.com/photo-1593486544625-13ef2368e43a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMGRlc2t0b3AlMjB3b3Jrc3RhdGlvbnxlbnwxfHx8fDE3NTY4NjIxMDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "comp-3",
      name: "Desktop 3",
      type: "computer",
      category: "Desktop",
      status: "available",
      location: "Computer Lab A, Station 3",
      description: "Desktop computer available for student use.",
      specifications: "Intel i5, 8GB RAM, 256GB SSD",
      serialNumber: "DESK-003",
      image:
        "https://images.unsplash.com/photo-1593486544625-13ef2368e43a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMGRlc2t0b3AlMjB3b3Jrc3RhdGlvbnxlbnwxfHx8fDE3NTY4NjIxMDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "comp-4",
      name: "Desktop 4",
      type: "computer",
      category: "Desktop",
      status: "borrowed",
      location: "Computer Lab A, Station 4",
      description: "Desktop computer available for student use.",
      specifications: "Intel i5, 8GB RAM, 256GB SSD",
      serialNumber: "DESK-004",
      image:
        "https://images.unsplash.com/photo-1593486544625-13ef2368e43a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMGRlc2t0b3AlMjB3b3Jrc3RhdGlvbnxlbnwxfHx8fDE3NTY4NjIxMDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "comp-5",
      name: "Desktop 5",
      type: "computer",
      category: "Desktop",
      status: "available",
      location: "Computer Lab A, Station 5",
      description: "Desktop computer available for student use.",
      specifications: "Intel i5, 8GB RAM, 256GB SSD",
      serialNumber: "DESK-005",
      image:
        "https://images.unsplash.com/photo-1593486544625-13ef2368e43a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMGRlc2t0b3AlMjB3b3Jrc3RhdGlvbnxlbnwxfHx8fDE3NTY4NjIxMDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
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
      image:
        "https://images.unsplash.com/photo-1653510640359-cbc4c1f3a90f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVzcyUyMGJvYXJkJTIwZ2FtZXxlbnwxfHx8fDE3NTY4MzM1ODV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "bg-2",
      name: "Scrabble",
      type: "board-game",
      category: "Word Game",
      status: "available",
      location: "Recreation Room, Shelf A",
      description: "Classic word-building board game.",
      maxPlayers: 4,
      image:
        "https://images.unsplash.com/photo-1677024486583-5539ae4cfc67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2FyZCUyMGdhbWVzJTIwc2NyYWJibGV8ZW58MXx8fHwxNzU2ODYyMTE1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "bg-3",
      name: "Snakes and Ladders",
      type: "board-game",
      category: "Family",
      status: "available",
      location: "Recreation Room, Shelf B",
      description: "Classic family board game.",
      maxPlayers: 6,
      image:
        "https://images.unsplash.com/photo-1642056446459-1f10774273f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmFrZXMlMjBsYWRkZXJzJTIwYm9hcmQlMjBnYW1lfGVufDF8fHx8MTc1Njg2MjExOXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  const categories = [
    "all",
    ...Array.from(new Set(equipment.map((item) => item.category))),
  ];

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    const matchesType = typeFilter === "all" || item.type === typeFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesType;
  });

  const handleAddToCart = (itemId: string, itemName: string) => {
    if (cartItems.includes(itemId)) {
      toast.error("Item is already in your cart");
      return;
    }

    const newCartItems = [...cartItems, itemId];
    onAddToCart(newCartItems);
    toast.success(`"${itemName}" added to cart`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "default";
      case "borrowed":
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
      <div>
        <h1 className="text-2xl mb-2">Equipment Catalog</h1>
        <p className="text-muted-foreground">
          Browse and borrow computers and board games from our library.
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, category, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="computer">Computers</SelectItem>
                <SelectItem value="board-game">Board Games</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="borrowed">Borrowed</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredEquipment.length} of {equipment.length} items
        </p>
        <Badge variant="outline" className="gap-2">
          <ShoppingCart className="h-3 w-3" />
          {cartItems.length} in cart
        </Badge>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((item) => {
          const TypeIcon = getTypeIcon(item.type);
          return (
            <Card
              key={item.id}
              className="flex flex-col h-full overflow-hidden"
            >
              <div className="aspect-video relative bg-muted">
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <Badge
                  variant={getStatusColor(item.status)}
                  className="absolute top-2 right-2"
                >
                  {item.status}
                </Badge>
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start gap-2">
                  <TypeIcon className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base line-clamp-2">
                      {item.name}
                    </CardTitle>
                    <CardDescription>{item.category}</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col flex-1 pt-0">
                <div className="space-y-3 flex-1">
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">Location:</span>{" "}
                      {item.location}
                    </p>
                    {item.specifications && (
                      <p>
                        <span className="text-muted-foreground">Specs:</span>{" "}
                        {item.specifications}
                      </p>
                    )}
                    {item.serialNumber && (
                      <p>
                        <span className="text-muted-foreground">Serial:</span>{" "}
                        {item.serialNumber}
                      </p>
                    )}
                    {item.maxPlayers && (
                      <p>
                        <span className="text-muted-foreground">
                          Max Players:
                        </span>{" "}
                        {item.maxPlayers}
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                </div>
                <div className="mt-4">
                  <Button
                    className="w-full gap-2"
                    disabled={
                      item.status !== "available" || cartItems.includes(item.id)
                    }
                    onClick={() => handleAddToCart(item.id, item.name)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {cartItems.includes(item.id)
                      ? "In Cart"
                      : item.status === "available"
                      ? "Add to Cart"
                      : "Not Available"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredEquipment.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              No equipment found matching your criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
