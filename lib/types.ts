export interface Customer {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    notes?: string;
    note?: string; // for compatibility with existing UI code if any
    bookingCount?: number;
    totalSpent?: number;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Stat {
    name?: string;
    value?: string;
    icon?: any;
    color?: string;
    bg?: string;
    change?: string;
    active?: number;
    type?: string;
}

export interface RecentUser {
    id?: string;
    name?: string;
    role?: string;
    status?: string;
    createdAt?: string;
}
export interface Business {
    id?: string
    name?: string
    slug?: string
    ownerName?: string
    ownerEmail?: string
    staffCount?: number
    serviceCount?: number
    plan?: string
    planActive?: boolean
    subscriptionEnd?: string | null
    status?: string
    createdAt?: string
    type?: string
    description?: string
    address?: string
    phone?: string
    logo?: string
}

export interface UserEmail {
    email?: string;
    name?: string | null;
}
export interface BusinessDetail {
    id?: string
    name?: string
    slug?: string
    plan?: string
    planActive?: boolean
    subscriptionStart?: string
    subscriptionEnd?: string | null
    status?: string
    type?: string
    description?: string | null
    address?: string | null
    phone?: string | null
    logo?: string | null
    createdAt?: string
    owner?: {
        name?: string
        email?: string
    }
    _count?: {
        services?: number
        members?: number
        appointments?: number
    }
}

export interface TiersConfig {
    [key: string]: {
        services?: number;
        members?: number;
        appointments?: number;
    }
}

export interface Settings {
    platformName?: string;
    supportEmail?: string;
    supportPhone?: string;
    registrationOpen?: boolean;
    currency?: string;
    commissionRate?: number;
    tiersConfig?: TiersConfig;
}

export interface User {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    createdAt?: string;
    ownedBusinesses?: {
        id?: string;
        name?: string;
        slug?: string;
        type?: string;
    }[];
    memberships?: {
        businessId?: string;
        business?: {
            id?: string;
            name?: string;
        };
    }[];
}

export interface Business {
    id?: string;
    name?: string;
    slug?: string;
}
export interface BusinessData {
    name?: string;
    plan?: string;
    subscriptionEnd?: string | null;
    remindersEnabled?: boolean;
    marketingAutomation?: boolean;
}

export interface AppointmentData {
    id?: string;
    customer?: { name?: string };
    service?: { name?: string };
    startTime?: string;
    status?: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED';
}


export interface Appointment {
    id?: string;
    startTime?: string;
    status?: "CONFIRMED" | "PENDING" | "COMPLETED" | "CANCELLED";
    service?: Service;
    customer?: Customer;
}
export interface Staff {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    memberId: string;
}
export interface TierConfig {
    services: number;
}
export interface PublicSettings {
    platformName: string;
    supportEmail: string;
    supportPhone: string;
    currency: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tiersConfig: Record<string, any>;
}
export interface Tier {
    name: string;
    price: string | number;
    description: string;
    features: string[];
    button: string;
    popular: boolean;
}
export interface UploadProps {
    value: string;
    onChange: (value: string) => void;
    onUploading?: (uploading: boolean) => void;
    label?: string;

}

export interface BusinessGuardProps {
    children: React.ReactNode;
}

export interface BusinessStatus {
    exists: boolean;
    status?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING";
    name?: string;
}
export interface Service {
    id?: string;
    name?: string;
    description?: string;
    duration?: number;
    price: number | string;
    image?: string;
    isActive?: boolean;
}