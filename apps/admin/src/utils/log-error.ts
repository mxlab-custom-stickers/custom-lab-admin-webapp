type LogErrorOptions = {
  context?: string;
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
};

export function logError(error: unknown, options: LogErrorOptions = {}) {
  const { context, tags, extra } = options;

  const errorMessage =
    error instanceof Error ? error.message : typeof error === 'string' ? error : 'Unknown error';

  if (import.meta.env.DEV) {
    // Dev: log everything to console
    console.error(`[${context ?? 'Error'}]:`, error);
    if (tags) console.info('Tags:', tags);
    if (extra) console.info('Extra:', extra);
  } else {
    // Prod: replace this with Sentry or another tool later
    // For now, optionally log to console or ignore
    // console.error(`[${context ?? 'Error'}]: ${errorMessage}`);
    // Optionally send to your custom logging backend here
  }

  // Optional: return normalized error string
  return errorMessage;
}
