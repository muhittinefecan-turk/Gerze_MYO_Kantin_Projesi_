export interface ExtraItem {
  id: string;
  name: string;
  price: number;
}

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  discountPrice?: number;
  image: string;
  available: boolean;
  allowNote?: boolean;
  featured?: boolean;
  badge?: string;
  extras?: ExtraItem[];
}

export interface CategoryItem {
  id: string;
  name: string;
  iconName?: string;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  success: string;
  warning: string;
  danger: string;
}

export interface CanteenConfig {
  canteen: {
    name: string;
    school: string;
    description: string;
    logo?: string;
    whatsapp: string;
    workingHours: {
      open: string;
      close: string;
    };
    developer: {
      name: string;
      title: string;
      githubOrContact?: string;
    };
  };
  theme?: ThemeColors;
  currency: string;
  announcement?: {
    enabled: boolean;
    text: string;
    type?: 'info' | 'promo' | 'warning';
  };
  settings: {
    ordersEnabled: boolean;
    disabledMessage?: string;
    devMode?: boolean;
    hideUnavailableProducts?: boolean;
    showPickupTime: boolean;
    pickupTimes: string[];
    payment: {
      cash: boolean;
      cashLabel?: string;
      pos: boolean;
      posLabel?: string;
    };
  };
  categories: CategoryItem[];
  products: ProductItem[];
}

export interface CartExtra {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  product: ProductItem;
  quantity: number;
  selectedExtras: CartExtra[];
  note?: string;
  unitPrice: number;
  totalPrice: number;
}

export interface StudentInfo {
  fullName: string;
  studentNumber?: string;
  pickupTime: string;
  paymentMethod: 'cash' | 'pos';
  generalNote?: string;
}
