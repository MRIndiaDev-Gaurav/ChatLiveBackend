/**
 * @swagger
 *   schemas:
 *     User:
 *       type: object
 *        requierd:
 *          - firstName
 *          - email
 *          - password
 *          - country
 *        properties:
 *          id:
 *            type: string
 *            description: Unique identifier of the user
 *          firstName:
 *            type: string
 *            description: First name of the user
 *          lastName:
 *            type: string
 *            description: Last name of the user
 *          email:
 *            type: string
 *            description: Email address of the user
 *          country:
 *            type: string
 *            description: Country of the user
 *          password:
 *            type: string
 *            description: Password of the user
 *          role:
 *            type: string
 *            description: Role of the user
 *          verified:
 *            type: boolean
 *            description: Verified status of the user
 *          verificationToken:
 *            type: string
 *            description: Verification token of the user
 *          createdAt:
 *            type: string
 *            description: Date and time of user creation
 *          updatedAt:
 *            type: string
 *            description: Date and time of user update
 */

interface User {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  country: string;
  password: string;
  role: "USER" | "ADMIN";
  verified: boolean;
  verificationToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}
