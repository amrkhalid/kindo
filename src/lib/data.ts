
import { Kindergarten, User, Child, Group, Payment, AuditLog } from "@/types";

const currentDate = new Date().toISOString();
const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

// Generate 50 users
export const users: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: `user-${i + 1}`,
  username: `user${i + 1}`,
  email: `user${i + 1}@example.com`,
  identity: `ID${Math.floor(10000 + Math.random() * 90000)}`,
  role: i % 3 === 0 ? "manager" : "staff",
  joinDate: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString(),
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString()
}));

// Generate 50 kindergartens
export const kindergartens: Kindergarten[] = Array.from({ length: 50 }, (_, i) => ({
  id: `kg-${i + 1}`,
  name: `Kindergarten ${i + 1}`,
  address: `${Math.floor(100 + Math.random() * 9900)} ${['Main St', 'Oak Ave', 'Park Rd', 'Cedar Ln', 'Maple Dr'][i % 5]}, City ${i + 1}`,
  phoneNumber: `555-${Math.floor(1000 + Math.random() * 9000)}`,
  isActive: Math.random() > 0.2,
  joinDate: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString(),
  createdBy: users[Math.floor(Math.random() * users.length)].username,
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString()
}));

// Generate 50 children
export const children: Child[] = Array.from({ length: 50 }, (_, i) => ({
  id: `child-${i + 1}`,
  firstName: `FirstName${i + 1}`,
  secondName: `MiddleName${i + 1}`,
  thirdName: `ThirdName${i + 1}`,
  lastName: `LastName${i + 1}`,
  fatherIdNumber: `F-${Math.floor(10000 + Math.random() * 90000)}`,
  motherIdNumber: `M-${Math.floor(10000 + Math.random() * 90000)}`,
  birthDate: new Date(Date.now() - Math.floor(Math.random() * 1825) * 24 * 60 * 60 * 1000).toISOString(),
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString()
}));

// Generate 50 groups
export const groups: Group[] = Array.from({ length: 50 }, (_, i) => ({
  id: `group-${i + 1}`,
  name: `Group ${i + 1}`,
  children: children.slice(Math.floor(Math.random() * 45), Math.floor(Math.random() * 45) + 5),
  staffName: users.filter(u => u.role === "staff")[Math.floor(Math.random() * users.filter(u => u.role === "staff").length)].username,
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString()
}));

// Generate 50 payments
export const payments: Payment[] = Array.from({ length: 50 }, (_, i) => ({
  id: `payment-${i + 1}`,
  childName: `${children[i % children.length].firstName} ${children[i % children.length].lastName}`,
  parentEmail: `parent${i + 1}@example.com`,
  amount: Math.floor(200 + Math.random() * 300),
  paymentMethod: ['Credit Card', 'Bank Transfer', 'Cash'][Math.floor(Math.random() * 3)],
  paymentDate: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString(),
  status: ['paid', 'pending', 'overdue'][Math.floor(Math.random() * 3)] as 'paid' | 'pending' | 'overdue',
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString()
}));

// Generate 50 audit logs
export const auditLogs: AuditLog[] = Array.from({ length: 50 }, (_, i) => ({
  id: `log-${i + 1}`,
  action: ['CREATE', 'UPDATE', 'DELETE'][Math.floor(Math.random() * 3)],
  fullName: `${users[i % users.length].username}`,
  message: `${['Created', 'Updated', 'Deleted'][Math.floor(Math.random() * 3)]} record`,
  description: `${['Added new child', 'Modified group assignment', 'Updated payment information', 'Changed kindergarten details', 'Modified staff role'][Math.floor(Math.random() * 5)]}`,
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString()
}));
