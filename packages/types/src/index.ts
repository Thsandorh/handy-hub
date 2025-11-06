// Shared TypeScript types for MesterPont

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterClientDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface RegisterTaskerDto extends RegisterClientDto {
  bio?: string;
  hourlyRate?: number;
  locationLat?: number;
  locationLng?: number;
  serviceRadiusKm?: number;
  skillIds: string[];
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CLIENT' | 'TASKER' | 'ADMIN';
  avatarUrl?: string;
}

// Task types
export interface CreateTaskDto {
  title: string;
  description: string;
  skillId: string;
  locationAddress: string;
  locationLat: number;
  locationLng: number;
  budgetType: 'FIXED' | 'HOURLY';
  budgetAmount: number;
  scheduledAt?: Date;
  dueDate?: Date;
  photos?: File[];
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  locationAddress?: string;
  budgetAmount?: number;
  scheduledAt?: Date;
  dueDate?: Date;
}

export interface TaskFilters {
  skillId?: string;
  status?: string;
  minBudget?: number;
  maxBudget?: number;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  budgetType?: 'FIXED' | 'HOURLY';
}

export interface TaskWithDetails {
  id: string;
  title: string;
  description: string;
  locationAddress: string;
  locationLat: number;
  locationLng: number;
  budgetType: 'FIXED' | 'HOURLY';
  budgetAmount: number;
  finalAmount?: number;
  status: string;
  scheduledAt?: Date;
  dueDate?: Date;
  createdAt: Date;
  client: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  tasker?: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    averageRating: number;
  };
  skill: {
    id: string;
    name: string;
    category: string;
    iconName?: string;
  };
  photos: {
    id: string;
    photoUrl: string;
  }[];
  offersCount?: number;
  distance?: number; // in km
}

// Offer types
export interface CreateOfferDto {
  taskId: string;
  proposedAmount: number;
  message?: string;
}

export interface OfferWithDetails {
  id: string;
  proposedAmount: number;
  message?: string;
  status: string;
  createdAt: Date;
  tasker: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    averageRating: number;
    completedTasks: number;
  };
}

// Payment types
export interface CreatePaymentDto {
  taskId: string;
  amount: number;
  returnUrl: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  status: string;
  paymentUrl?: string; // SimplePay redirect URL
}

// Review types
export interface CreateReviewDto {
  taskId: string;
  revieweeId: string;
  rating: number; // 1-5
  comment?: string;
}

export interface ReviewWithDetails {
  id: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  reviewer: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  task: {
    id: string;
    title: string;
  };
}

// Tasker Profile types
export interface UpdateTaskerProfileDto {
  bio?: string;
  hourlyRate?: number;
  locationLat?: number;
  locationLng?: number;
  serviceRadiusKm?: number;
  availability?: Record<string, string[]>;
  skillIds?: string[];
}

export interface TaskerProfileWithDetails {
  userId: string;
  bio?: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  hourlyRate?: number;
  locationLat?: number;
  locationLng?: number;
  serviceRadiusKm: number;
  totalEarnings: number;
  completedTasks: number;
  averageRating: number;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
  };
  skills: {
    id: string;
    name: string;
    category: string;
    experienceYears?: number;
  }[];
  reviews: ReviewWithDetails[];
}

// Message types
export interface SendMessageDto {
  conversationId: string;
  content: string;
}

export interface MessageWithSender {
  id: string;
  content: string;
  createdAt: Date;
  readAt?: Date;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
}

export interface ConversationWithMessages {
  id: string;
  taskId: string;
  task: {
    id: string;
    title: string;
    status: string;
  };
  messages: MessageWithSender[];
  participants: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    role: string;
  }[];
}

// File upload types
export interface FileUploadDto {
  file: File;
  type: 'avatar' | 'task-photo' | 'id-document' | 'selfie';
}

export interface UploadedFile {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

// Skill types
export interface SkillDto {
  id: string;
  name: string;
  category: string;
  iconName?: string;
}

// Notification types (for future WebSocket)
export interface NotificationPayload {
  type:
    | 'NEW_OFFER'
    | 'OFFER_ACCEPTED'
    | 'OFFER_REJECTED'
    | 'TASK_ASSIGNED'
    | 'TASK_COMPLETED'
    | 'NEW_MESSAGE'
    | 'PAYMENT_RECEIVED'
    | 'REVIEW_RECEIVED';
  title: string;
  message: string;
  data?: any;
  createdAt: Date;
}

// Validation error types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationErrorResponse {
  success: false;
  errors: ValidationError[];
}
