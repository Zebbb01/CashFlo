// src/lib/validations/invitation.validation.ts
import { z } from 'zod';

export const updateInvitationSchema = z.object({
  action: z.enum(['accept', 'reject'], {
    errorMap: () => ({ message: 'Invalid action. Must be "accept" or "reject".' }),
  }),
});

// If you ever need a schema for creating invitations, you'd add it here too.
// export const createInvitationSchema = z.object({
//   senderId: z.string().min(1, 'Sender ID is required'),
//   receiverId: z.string().min(1, 'Receiver ID is required'),
//   assetId: z.string().min(1, 'Asset ID is required'),
//   sharePercentage: z.number().min(0.01).max(100, 'Share percentage must be between 0.01 and 100.'),
//   message: z.string().optional(),
//   expiresAt: z.string().datetime().optional(),
// });