import { Button } from 'react-aria-components/Button';
import { EyeIcon } from '@/components/icons/EyeIcon';
import { EyeOffIcon } from '@/components/icons/EyeOffIcon';

type PasswordVisibilityButtonProps = {
  isVisible: boolean;
  onToggle: () => void;
};

export function PasswordVisibilityButton({ isVisible, onToggle }: PasswordVisibilityButtonProps) {
  return (
    <Button
      type="button"
      aria-label={isVisible ? 'Hide password' : 'Show password'}
      aria-pressed={isVisible}
      onPress={onToggle}
      className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-lionbank-brand outline-none transition-colors data-[focus-visible]:ring-2 data-[focus-visible]:ring-lionbank-brand-light data-[hovered]:bg-lionbank-brand-lighter data-[pressed]:bg-lionbank-brand-light"
    >
      {isVisible ? <EyeOffIcon className="size-5" /> : <EyeIcon className="size-5" />}
    </Button>
  );
}
