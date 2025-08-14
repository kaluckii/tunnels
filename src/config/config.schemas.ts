import z from 'zod';

export const TunnelSchema = z.object({
  prefix: z.string(),
  port: z.number().positive(),
});

export const ConfigSchema = z.object({
  $schema: z.url(),
  tunnels: z.array(TunnelSchema),
});

export type Tunnel = z.infer<typeof TunnelSchema>;
export type Config = z.infer<typeof ConfigSchema>;
