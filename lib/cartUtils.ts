// Cart management utilities using localStorage

const CART_STORAGE_KEY = "library_cart_items";

export function getCartItems(): string[] {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.error("Error reading cart items:", error);
  }
  return [];
}

export function setCartItems(items: string[]): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    // Dispatch custom event so other components can react to cart changes
    window.dispatchEvent(new Event("cart-updated"));
  } catch (error) {
    console.error("Error saving cart items:", error);
  }
}

export function addToCart(bookId: string): boolean {
  const items = getCartItems();
  if (items.includes(bookId)) {
    return false; // Already in cart
  }
  setCartItems([...items, bookId]);
  return true;
}

export function removeFromCart(bookId: string): boolean {
  const items = getCartItems();
  const newItems = items.filter((id) => id !== bookId);
  if (newItems.length === items.length) {
    return false; // Item wasn't in cart
  }
  setCartItems(newItems);
  return true;
}

export function clearCart(): void {
  setCartItems([]);
}

export function isInCart(bookId: string): boolean {
  return getCartItems().includes(bookId);
}

export function getCartCount(): number {
  return getCartItems().length;
}
