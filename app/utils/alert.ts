import { Alert } from "react-native"

enum ErrorType {
  TIMEOUT = "timeout",
  CANNOT_CONNECT = "cannot-connect",
  SERVER = "server",
  UNAUTHORIZED = "unauthorized",
  FORBIDDEN = "forbidden",
  NOTFOUND = "not-found",
  REJECTED = "rejected",
  UNKNOWN = "unknown",
  BAD_DATA = "bad-data",
}

const getErrorMessage = (errType: string): string => {
  let errorMessage
  switch (errType) {
    case ErrorType.TIMEOUT:
      errorMessage = "Connection times up"
      break
    case ErrorType.CANNOT_CONNECT:
      errorMessage = "Failed to connect to the server"
      break
    case ErrorType.SERVER:
      errorMessage = "Server error"
      break
    case ErrorType.UNAUTHORIZED:
      errorMessage = "Unauthorized"
      break
    case ErrorType.FORBIDDEN:
      errorMessage = "No access"
      break
    case ErrorType.NOTFOUND:
      errorMessage = "Not found"
      break
    case ErrorType.REJECTED:
      errorMessage = "Connection rejected"
      break
    case ErrorType.UNKNOWN:
      errorMessage = "Unexpected error"
      break
    case ErrorType.BAD_DATA:
      errorMessage = "Incorrect data received"
      break
    default:
      errorMessage = "Unexpected error"
      break
  }

  return errorMessage
}

export const createAlertModal = (errorType: string, onTryAgainPressed: () => void) => {
  Alert.alert(getErrorMessage(errorType), "Please try again.", [
    {
      text: "Try Again",
      onPress: () => onTryAgainPressed(),
    },
    { text: "OK" },
  ])
}
