import { TextField } from '@mui/material';
import type { TextFieldProps, SxProps, Theme } from '@mui/material';

interface FormFieldProps extends Omit<TextFieldProps, 'sx'> {
  sx?: SxProps<Theme>;
}

export function FormField({ sx, ...props }: FormFieldProps) {
  return (
    <TextField
      fullWidth
      variant="outlined"
      sx={sx}
      {...props}
    />
  );
} 