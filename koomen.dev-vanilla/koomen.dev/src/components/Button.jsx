// src/components/Button.jsx
import clsx from 'clsx';

/**
 * A minimal, accessible button component.
 *
 * Props
 * - variant: 'primary' | 'secondary' | 'outline'
 * - size:    'sm' | 'md' | 'lg'
 * - as:      React element type – defaults to 'button'
 * - ...rest: forwarded to the underlying element
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  as: Comp = 'button',
  className,
  ...rest
}) {
  const base =
    'inline-flex items-center justify-center font-medium rounded-lg ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
    'transition-colors disabled:opacity-50 disabled:pointer-events-none';

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base',
  };

  const variants = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600',
    secondary:
      'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-400',
    outline:
      'border border-gray-300 text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-400',
  };

  return (
    <Comp
      className={clsx(base, sizes[size], variants[variant], className)}
      {...rest}
    >
      {children}
    </Comp>
  );
}