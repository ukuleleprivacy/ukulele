type Message = Record<'title' | 'description', string>;

export function handleErrors(error: unknown, callback: (message: Message) => void, defaultMessage: Message) {
  if (
    error &&
    typeof error === 'object' &&
    'reason' in error &&
    typeof error.reason === 'string' &&
    error.reason === 'user rejected transaction'
  ) {
    callback({
      title: 'User Rejected the Transaction',
      description: '',
    });
  } else {
    callback(defaultMessage);
  }
}
