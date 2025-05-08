import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Messaging API - Admin Documentation",
      version: "1.0.0",
      description: "API documentation for administrators",
    },
    servers: [
      {
        url: "/api",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: "Authentication",
        description: "User authentication operations",
      },
      {
        name: "Admin",
        description: "Admin-only operations",
      },
      {
        name: "User Management",
        description: "User management operations",
      },
      {
        name: "Group Management",
        description: "Group management operations",
      },
    ],
  },
  // Paths to files containing OpenAPI definitions
  apis: [
    "./src/routes/**/*.ts",
    "./src/models/*.ts",
    "./src/controllers/**/*.ts",
  ],
};

const adminSpec = swaggerJsdoc(options);
export default adminSpec;
