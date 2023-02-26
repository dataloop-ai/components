export interface FormProps {
    name: string
}

export const useFormProps: {
    [key: string]: { type: any; default?: any; required?: boolean }
} = {
    name: {
        type: String,
        default: null
    }
}
