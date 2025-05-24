/**
 * @openapi
 * components:
 *   schemas:
 *     UserEntity:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         email:
 *           type: string
 *           format: email
 *         name:
 *           type: string
 *           nullable: true
 *         dob:
 *           type: string
 *           format: date
 *           nullable: true
 *         bio:
 *           type: string
 *           nullable: true
 *         demographics:
 *           type: object
 *           additionalProperties: true
 *           nullable: true
 *         medicalHistory:
 *           type: string
 *           nullable: true
 *         background:
 *           type: string
 *           nullable: true
 *         avatarUrl:
 *           type: string
 *           format: uri
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CaseEntity:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         age:
 *           type: integer
 *         sex:
 *           type: string
 *         occupation:
 *           type: string
 *         immunizations:
 *           type: array
 *           items:
 *             type: string
 *         chronicIllnesses:
 *           type: array
 *           items:
 *             type: string
 *         minorIllnesses:
 *           type: array
 *           items:
 *             type: string
 *         familySocialHistory:
 *           type: string
 *         chiefComplaint:
 *           type: string
 *         currentSymptoms:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     Assignment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         user:
 *           $ref: '#/components/schemas/UserEntity'
 *         case:
 *           $ref: '#/components/schemas/CaseEntity'
 *         assignedAt:
 *           type: string
 *           format: date-time
 *
 *     UserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         user:
 *           $ref: '#/components/schemas/UserEntity'
 *         case:
 *           $ref: '#/components/schemas/CaseEntity'
 *         isReal:
 *           type: boolean
 *         respondedAt:
 *           type: string
 *           format: date-time
 *
 * securitySchemes:
 *   cookieAuth:
 *     type: apiKey
 *     in: cookie
 *     name: token
 */
