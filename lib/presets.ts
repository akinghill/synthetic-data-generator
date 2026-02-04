
export interface Preset {
    id: string;
    label: string;
    description: string;
    schema: Record<string, any>; // Used for documentation/display
    systemPrompt: string;      // The instruction to the LLM
}

const baseSystemPrompt = `You are a synthetic data generator. Your task is to generate realistic JSON data based on the requested schema.
- Output ONLY valid JSON array.
- Do not include markdown formatting (like \`\`\`json).
- Do not include any explanation or conversational text.
- Ensure the data is realistic and varied.
`;

export const PRESETS: Preset[] = [
    {
        id: "users",
        label: "Users / Customers",
        description: "Realistic user profiles with contact info and roles",
        schema: {
            id: "uuid",
            firstName: "string",
            lastName: "string",
            email: "string",
            phoneNumber: "string",
            dateOfBirth: "ISO date",
            isActive: "boolean",
            role: "Admin | User | Manager | Viewer",
            createdAt: "ISO datetime",
            updatedAt: "ISO datetime",
        },
        systemPrompt: `${baseSystemPrompt}
    Generate a JSON array of user objects with the following schema:
    {
      "id": "uuid (v4)",
      "firstName": "string",
      "lastName": "string",
      "email": "string (realistic)",
      "phoneNumber": "string (US format)",
      "dateOfBirth": "ISO 8601 date string (past 18-90 years)",
      "isActive": "boolean",
      "role": "One of: Admin, User, Manager, Viewer",
      "createdAt": "ISO 8601 datetime (past 2 years)",
      "updatedAt": "ISO 8601 datetime (after createdAt)"
    }`
    },
    {
        id: "products",
        label: "Products",
        description: "E-commerce product catalog items",
        schema: {
            id: "uuid",
            name: "string",
            description: "string",
            category: "string",
            price: "number",
            currency: "string",
            sku: "string",
            inventoryCount: "number",
            isActive: "boolean",
            createdAt: "ISO datetime",
        },
        systemPrompt: `${baseSystemPrompt}
    Generate a JSON array of product objects with the following schema:
    {
      "id": "uuid (v4)",
      "name": "string (creative product name)",
      "description": "string (short marketing description)",
      "category": "string (e.g., Electronics, Home, Fashion)",
      "price": "number (positive, 2 decimal places)",
      "currency": "USD",
      "sku": "string (alphanumeric code)",
      "inventoryCount": "integer (0-1000)",
      "isActive": "boolean",
      "createdAt": "ISO 8601 datetime"
    }`
    },
    {
        id: "orders",
        label: "Orders",
        description: "E-commerce orders with line items",
        schema: {
            id: "uuid",
            userId: "uuid",
            status: "Pending | Completed | Cancelled | Refunded",
            totalAmount: "number",
            currency: "string",
            orderDate: "ISO datetime",
            items: "Array<{productId, productName, quantity, unitPrice}>",
            shippingAddress: "{street, city, state, postalCode, country}"
        },
        systemPrompt: `${baseSystemPrompt}
    Generate a JSON array of order objects with the following schema:
    {
      "id": "uuid (v4)",
      "userId": "uuid (v4)",
      "status": "One of: Pending, Completed, Cancelled, Refunded",
      "totalAmount": "number (sum of items, 2 decimal places)",
      "currency": "USD",
      "orderDate": "ISO 8601 datetime (past 1 year)",
      "items": [
        {
          "productId": "uuid (v4)",
          "productName": "string",
          "quantity": "integer (1-5)",
          "unitPrice": "number"
        }
      ],
      "shippingAddress": {
        "street": "string",
        "city": "string",
        "state": "string (abbreviation)",
        "postalCode": "string",
        "country": "US"
      }
    }`
    },
    {
        id: "support-tickets",
        label: "Support Tickets",
        description: "Customer service tickets and metadata",
        schema: {
            id: "uuid",
            title: "string",
            description: "string",
            priority: "Low | Medium | High | Critical",
            status: "Open | In Progress | Resolved | Closed",
            requesterEmail: "string",
            assignedAgent: "string",
            tags: "string[]",
            createdAt: "ISO datetime",
            resolvedAt: "ISO datetime | null"
        },
        systemPrompt: `${baseSystemPrompt}
    Generate a JSON array of support ticket objects with the following schema:
    {
      "id": "uuid (v4)",
      "title": "string (brief issue summary)",
      "description": "string (detailed problem description)",
      "priority": "One of: Low, Medium, High, Critical",
      "status": "One of: Open, In Progress, Resolved, Closed",
      "requesterEmail": "string",
      "assignedAgent": "string (name) or null",
      "tags": "array of strings (e.g., bug, sales, feature)",
      "createdAt": "ISO 8601 datetime",
      "resolvedAt": "ISO 8601 datetime (if resolved/closed) or null"
    }`
    },
    {
        id: "iot-events",
        label: "IoT Telemetry Events",
        description: "Device sensor data and status events",
        schema: {
            eventId: "uuid",
            deviceId: "string",
            deviceType: "string",
            timestamp: "ISO datetime",
            status: "Online | Offline | Warning | Error",
            metrics: "{temperature, batteryLevel, signalStrength, cpuUsage}",
            location: "{latitude, longitude}"
        },
        systemPrompt: `${baseSystemPrompt}
    Generate a JSON array of IoT event objects with the following schema:
    {
      "eventId": "uuid (v4)",
      "deviceId": "string (e.g., SENSOR-001)",
      "deviceType": "string (e.g., Thermostat, Camera, Hub)",
      "timestamp": "ISO 8601 datetime (recent)",
      "status": "One of: Online, Offline, Warning, Error",
      "metrics": {
        "temperature": "number (celsius)",
        "batteryLevel": "integer (0-100)",
        "signalStrength": "integer (-100 to 0)",
        "cpuUsage": "integer (0-100)"
      },
      "location": {
        "latitude": "number",
        "longitude": "number"
      }
    }`
    }
];
