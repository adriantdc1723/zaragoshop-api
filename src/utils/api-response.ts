export const good = (
  statusCode: number,
  data: Record<any, any>,
  message: string
) => ({ statusCode, data, message });

export const bad = (statusCode: number, message: string) => ({
  statusCode,
  message,
});
