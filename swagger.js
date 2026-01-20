import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Task Management API",
    description: "API documentation for Task Management system",
  },
  host: "localhost:3000",
  schemes: ["http"],
  basePath: "/",
  consumes: ["application/json"],
  produces: ["application/json"],
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description: "JWT Authorization header using the Bearer scheme. Example: Bearer <token>",
    },
  },
  security: [{ bearerAuth: [] }],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./src/app.js"];

swaggerAutogen()(outputFile, endpointsFiles, doc);
