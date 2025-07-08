import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <MuiBreadcrumbs 
      aria-label="breadcrumb"
      sx={{ p: 2, px: 4 }}
    >
      {items.map((item, index) => (
        item.path ? (
          <Link
            key={index}
            component={RouterLink}
            to={item.path}
            color="primary"
            underline="hover"
            sx={{ cursor: 'pointer' }}
          >
            {item.label}
          </Link>
        ) : (
          <Typography key={index} color="text.secondary">
            {item.label}
          </Typography>
        )
      ))}
    </MuiBreadcrumbs>
  );
} 