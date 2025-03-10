
import { z } from 'zod';

export const reportFormSchema = z.object({
  report_type: z.string(),
  include_charts: z.boolean().default(true),
  include_raw_data: z.boolean().default(false),
});

export type ReportFormValues = z.infer<typeof reportFormSchema>;
