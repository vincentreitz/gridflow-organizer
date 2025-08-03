// Export all custom hooks
export { useLocalStorage } from './use-local-storage'
export { useHotkeys, useDialogHotkeys, useFormHotkeys } from './use-hotkeys'

// Re-export theme hook for convenience
export { useTheme } from '@/components/theme-provider'

// Export form hooks from react-hook-form if used
export { useForm, useFormContext, useController, useFieldArray, useWatch } from 'react-hook-form'
