// Mock data for JK Logistics - LR (Lorry Receipt) based system
// This structure will be easily replaceable with real database CRUD operations

// Generate mock LR numbers in format: JK-YYYY-XXXXX
const generateLRNumber = (index, year = 2025) => {
  return `JK-${year}-${String(index).padStart(5, '0')}`;
};

// Mock client companies
const clients = [
  'Acme Logistics', 'Global Shipping Co.', 'Express Freight', 'Quick Transport',
  'Metro Cargo', 'Swift Deliveries', 'Prime Logistics', 'Rapid Express',
  'Elite Transport', 'Flash Cargo', 'Blue Dart Express', 'Red Line Logistics',
  'Green Valley Transport', 'Silver Star Cargo', 'Golden Eagle Express'
];

// Mock routes (From → To)
const routes = [
  'Mumbai → Delhi', 'Chennai → Bangalore', 'Kolkata → Pune', 'Hyderabad → Ahmedabad',
  'Jaipur → Lucknow', 'Surat → Kanpur', 'Indore → Nagpur', 'Bhopal → Visakhapatnam',
  'Patna → Ludhiana', 'Agra → Nashik', 'Vadodara → Faridabad', 'Ghaziabad → Rajkot',
  'Meerut → Kalyan', 'Aurangabad → Vasai', 'Dhanbad → Howrah'
];

// Mock goods types
const goodsTypes = [
  'Electronics', 'Textiles', 'Automobile Parts', 'Food Products', 'Chemicals',
  'Pharmaceuticals', 'Furniture', 'Steel Products', 'Plastic Goods', 'Paper Products'
];

