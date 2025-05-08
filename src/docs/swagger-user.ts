import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Messaging API - User Documentation",
      version: "1.0.0",
      description: "API documentation for regular users",
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
        name: "User",
        description: "User operations",
      },
      {
        name: "Messages",
        description: "Direct messaging operations",
      },
      {
        name: "Groups",
        description: "Group operations",
      },
    ],
  },
  // Paths to files containing OpenAPI definitions
  apis: [
    "./src/routes/**/*.ts",
    ".prisma/schema.prisma",
    "./src/controllers/**/*.ts",
  ],
};

const userSpec = swaggerJsdoc(options);
export default userSpec;
