import { format } from "date-fns"
import { enGB as en } from "date-fns/locale/en-GB"

export const formatDate = (value: string): string => {
  return format(new Date(value), "dd.MM.yyyy HH:mm", { locale: en })
}
