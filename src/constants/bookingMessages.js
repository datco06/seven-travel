export const BOOKING_MESSAGES = {
  vi: {
    loginRequired: 'Vui lòng đăng nhập để đặt tour.',
    roleNotAllowed: 'Chỉ khách hàng mới có thể đặt tour.',
    insufficient: 'Số dư không đủ. Vui lòng nạp thêm tiền trước khi đặt tour.',
    success: 'Đặt tour thành công! Thông tin đã gửi về quản trị viên để xử lý.',
    processing: 'Đang kiểm tra số dư của bạn...',
    genericError: 'Không thể hoàn tất đặt tour. Vui lòng thử lại sau.',
  },
  en: {
    loginRequired: 'Please sign in to book this tour.',
    roleNotAllowed: 'Only customer accounts can place bookings.',
    insufficient: 'Insufficient balance. Please top up before booking.',
    success: 'Booking confirmed! The admin team has received your details.',
    processing: 'Checking your balance...',
    genericError: 'Unable to complete the booking. Please try again shortly.',
  },
};

export const mapBookingErrorMessage = (language, message) => {
  const { insufficient, genericError } = BOOKING_MESSAGES[language] ?? BOOKING_MESSAGES.vi;
  if (!message) return genericError;
  if (/số dư không đủ/i.test(message) || /insufficient/i.test(message)) {
    return insufficient;
  }
  return message;
};
