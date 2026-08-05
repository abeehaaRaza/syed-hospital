// All hospital times use Pakistan Standard Time (Asia/Karachi, UTC+5)

export function getPakistanNow(): Date {
  return new Date();
}

// Returns time like "02:45 PM" in Pakistan time
export function formatPakistanTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString('en-US', {
    timeZone: 'Asia/Karachi',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

// Returns date like "03/08/2026" in Pakistan time
export function formatPakistanDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    timeZone: 'Asia/Karachi',
  });
}

// Returns full date+time in Pakistan time
export function formatPakistanDateTime(date: Date | string): string {
  return new Date(date).toLocaleString('en-GB', {
    timeZone: 'Asia/Karachi',
  });
}