// Generate LOADED consignments (10)
export const loadedConsignments = Array.from({ length: 10 }, (_, index) => ({
  lrNumber: generateLRNumber(100 + index),
  client: clients[index % clients.length],
  route: routes[index % routes.length],
  goodsType: goodsTypes[index % goodsTypes.length],
  weight: `${(Math.random() * 50 + 5).toFixed(1)} tons`,
  value: `₹${(Math.random() * 500000 + 50000).toLocaleString('en-IN')}`,
  loadedDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  expectedDelivery: new Date(Date.now() + Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(),
  driverName: `Driver ${index + 1}`,
  vehicleNumber: `MH-${String(Math.floor(Math.random() * 99)).padStart(2, '0')}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
  currentLocation: `En route to ${routes[index % routes.length].split(' → ')[1]}`,
  status: 'Loaded',
  priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
  // Workflow status for loaded items
  workflowStatus: {
    'generate-bill': false,
    'pod-validation': false,
    'final-excel': false,
    'validation-1': false,
    'validation-2': false,
    'excel-1': false,
    'excel-2': false,
    'invoice-1': false,
    'invoice-2': false,
  }
}));

// Generate UNLOADED consignments (10)
export const unloadedConsignments = Array.from({ length: 10 }, (_, index) => ({
  lrNumber: generateLRNumber(200 + index),
  client: clients[(index + 5) % clients.length],
  route: routes[(index + 3) % routes.length],
  goodsType: goodsTypes[(index + 2) % goodsTypes.length],
  weight: `${(Math.random() * 50 + 5).toFixed(1)} tons`,
  value: `₹${(Math.random() * 500000 + 50000).toLocaleString('en-IN')}`,
  loadedDate: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
  deliveredDate: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
  driverName: `Driver ${index + 11}`,
  vehicleNumber: `MH-${String(Math.floor(Math.random() * 99)).padStart(2, '0')}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
  deliveryLocation: routes[(index + 3) % routes.length].split(' → ')[1],
  status: 'Unloaded',
  priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
  podReceived: Math.random() > 0.3, // 70% have POD received
  // Workflow status for unloaded items (some progress made)
  workflowStatus: {
    'generate-bill': Math.random() > 0.5,
    'pod-validation': Math.random() > 0.6,
    'final-excel': false,
    'validation-1': Math.random() > 0.7,
    'validation-2': Math.random() > 0.7,
    'excel-1': Math.random() > 0.8,
    'excel-2': Math.random() > 0.8,
    'invoice-1': false,
    'invoice-2': false,
  }
}));

// Generate COMPLETED consignments (10)
export const completedConsignments = Array.from({ length: 10 }, (_, index) => ({
  lrNumber: generateLRNumber(300 + index),
  client: clients[(index + 10) % clients.length],
  route: routes[(index + 7) % routes.length],
  goodsType: goodsTypes[(index + 4) % goodsTypes.length],
  weight: `${(Math.random() * 50 + 5).toFixed(1)} tons`,
  value: `₹${(Math.random() * 500000 + 50000).toLocaleString('en-IN')}`,
  loadedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  deliveredDate: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString(),
  billGeneratedDate: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
  driverName: `Driver ${index + 21}`,
  vehicleNumber: `MH-${String(Math.floor(Math.random() * 99)).padStart(2, '0')}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
  deliveryLocation: routes[(index + 7) % routes.length].split(' → ')[1],
  billAmount: `₹${(Math.random() * 100000 + 10000).toLocaleString('en-IN')}`,
  invoiceNumber: `INV-${generateLRNumber(300 + index).replace('JK', 'JKI')}`,
  status: 'Completed',
  priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
  podReceived: true,
  paymentStatus: ['Paid', 'Pending', 'Overdue'][Math.floor(Math.random() * 3)],
  // Workflow status for completed items (all completed)
  workflowStatus: {
    'generate-bill': true,
    'pod-validation': true,
    'final-excel': true,
    'validation-1': true,
    'validation-2': true,
    'excel-1': true,
    'excel-2': true,
    'invoice-1': true,
    'invoice-2': true,
  }
}));

// Combined data for search functionality
export const allConsignments = [
  ...loadedConsignments,
  ...unloadedConsignments,
  ...completedConsignments
];

// Helper functions for data manipulation (CRUD operations placeholders)
export const getConsignmentByLR = (lrNumber) => {
  return allConsignments.find(consignment => consignment.lrNumber === lrNumber);
};

export const getConsignmentsByStatus = (status) => {
  switch (status.toLowerCase()) {
    case 'loaded':
      return loadedConsignments;
    case 'unloaded':
      return unloadedConsignments;
    case 'completed':
      return completedConsignments;
    default:
      return allConsignments;
  }
};

export const searchConsignments = (searchTerm) => {
  const term = searchTerm.toLowerCase().trim();
  if (!term) return [];
  
  return allConsignments.filter(consignment => 
    consignment.lrNumber.toLowerCase().includes(term) ||
    consignment.client.toLowerCase().includes(term) ||
    consignment.route.toLowerCase().includes(term) ||
    consignment.goodsType.toLowerCase().includes(term) ||
    consignment.driverName.toLowerCase().includes(term) ||
    consignment.vehicleNumber.toLowerCase().includes(term)
  );
};

// Statistics calculation with revenue focus
export const getStatistics = () => {
  // Calculate Total Revenue (from completed shipments)
  const totalRevenue = completedConsignments.reduce((sum, consignment) => {
    const amount = parseInt(consignment.billAmount.replace(/[₹,]/g, ''));
    return sum + amount;
  }, 0);

  // Calculate Pending Revenue (from loaded + unloaded shipments)
  const pendingRevenue = [...loadedConsignments, ...unloadedConsignments].reduce((sum, consignment) => {
    // Estimate revenue based on value (typically 10-15% of shipment value)
    const shipmentValue = parseInt(consignment.value.replace(/[₹,]/g, ''));
    const estimatedRevenue = shipmentValue * 0.12; // 12% commission
    return sum + estimatedRevenue;
  }, 0);

  // Calculate Net Gross Revenue (total of all revenue streams)
  const netGrossRevenue = totalRevenue + pendingRevenue;

  const activeShipments = loadedConsignments.length + unloadedConsignments.length;

  return {
    totalRevenue: `₹${totalRevenue.toLocaleString('en-IN')}`,
    activeShipments: activeShipments.toString(),
    pendingRevenue: `₹${Math.round(pendingRevenue).toLocaleString('en-IN')}`,
    netGrossRevenue: `₹${Math.round(netGrossRevenue).toLocaleString('en-IN')}`,
    loadedCount: loadedConsignments.length,
    unloadedCount: unloadedConsignments.length,
    completedCount: completedConsignments.length
  };
};

// Recent shipments (latest 5)
export const getRecentShipments = () => {
  return [...allConsignments]
    .sort((a, b) => {
      const dateA = new Date(a.deliveredDate || a.loadedDate);
      const dateB = new Date(b.deliveredDate || b.loadedDate);
      return dateB - dateA;
    })
    .slice(0, 5)
    .map(consignment => ({
      id: consignment.lrNumber,
      client: consignment.client,
      route: consignment.route,
      status: consignment.status,
      time: getRelativeTime(consignment.deliveredDate || consignment.loadedDate)
    }));
};

// Helper function to get relative time
const getRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

export default {
  loadedConsignments,
  unloadedConsignments,
  completedConsignments,
  allConsignments,
  getConsignmentByLR,
  getConsignmentsByStatus,
  searchConsignments,
  getStatistics,
  getRecentShipments
};