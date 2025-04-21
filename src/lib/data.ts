
import { Kindergarten, User, Child, Group, Payment, AuditLog } from "@/types";

const currentDate = new Date().toISOString();
const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

// Users data
export const users: User[] = [
  {
    id: "1",
    username: "johndoe",
    email: "john.doe@example.com",
    identity: "ID12345",
    role: "manager",
    joinDate: oneMonthAgo,
    createdAt: oneMonthAgo
  },
  {
    id: "2",
    username: "janesmith",
    email: "jane.smith@example.com",
    identity: "ID67890",
    role: "staff",
    joinDate: oneWeekAgo,
    createdAt: oneWeekAgo
  },
  {
    id: "3",
    username: "robertjohnson",
    email: "robert.johnson@example.com",
    identity: "ID24680",
    role: "staff",
    joinDate: currentDate,
    createdAt: currentDate
  }
];

// Kindergartens data
export const kindergartens: Kindergarten[] = [
  {
    id: "1",
    name: "Sunshine Kindergarten",
    address: "123 Main St, Cityville",
    phoneNumber: "555-1234",
    isActive: true,
    joinDate: oneMonthAgo,
    createdBy: "johndoe",
    createdAt: oneMonthAgo
  },
  {
    id: "2",
    name: "Rainbow Kids",
    address: "456 Park Ave, Townsburg",
    phoneNumber: "555-5678",
    isActive: true,
    joinDate: oneWeekAgo,
    createdBy: "johndoe",
    createdAt: oneWeekAgo
  },
  {
    id: "3",
    name: "Little Explorers",
    address: "789 Oak Rd, Villageton",
    phoneNumber: "555-9012",
    isActive: false,
    joinDate: currentDate,
    createdBy: "janesmith",
    createdAt: currentDate
  }
];

// Children data
export const children: Child[] = [
  {
    id: "1",
    firstName: "Emma",
    secondName: "Rose",
    thirdName: "Marie",
    lastName: "Johnson",
    fatherIdNumber: "F-12345",
    motherIdNumber: "M-12345",
    birthDate: "2019-05-15",
    createdAt: oneMonthAgo
  },
  {
    id: "2",
    firstName: "Noah",
    secondName: "James",
    thirdName: "William",
    lastName: "Smith",
    fatherIdNumber: "F-67890",
    motherIdNumber: "M-67890",
    birthDate: "2018-09-23",
    createdAt: oneWeekAgo
  },
  {
    id: "3",
    firstName: "Olivia",
    secondName: "Grace",
    thirdName: "Elizabeth",
    lastName: "Brown",
    fatherIdNumber: "F-24680",
    motherIdNumber: "M-24680",
    birthDate: "2019-11-10",
    createdAt: currentDate
  },
  {
    id: "4",
    firstName: "Liam",
    secondName: "Alexander",
    thirdName: "Thomas",
    lastName: "Davis",
    fatherIdNumber: "F-13579",
    motherIdNumber: "M-13579",
    birthDate: "2019-02-28",
    createdAt: currentDate
  },
  {
    id: "5",
    firstName: "Ava",
    secondName: "Charlotte",
    thirdName: "Sophia",
    lastName: "Wilson",
    fatherIdNumber: "F-86420",
    motherIdNumber: "M-86420",
    birthDate: "2018-07-04",
    createdAt: currentDate
  }
];

// Groups data
export const groups: Group[] = [
  {
    id: "1",
    name: "Butterflies",
    children: [children[0], children[2]],
    staffName: "Jane Smith",
    createdAt: oneMonthAgo
  },
  {
    id: "2",
    name: "Ladybugs",
    children: [children[1], children[3]],
    staffName: "Robert Johnson",
    createdAt: oneWeekAgo
  },
  {
    id: "3",
    name: "Bumblebees",
    children: [children[4]],
    staffName: "Jane Smith",
    createdAt: currentDate
  }
];

// Payments data
export const payments: Payment[] = [
  {
    id: "1",
    childName: "Emma Johnson",
    parentEmail: "parent1@example.com",
    amount: 250,
    paymentMethod: "Credit Card",
    paymentDate: oneMonthAgo,
    status: "paid",
    createdAt: oneMonthAgo
  },
  {
    id: "2",
    childName: "Noah Smith",
    parentEmail: "parent2@example.com",
    amount: 250,
    paymentMethod: "Bank Transfer",
    paymentDate: oneWeekAgo,
    status: "paid",
    createdAt: oneWeekAgo
  },
  {
    id: "3",
    childName: "Olivia Brown",
    parentEmail: "parent3@example.com",
    amount: 250,
    paymentMethod: "Cash",
    paymentDate: currentDate,
    status: "pending",
    createdAt: currentDate
  },
  {
    id: "4",
    childName: "Liam Davis",
    parentEmail: "parent4@example.com",
    amount: 250,
    paymentMethod: "Credit Card",
    status: "overdue",
    paymentDate: oneMonthAgo,
    createdAt: oneMonthAgo
  },
  {
    id: "5",
    childName: "Ava Wilson",
    parentEmail: "parent5@example.com",
    amount: 250,
    paymentMethod: "Bank Transfer",
    status: "pending",
    paymentDate: oneWeekAgo,
    createdAt: oneWeekAgo
  }
];

// Audit logs data
export const auditLogs: AuditLog[] = [
  {
    id: "1",
    action: "CREATE",
    fullName: "John Doe",
    message: "Created new kindergarten",
    description: "Added Sunshine Kindergarten to the system",
    createdAt: oneMonthAgo
  },
  {
    id: "2",
    action: "UPDATE",
    fullName: "Jane Smith",
    message: "Updated child information",
    description: "Updated contact details for Emma Johnson",
    createdAt: oneWeekAgo
  },
  {
    id: "3",
    action: "DELETE",
    fullName: "Robert Johnson",
    message: "Removed staff member",
    description: "Removed staff member Michael Brown from the system",
    createdAt: currentDate
  },
  {
    id: "4",
    action: "CREATE",
    fullName: "John Doe",
    message: "Added new child",
    description: "Enrolled Noah Smith in Rainbow Kids kindergarten",
    createdAt: oneWeekAgo
  },
  {
    id: "5",
    action: "UPDATE",
    fullName: "Jane Smith",
    message: "Updated group assignment",
    description: "Moved Olivia Brown from Butterflies to Bumblebees group",
    createdAt: currentDate
  }
];
