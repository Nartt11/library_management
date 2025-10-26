import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { ShoppingCart, Trash2, Monitor, Gamepad2, Calendar, Clock, MapPin } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import type { User } from '../../App';

interface Equipment {
  id: string;
  name: string;
  type: 'computer' | 'board-game';
  category: string;
  status: 'available' | 'borrowed' | 'maintenance';
  location: string;
  description: string;
  specifications?: string;
  maxPlayers?: number;
  serialNumber?: string;
  image: string;
}

interface EquipmentCartProps {
  cartItems: string[];
  onUpdateCart: (items: string[]) => void;
  onNavigateToQRTicket: (ticketData: any) => void;
}

export function EquipmentCart({ cartItems, onUpdateCart, onNavigateToQRTicket }: EquipmentCartProps) {
  const [purpose, setPurpose] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Equipment data with images
  const equipment: Equipment[] = [
    {
      id: 'comp-1',
      name: 'Desktop 1',
      type: 'computer',
      category: 'Desktop',
      status: 'available',
      location: 'Computer Lab A, Station 1',
      description: 'Desktop computer available for student use.',
      specifications: 'Intel i5, 8GB RAM, 256GB SSD',
      serialNumber: 'DESK-001',
      image: 'https://images.unsplash.com/photo-1593486544625-13ef2368e43a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMGRlc2t0b3AlMjB3b3Jrc3RhdGlvbnxlbnwxfHx8fDE3NTY4NjIxMDl8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 'comp-2',
      name: 'Desktop 2',
      type: 'computer',
      category: 'Desktop',
      status: 'available',
      location: 'Computer Lab A, Station 2',
      description: 'Desktop computer available for student use.',
      specifications: 'Intel i5, 8GB RAM, 256GB SSD',
      serialNumber: 'DESK-002',
      image: 'https://images.unsplash.com/photo-1593486544625-13ef2368e43a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMGRlc2t0b3AlMjB3b3Jrc3RhdGlvbnxlbnwxfHx8fDE3NTY4NjIxMDl8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 'comp-3',
      name: 'Desktop 3',
      type: 'computer',
      category: 'Desktop',
      status: 'available',
      location: 'Computer Lab A, Station 3',
      description: 'Desktop computer available for student use.',
      specifications: 'Intel i5, 8GB RAM, 256GB SSD',
      serialNumber: 'DESK-003',
      image: 'https://images.unsplash.com/photo-1593486544625-13ef2368e43a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMGRlc2t0b3AlMjB3b3Jrc3RhdGlvbnxlbnwxfHx8fDE3NTY4NjIxMDl8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 'comp-4',
      name: 'Desktop 4',
      type: 'computer',
      category: 'Desktop',
      status: 'borrowed',
      location: 'Computer Lab A, Station 4',
      description: 'Desktop computer available for student use.',
      specifications: 'Intel i5, 8GB RAM, 256GB SSD',
      serialNumber: 'DESK-004',
      image: 'https://images.unsplash.com/photo-1593486544625-13ef2368e43a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMGRlc2t0b3AlMjB3b3Jrc3RhdGlvbnxlbnwxfHx8fDE3NTY4NjIxMDl8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 'comp-5',
      name: 'Desktop 5',
      type: 'computer',
      category: 'Desktop',
      status: 'available',
      location: 'Computer Lab A, Station 5',
      description: 'Desktop computer available for student use.',
      specifications: 'Intel i5, 8GB RAM, 256GB SSD',
      serialNumber: 'DESK-005',
      image: 'https://images.unsplash.com/photo-1593486544625-13ef2368e43a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMGRlc2t0b3AlMjB3b3Jrc3RhdGlvbnxlbnwxfHx8fDE3NTY4NjIxMDl8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 'bg-1',
      name: 'Chess',
      type: 'board-game',
      category: 'Strategy',
      status: 'available',
      location: 'Recreation Room, Shelf A',
      description: 'Classic chess board game.',
      maxPlayers: 2,
      image: 'https://images.unsplash.com/photo-1653510640359-cbc4c1f3a90f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVzcyUyMGJvYXJkJTIwZ2FtZXxlbnwxfHx8fDE3NTY4MzM1ODV8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 'bg-2',
      name: 'Scrabble',
      type: 'board-game',
      category: 'Word Game',
      status: 'available',
      location: 'Recreation Room, Shelf A',
      description: 'Classic word-building board game.',
      maxPlayers: 4,
      image: 'https://images.unsplash.com/photo-1677024486583-5539ae4cfc67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2FyZCUyMGdhbWVzJTIwc2NyYWJibGV8ZW58MXx8fHwxNzU2ODYyMTE1fDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 'bg-3',
      name: 'Snakes and Ladders',
      type: 'board-game',
      category: 'Family',
      status: 'available',
      location: 'Recreation Room, Shelf B',
      description: 'Classic family board game.',
      maxPlayers: 6,
      image: 'https://images.unsplash.com/photo-1642056446459-1f10774273f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmFrZXMlMjBsYWRkZXJzJTIwYm9hcmQlMjBnYW1lfGVufDF8fHx8MTc1Njg2MjExOXww&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];

  const cartEquipment = cartItems.map(id => equipment.find(item => item.id === id)).filter(Boolean) as Equipment[];

  const removeFromCart = (itemId: string) => {
    const updatedCart = cartItems.filter(id => id !== itemId);
    onUpdateCart(updatedCart);
    const item = equipment.find(e => e.id === itemId);
    toast.success(`"${item?.name}" removed from cart`);
  };

  const generateQRTicket = () => {
    if (cartEquipment.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!purpose.trim()) {
      toast.error('Please specify the purpose for borrowing');
      return;
    }

    if (!selectedDate) {
      toast.error('Please select a reservation date');
      return;
    }

    if (!selectedTime) {
      toast.error('Please select a time');
      return;
    }

    const ticketData = {
      type: 'equipment',
      items: cartEquipment.map(item => ({
        id: item.id,
        name: item.name,
        type: item.type,
        location: item.location
      })),
      purpose,
      reservationDate: selectedDate,
      reservationTime: selectedTime,
      qrCode: `EQUIPMENT-${Date.now()}`,
      generatedAt: new Date().toLocaleString()
    };

    onNavigateToQRTicket(ticketData);
    onUpdateCart([]);
    toast.success('Equipment reservation QR ticket generated!');
  };

  const getTypeIcon = (type: string) => {
    return type === 'computer' ? Monitor : Gamepad2;
  };

  // Generate time slots for today and tomorrow
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  // Generate available dates (today and next 7 days)
  const availableDates = Array.from({ length: 8 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl mb-2 flex items-center gap-2">
          <ShoppingCart className="h-6 w-6" />
          Equipment Cart
        </h1>
        <p className="text-muted-foreground">Review your selected equipment and generate a reservation QR ticket.</p>
      </div>

      {cartEquipment.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg mb-2">Your equipment cart is empty</h3>
            <p className="text-muted-foreground mb-4">Browse our equipment catalog to add items to your cart.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Equipment in Cart ({cartEquipment.length})</CardTitle>
                <CardDescription>Review your selected equipment before generating QR ticket</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartEquipment.map((item) => {
                  const TypeIcon = getTypeIcon(item.type);
                  return (
                    <div key={item.id} className="flex gap-4 p-4 border border-border rounded-lg">
                      <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2 flex-1 min-w-0">
                            <TypeIcon className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                            <div className="min-w-0">
                              <h4 className="font-medium line-clamp-1">{item.name}</h4>
                              <p className="text-sm text-muted-foreground">{item.category}</p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="shrink-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{item.location}</span>
                          </div>
                        </div>

                        {item.specifications && (
                          <p className="text-sm text-muted-foreground mt-1">
                            <span className="font-medium">Specs:</span> {item.specifications}
                          </p>
                        )}
                        
                        {item.maxPlayers && (
                          <p className="text-sm text-muted-foreground mt-1">
                            <span className="font-medium">Max Players:</span> {item.maxPlayers}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Reservation Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reservation Details</CardTitle>
                <CardDescription>Provide details for your equipment reservation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose *</Label>
                  <Textarea
                    id="purpose"
                    placeholder="Describe the purpose for borrowing this equipment..."
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Reservation Date *</Label>
                  <select
                    id="date"
                    className="w-full p-2 border border-border rounded-md bg-background"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  >
                    <option value="">Select date</option>
                    {availableDates.map(date => {
                      const dateObj = new Date(date);
                      const isToday = date === new Date().toISOString().split('T')[0];
                      const label = isToday ? 'Today' : dateObj.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'short', 
                        day: 'numeric' 
                      });
                      return (
                        <option key={date} value={date}>
                          {label} ({date})
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Preferred Time *</Label>
                  <select
                    id="time"
                    className="w-full p-2 border border-border rounded-md bg-background"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  >
                    <option value="">Select time</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    onClick={generateQRTicket} 
                    className="w-full"
                    disabled={!purpose.trim() || !selectedDate || !selectedTime}
                  >
                    Generate QR Ticket
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Cart Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Items:</span>
                    <span className="font-medium">{cartEquipment.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Computers:</span>
                    <span className="font-medium">{cartEquipment.filter(item => item.type === 'computer').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Board Games:</span>
                    <span className="font-medium">{cartEquipment.filter(item => item.type === 'board-game').length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}