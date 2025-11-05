import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function url(path: string) {
  const base = import.meta.env.BASE_URL || ''
  return `${base}${path}`
}
